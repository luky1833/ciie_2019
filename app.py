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


@app.route('/'
           '', methods=['GET', 'POST', 'PUT'])
def demo():
    data = dict()
    data['menu'] = 'manager'
    data['submenu'] = 'managerIndex1'
    data['power_opts'] = '2323'
    return render_template('index.html', data=data)


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
    drop_name = request.args.get('drop_name', 'demo55')
    batch = request.args.get('batch', '1')
    site = request.args.get('site', '20,56')
    color = request.args.get('color', 'blue')
    state = request.args.get('state', '2')
    bounced_content = request.args.get('bounced_content', '测试2')

    _ret = {
        'code': 200,
        'message': '修改成功',
        'data': {}
    }
    result = MysqlClass().mysql_update_drop_data(id, drop_name, batch, site, color, state, bounced_content)

    if result[0] == 200:
        _ret['data'] = result[1]
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['message'] = result[1]
        return json.dumps(_ret)


# return 'this is demo!'


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        threaded=True,
        debug=True
    )
