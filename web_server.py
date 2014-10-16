import itertools

from flask import Flask, abort, jsonify, request
from sqlalchemy import bindparam

import database


class CustomFlask(Flask):
    def get_send_file_max_age(self, name):
        return 5                # hack for easy reload


app = CustomFlask(__name__)


@app.route('/data/<resource_name>', methods=['GET', 'POST'])
def resource(resource_name):
    con = database.engine.connect()
    table = getattr(database, resource_name)
    pk = list(table.primary_key.columns)[0].name
    new_items = []
    new_item_ids = set()
    if request.method == 'POST':
        new_data = request.get_json()
        if not new_data:
            abort(400)
        new_items, new_item_ids = update_table(con, table, new_data['data'],
                                               new_data['meta']['temp_id'])
    statement = table.select()
    column_names = [c.name for c in statement.columns]
    all_items = [dict(zip(column_names, row))
                 for row in con.execute(statement).fetchall()]
    old_items = (item for item in all_items
                 if item[pk] not in new_item_ids)
    results = list(itertools.chain(new_items, old_items))
    con.close()
    return jsonify({'data': results})


def update_table(con, table, new_data, temp_id_name):
    pk = list(table.primary_key.columns)[0].name
    xs1, xs2 = itertools.tee(iter(new_data))
    def p(x):
        return pk in x and x[pk] is not None
    new_items, changed_items = (list(itertools.ifilterfalse(p, xs1)),
                                list(itertools.ifilter(p, xs2)))
    new_item_ids = set()
    if new_items:
        statement = table.insert()
        for new_item in new_items:
            fixed_item = dict((k, v) for k, v in new_item.iteritems()
                              if k not in (pk, temp_id_name))
            new_key = con.execute(statement, fixed_item).inserted_primary_key
            new_item[pk] = new_key[0]
            new_item_ids.add(new_key[0])
    if changed_items:
        con.execute(table.update().where(table.c[pk] == bindparam('_id')),
                    *[dict(_id=x[pk], **x) for x in changed_items])
    return new_items, new_item_ids

if __name__ == '__main__':
    app.debug = True
    app.run()
