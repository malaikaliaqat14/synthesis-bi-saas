import pymysql

try:
    conn = pymysql.connect(host='127.0.0.1', user='root', password='root123')
    with conn.cursor() as cur:
        cur.execute("CREATE DATABASE IF NOT EXISTS saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        cur.execute("SHOW DATABASES LIKE 'saas';")
        res = cur.fetchall()
        print("DATABASE 'saas' STATUS:", res)
    conn.close()
    print("MySQL connection and database creation successful!")
except Exception as e:
    print("Database error:", e)
