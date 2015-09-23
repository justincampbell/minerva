INSTALLED_APPS += ('geonodegp.data_queues.gfms',)
CELERYBEAT_SCHEDULE['gfms'] = {
    'task': 'geonodegp.data_queues.gfms.tasks.gfms_task',
    'schedule': crontab(minute='3'),
    'args': ()
}
