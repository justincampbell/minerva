from distutils.core import setup

setup(
    name="geonodegp",
    version="0.2",
    author="",
    author_email="",
    description="geonodegp project, based on GeoNode",
    # Full list of classifiers can be found at:
    # http://pypi.python.org/pypi?%3Aaction=list_classifiers
    classifiers=[
        'Development Status :: 1 - Planning',
    ],
    license="BSD",
    keywords="geonode django",
    url='https://github.com/mbertrand/geonode-geonodegp',
    packages=['geonodegp'],
    install_requires=[
      'psycopg2',
      'requests',
      'celery[redis]',
      'redis',
      'flower',
    ],
    include_package_data=True,
    zip_safe=False,
)
