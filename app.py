from flask import Flask, render_template
from flask import request, Response
import json
from mysql_update_vm_task import MysqlClass

app = Flask(__name__)
from flask_cors import CORS

CORS(app, supports_credentials=True)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/love', methods=['GET', 'POST', 'PUT'])
def demo():
    return render_template('love.html')


@app.route('/ddd', methods=['GET', 'POST', 'PUT'])
def demo2():
    data = dict()
    data['menu'] = 'manager'
    data['submenu'] = 'managerIndex1'
    data['power_opts'] = '2323'
    result = MysqlClass().get_drop_list_data('')
    if result[0] == 200:
        data = result[1]
    else:
        return render_template('errors/500.html')

    return render_template('notifylist.html', data=data)


@app.route('/get_drop_list_data', methods=['GET'])
def get_drop_list_data():
    batch = request.args.get('batch', '')
    _ret = {
        'code': 200,
        'message': '获取成功',
        'data': {}
    }

    result = MysqlClass().get_drop_list_data(batch)

    if result[0] == 200:
        _ret['data'] = result[1]
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['message'] = result[1]
        return json.dumps(_ret)


@app.route('/mysql_update_drop_data', methods=['GET'])
def update_drop_data():
    id = request.args.get('id', 1)
    drop_name = request.args.get('drop_name', '')
    batch = request.args.get('batch', 1)
    site = request.args.get('site', '')
    color = request.args.get('color', '')
    state = request.args.get('state', '')
    bounced_content = request.args.get('bounced_content', '')
    alert = request.args.get('alert', '')

    _ret = {
        'code': 200,
        'message': '修改成功',
        'data': {}
    }
    result = MysqlClass().mysql_update_drop_data(id, drop_name, batch, site, color, state, bounced_content, alert)

    if result[0] == 200:
        _ret['data'] = result[1]
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['message'] = result[1]
        return json.dumps(_ret)


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        threaded=True,
        debug=True
    )
