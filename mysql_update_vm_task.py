#!/usr/bin/python
# -*- coding: UTF-8 -*-
import pymysql


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
                    'alert': i[7]
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
        drop_name = args[1]
        batch = args[2]
        site = args[3]
        color = args[4]
        state = args[5]
        bounced_content = args[6]
        alert = args[7]

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
              "bounced_content='{}',alert='{}' WHERE drop_list_data.id = {}".format(
            drop_name, batch, site,
            color, state, bounced_content, alert,
            id)
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
        state = args[4]
        bounced_content = args[5]
        alert = args[6]

        connect = pymysql.Connect(
            host='47.103.66.5',
            port=33890,
            user='root',
            passwd='ViewSonic123$%^',
            db='ciie_2019',
            charset='utf8'
        )

        cursor = connect.cursor()
        sql = "INSERT INTO drop_list_data (drop_name,batch,site,color,state,bounced_content,alert) " \
              "VALUES ('{}', '{}','{}','{}','{}','{}','{}')".format(drop_name, batch, site, color, state,
                                                                    bounced_content, alert)
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
