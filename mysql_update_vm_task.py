#!/usr/bin/python
# -*- coding: UTF-8 -*-
import pymysql


# 打开数据库连接
class MysqlClass(BaseException):
    def get_drop_list_data(self, *args):
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
                    'id': i[0],
                    'drop_name': i[1],
                    'batch': i[2],
                    'site': i[3],
                    'color': i[4],
                    'state': i[5],
                    'bounced_content': i[6]
                })
            connect.commit()
            connect.close()
            return 200, data_list
        except:
            connect.rollback()
            connect.close()

    # 更新数据库数据
    def mysql_update_drop_data(self, *args):
        id = args[0]
        drop_name = args[1]
        batch = args[2]
        site = args[3]
        color = args[4]
        state = args[5]
        bounced_content = args[6]

        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )

        cursor = connect.cursor()
        sql = "UPDATE drop_list_data SET drop_name = '{}',batch = '{}',site='{}',color='{}',state='{}'," \
              "bounced_content='{}' WHERE drop_list_data.id = {}".format(
            drop_name, batch, site,
            color, state, bounced_content,
            id)
        try:
            # 执行SQL语句
            cursor.execute(sql)
            connect.commit()
            return 200, '修改成功'
            # 提交到数据库执行
        except:
            # 发生错误时回滚
            connect.rollback()
        connect.close()
