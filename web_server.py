from flask import Flask, jsonify

import database

app = Flask(__name__)


@app.route('/data/<resource_name>')
def resource(resource_name):
    con = database.engine.connect()
    table = getattr(database, resource_name)
    statement = table.select()
    column_names = [c.name for c in statement.columns]
    results = [dict(zip(column_names, row))
               for row in con.execute(statement).fetchall()]
    print results
    con.close()
    return jsonify({'results': results})


if __name__ == '__main__':
    app.debug = True
    app.run()
