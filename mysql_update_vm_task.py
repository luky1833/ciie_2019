#!/usr/bin/python
# -*- coding: UTF-8 -*-
import pymysql
import json


# 打开数据库连接
class MysqlClass(BaseException):
    def get_drop_list_data(self, *args):
        batch = args[0]
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
            if batch != '':
                sql_select = "SELECT * FROM drop_list_data where drop_list_data.batch = {};".format(batch)
            else:
                sql_select = "SELECT * FROM drop_list_data;"
            cursor.execute(sql_select)
            for i in cursor.fetchall():
                data_list.append({
                    'id': i[0],
                    'drop_name': i[1],
                    'batch': i[2],
                    'site': i[3],
                    'color': i[4],
                    'state': i[5],
                    'bounced_content': i[6],
                    'alert': i[7],
                    'drop_radiation_speed': i[8]
                })
            connect.commit()
            connect.close()
            return 200, data_list
        except:
            connect.rollback()
            connect.close()
            return 500, '获取失败'

    # 更新数据库数据
    def mysql_update_drop_data(self, *args):
        id = args[0]
        site = args[1]
        color = args[2]
        batch = args[3]
        drop_radiation_speed = args[4]
        state = args[5]

        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )

        cursor = connect.cursor()
        sql = "UPDATE drop_list_data SET site = '{}',color = '{}',batch='{}',drop_radiation_speed='{}',state='{}'" \
              "WHERE drop_list_data.id = {}".format(site, color, batch, drop_radiation_speed, state, id)
        try:
            # 执行SQL语句
            print(sql)
            cursor.execute(sql)
            connect.commit()
            return 200, '修改成功'
            # 提交到数据库执行
        except:
            # 发生错误时回滚
            connect.rollback()
            connect.close()
            return 500, '修改失败'

    # 添加数据库数据
    def mysql_add_drop_data(self, *args):
        drop_name = args[0]
        batch = args[1]
        site = args[2]
        color = args[3]
        drop_radiation_speed = args[4]
        state = args[5]

        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )

        cursor = connect.cursor()
        sql = "INSERT INTO drop_list_data (drop_name,batch,site,color,drop_radiation_speed,state) " \
              "VALUES ('{}', '{}','{}','{}','{}','{}')".format(drop_name, batch, site, color, drop_radiation_speed,
                                                               state)
        try:
            # 执行SQL语句
            print(sql)
            cursor.execute(sql)
            connect.commit()
            return 200, '添加成功'
            # 提交到数据库执行
        except:
            # 发生错误时回滚
            connect.rollback()
            connect.close()
            return 500, '添加失败'

    # 删除数据库数据
    def mysql_delete_drop_data(self, *args):
        id = args[0]

        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )

        cursor = connect.cursor()
        sql = "DELETE FROM drop_list_data WHERE id={};".format(id)
        try:
            # 执行SQL语句
            print(sql)
            cursor.execute(sql)
            connect.commit()
            return 200, '删除成功'
            # 提交到数据库执行
        except:
            # 发生错误时回滚
            connect.rollback()
            connect.close()
            return 500, '删除失败'

    def get_all_data(self):
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
            cursor = connect.cursor()
            # SQL 更新语句
            sql_select = "SELECT * FROM all_drop_data;"
            cursor.execute(sql_select)
            result = cursor.fetchall()[0]
            data = {
                'all_batch_num': result[0],
                'all_batch_speed': result[1]
            }
            connect.close()
            return 200, data
        except:
            connect.rollback()
            connect.close()
            return 500, '获取失败'

    def edit_all_data(self, *args):
        all_batch_num = args[0]
        all_batch_speed = args[1]

        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )

        cursor = connect.cursor()
        sql = "UPDATE all_drop_data SET all_batch_num = '{}',all_batch_speed = '{}'".format(all_batch_num,
                                                                                            all_batch_speed)
        try:
            # 执行SQL语句
            print(sql)
            cursor.execute(sql)
            connect.commit()
            return 200, '修改成功'
            # 提交到数据库执行
        except:
            # 发生错误时回滚
            connect.rollback()
            connect.close()
            return 500, '修改失败'

    def edit_alert_data(self, *args):
        id = args[0]
        state = args[1]
        alert_data = args[2]

        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )

        sql = ''

        if str(state) == '3':
            color = 'red'
            sql = "UPDATE drop_list_data SET alert='{}', state='{}', color='{}'" \
                  "WHERE drop_list_data.id = {}".format(str(alert_data), state, color, id)
        elif str(state) == '1':
            color = 'green'
            sql = "UPDATE drop_list_data SET state='{}', color='{}'" \
                  "WHERE drop_list_data.id = {}".format(state, color, id)
        elif str(state) == '2':
            color = 'yellow'
            sql = "UPDATE drop_list_data SET state='{}', color='{}'" \
                  "WHERE drop_list_data.id = {}".format(state, color, id)

        cursor = connect.cursor()

        try:
            # 执行SQL语句
            print(sql)
            cursor.execute(sql)
            connect.commit()
            return 200, '修改成功'
            # 提交到数据库执行
        except:
            # 发生错误时回滚
            connect.rollback()
            connect.close()
            return 500, '告警信息推送失败'

    def edit_verification_gate(self, *args):
        id = args[0]
        verification_gate = args[1]

        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )

        drop_name = json.loads(verification_gate)['groupNameDevice']

        cursor = connect.cursor()
        sql = "UPDATE drop_list_data SET bounced_content='{}',drop_name='{}'" \
              "WHERE drop_list_data.id = {}".format(str(verification_gate), drop_name, id)
        try:
            # 执行SQL语句
            print(sql)
            cursor.execute(sql)
            connect.commit()
            return 200, '修改成功'
            # 提交到数据库执行
        except:
            # 发生错误时回滚
            connect.rollback()
            connect.close()
            return 500, '验证门信息更新失败'

    def get_drop_id_name(self, *args):

        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )

        data_list = []
        cursor = connect.cursor()
        sql = "SELECT drop_list_data.id,drop_list_data.drop_name FROM drop_list_data"
        try:
            # 执行SQL语句
            print(sql)
            cursor.execute(sql)

            for i in cursor.fetchall():
                data_list.append({
                    'id': i[0],
                    'groupNameDevice': i[1]
                })
            connect.commit()
            return 200, data_list
            # 提交到数据库执行
        except:
            # 发生错误时回滚
            connect.rollback()
            connect.close()
            return 500, '验证门信息更新失败'
