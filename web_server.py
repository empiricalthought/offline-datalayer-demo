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
    if request.method == 'POST':
        print request.data
        new_data = request.get_json()
        if not new_data:
            abort(400)
        update_table(con, table, new_data['data'])
    statement = table.select()
    column_names = [c.name for c in statement.columns]
    results = [dict(zip(column_names, row))
               for row in con.execute(statement).fetchall()]
    con.close()
    return jsonify({'data': results})


def update_table(con, table, new_data):
    pk = list(table.primary_key.columns)[0].name
    xs1, xs2 = itertools.tee(iter(new_data))
    def p(x):
        return pk in x and x[pk] is not None
    new_items, changed_items = (list(itertools.ifilterfalse(p, xs1)),
                                list(itertools.ifilter(p, xs2)))
    if new_items:
        con.execute(table.insert(),
                    [dict((k, v) for k, v in new_item.iteritems() if k != pk)
                     for new_item in new_items])
    if changed_items:
        con.execute(table.update().where(table.c[pk] == bindparam('_id')),
                    *[dict(_id=x[pk], **x) for x in changed_items])


if __name__ == '__main__':
    app.debug = True
    app.run()
