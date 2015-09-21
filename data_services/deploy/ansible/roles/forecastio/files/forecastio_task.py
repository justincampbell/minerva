@shared_task
def forecast_io_task():
    processor = ForecastIOAirTempProcessor()
    processor.run()
