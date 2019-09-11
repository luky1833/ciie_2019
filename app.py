from flask import Flask, render_template
from flask import request, Response
import json
from mysql_update_vm_task import MysqlClass

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/love', methods=['GET', 'POST', 'PUT'])
def demo():
    data = dict()
    data['menu'] = 'manager'
    data['submenu'] = 'managerIndex1'
    data['power_opts'] = '2323'
    return render_template('index.html', data=data)


@app.route('/get_drop_list_data', methods=['GET'])
def get_drop_list_data():
    uuid = request.args.get('uuid', '')
    _ret = {
        'code': 200,
        'message': '获取成功',
        'data': {}
    }

    result = MysqlClass().mysql_update(uuid)

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
