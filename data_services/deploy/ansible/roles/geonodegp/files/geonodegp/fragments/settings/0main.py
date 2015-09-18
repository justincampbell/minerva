from celery.schedules import crontab

CELERY_ALWAYS_EAGER = False
INSTALLED_APPS = ('celery', 'flower')

CELERYBEAT_SCHEDULE = {}
