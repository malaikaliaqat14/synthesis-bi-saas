# Ensure PyMySQL acts as MySQLdb for Django
import pymysql
pymysql.install_as_MySQLdb()

# Celery application initialization
from .celery import app as celery_app

__all__ = ('celery_app',)
