from flask import Flask, render_template
from flask import request, Response
import json
from mysql_update_vm_task import MysqlClass

app = Flask(__name__)
from flask_cors import CORS

CORS(app, supports_credentials=True)



@app.route('/')
def hello_world():
    return render_template('fronted.html')


@app.route('/index', methods=['GET', 'POST', 'PUT'])
def index():
    return render_template('fronted.html')


@app.route('/love', methods=['GET', 'POST', 'PUT'])
def love():
    return render_template('love.html')


# 后端设置页面
@app.route('/admin', methods=['GET', 'POST', 'PUT'])
def demo2():
    return render_template('backend.html')


#

# 获取所有点位数据信息
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


# 更新点位数据信息
@app.route('/mysql_update_drop_data', methods=['GET'])
def update_drop_data():
    id = request.args.get('id', 1)
    site = request.args.get('site', '')
    color = request.args.get('color', '')
    state = request.args.get('state', '')
    batch = request.args.get('batch', '')
    drop_radiation_speed = request.args.get('drop_radiation_speed', '')  # 放射线速度

    _ret = {
        'code': 200,
        'message': '修改点位信息成功',
        'data': {}
    }

    result = MysqlClass().mysql_update_drop_data(id, site, color, batch, drop_radiation_speed, state)

    if result[0] == 200:
        _ret['data'] = result[1]
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['message'] = result[1]
        return json.dumps(_ret)


# 添加点位数据信息
@app.route('/mysql_add_drop_data', methods=['GET'])
def add_drop_data():
    drop_name = request.args.get('drop_name', '')
    batch = request.args.get('batch', 1)
    site = request.args.get('site', '')
    color = request.args.get('color', '')
    state = request.args.get('state', '')
    drop_radiation_speed = request.args.get('drop_radiation_speed', '')

    _ret = {
        'code': 200,
        'message': '添加点位信息成功',
        'data': {}
    }
    result = MysqlClass().mysql_add_drop_data(drop_name, batch, site, color, drop_radiation_speed, state)

    if result[0] == 200:
        _ret['data'] = result[1]
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['message'] = result[1]
        return json.dumps(_ret)


# 删除点位数据信息
@app.route('/mysql_delete_drop_data', methods=['GET'])
def delete_drop_data():
    id = request.args.get('id', '')

    _ret = {
        'code': 200,
        'message': '删除点位信息成功',
        'data': {}
    }
    result = MysqlClass().mysql_delete_drop_data(id)

    if result[0] == 200:
        _ret['data'] = result[1]
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['message'] = result[1]
        return json.dumps(_ret)


# 获取全部的设置信息
@app.route('/get_all_data', methods=['GET'])
def get_all_data():
    _ret = {
        'code': 200,
        'message': '获取全部信息成功',
        'data': {}
    }
    result = MysqlClass().get_all_data()

    if result[0] == 200:
        _ret['data'] = result[1]
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['message'] = result[1]
        return json.dumps(_ret)


# 修改全部的设置信息
@app.route('/edit_all_data', methods=['GET'])
def edit_all_data():
    all_batch_num = request.args.get('all_batch_num', '')
    all_batch_speed = request.args.get('all_batch_speed', '')
    _ret = {
        'code': 200,
        'message': '修改全部信息成功',
        'data': {}
    }
    result = MysqlClass().edit_all_data(all_batch_num, all_batch_speed)

    if result[0] == 200:
        _ret['data'] = result[1]
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['message'] = result[1]
        return json.dumps(_ret)


# 告警信息推送修改
@app.route('/edit_alert_data', methods=['GET', 'POST'])
def edit_alert_data():
    request_url = None
    if request.method == 'GET':
        request_url = request.args
    elif request.method == 'POST':
        request_url = request.form
    id = request_url.get('id', '')
    color = request_url.get('color', '')
    alert_data = request_url.get('alert_data', '')

    _ret = {
        'code': 200,
        'status': 'success',
        'errmsg': ''
    }

    if color == 'red' and alert_data == '':
        _ret['code'] = 400
        _ret['status'] = 'failed'
        _ret['errmsg'] = '缺少参数 alert_data'
        return json.dumps(_ret)

    if id == '':
        _ret['code'] = 400
        _ret['status'] = 'failed'
        _ret['errmsg'] = '缺少参数 id'
        return json.dumps(_ret)

    result = MysqlClass().edit_alert_data(id, color, alert_data)

    if result[0] == 200:
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['status'] = 'failed'
        _ret['errmsg'] = result[1]
        return json.dumps(_ret)


# 获取验证门的信息
@app.route('/edit_verification_gate', methods=['GET', 'POST'])
def edit_verification_gate():
    request_url = None
    if request.method == 'GET':
        request_url = request.args
    elif request.method == 'POST':
        request_url = request.form
    id = request_url.get('id', '')
    verification_gate = request_url.get('verification_gate', '')

    _ret = {
        'code': 200,
        'status': 'success',
        'errmsg': ''
    }

    if id == '':
        _ret['code'] = 400
        _ret['status'] = 'failed'
        _ret['errmsg'] = '缺少参数 id'
        return json.dumps(_ret)

    result = MysqlClass().edit_verification_gate(id, verification_gate)

    if result[0] == 200:
        return json.dumps(_ret)
    else:
        _ret['code'] = 500
        _ret['status'] = 'failed'
        _ret['errmsg'] = result[1]
        return json.dumps(_ret)

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        threaded=True,
        debug=True
    )
