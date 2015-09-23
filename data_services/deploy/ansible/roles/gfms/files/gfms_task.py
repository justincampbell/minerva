@shared_task()
def gfms_task():
    gfms = GFMSProcessor()
    gfms.run()
