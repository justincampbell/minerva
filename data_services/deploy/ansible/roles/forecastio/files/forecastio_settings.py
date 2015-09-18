INSTALLED_APPS += ('geonodegp.data_queues.forecastio',)
CELERYBEAT_SCHEDULE['forecast_io'] = {
    'task': 'geonodegp.data_queues.forecastio.tasks.forecast_io_task',
    'schedule': crontab(minute='1'),
    'args': ()
}
