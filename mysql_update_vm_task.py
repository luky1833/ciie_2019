#!/usr/bin/python
# -*- coding: UTF-8 -*-
import pymysql


# 打开数据库连接
class MysqlClass(BaseException):
    def mysql_update(self, *args):
        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )
        try:
            # 使用cursor()方法获取操作游标
            data_list = []
            cursor = connect.cursor()
            # SQL 更新语句
            sql_select = "SELECT * FROM drop_list_data;"
            cursor.execute(sql_select)
            for i in cursor.fetchall():
                data_list.append({
                    'name': i[1],
                    'batch': i[2],
                    'site': i[3],
                    'color': i[4],
                    'state': i[5],
                    'bounced_content': i[6],
                })
            connect.commit()
            connect.close()
            return 200, data_list
        except:
            connect.rollback()
            connect.close()

    # # 根据克隆虚拟机任务返回结果,操作数据库修改任务状态结果
    # def mysql_update_res_vm(self, *args):
    #     vm_id = args[0]
    #     state = args[1]
    #     ems_ref = args[2]
    #     new_vm_uuid = args[3]
    #     if str(ems_ref) != '':
    #         ems_ref = str(ems_ref).split(':')[1].split("'")[0]
    #     db = pymysql.connect("31.16.10.29", "root", "ECDATA_q1w2e3r4", "cmp-v2", charset='utf8')
    #     cursor = db.cursor()
    #     sql = "UPDATE res_vm SET state = '{}',ems_ref = '{}',uuid='{}' WHERE res_vm.id = '{}'".format(state, ems_ref,
    #                                                                                                   new_vm_uuid,
    #                                                                                                   vm_id)
    #     try:
    #         # 执行SQL语句
    #         cursor.execute(sql)
    #         db.commit()
    #         # 提交到数据库执行
    #     except:
    #         # 发生错误时回滚
    #         db.rollback()
    #     db.close()
