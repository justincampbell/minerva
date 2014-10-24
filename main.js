// Globals
var key = null, visdata = [];

function main() {
  var mapOptions =
    {
      node: '#map',
      zoom : 4,
      center : {x: -12, y: 8}
    }, myMap = null,
       layer = null,
       tweetLayer = null,
       tweetFeature = null;

  /// Resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function updateAndDraw(width, height) {
    if (!myMap) {
      myMap = geo.map(mapOptions);
      layer = myMap.createLayer('osm'),
      tweetLayer = myMap.createLayer('feature');
    }
    myMap.resize(0, 0, width, height);
    myMap.draw();
  }

  function resizeCanvas() {
    updateAndDraw($('#map').width(), $('#map').height());
  }

  resizeCanvas();

  var countries;

  // start getting the country border data
  d3.json('/countries.geo.json', function (error, data) {
    if (error) {
      console.log(error);
      countries = null;
      return;
    }

    countries = data;
  });

  // save the current map state
  var mapState = null,
      featureLayer = myMap.createLayer('feature', {'renderer': 'd3Renderer'}),
      svg = featureLayer.canvas(); // this is a d3 object wrapping an svg group element

  var target = 'Sierra Leone';
  // Remove all features
  function resetMap() {
    svg.selectAll('*').remove();
  }

  function createChoropleth() {
    if (countries === undefined) {
      window.setTimeout(createChoropleth, 100);
      return;
    } else if (countries === null) {
      console.log('Could not load country data');
      return;
    }

    resetMap();

    // find the country data for `target`
    var feature;
    countries.features.forEach(function (f) {
      if (f.properties.name === target) {
        feature = f;
      }
    });

    feature.path = [];
    // georefence the coordinates TODO support holes
    feature.geometry.coordinates[0].forEach(function (pt) {
      feature.path.push(featureLayer.renderer().worldToDisplay({
        x: pt[0],
        y: pt[1]
      }));
    });

    // draw the border
    var line = d3.svg.line()
      .x(function (d) { return d.x; })
      .y(function (d) { return d.y; });

    svg.selectAll('path')
      .data([feature.path])
      .enter().append('path')
        .attr('d', function (d) { return line(d) + 'Z'; })
        .attr('class', 'border')
        .style('fill', 'yellow')
        .style('fill-opacity', 0.25);

    featureLayer.geoOn(geo.event.d3Rescale, function (arg) {
      // TODO need to unbind on exit
      svg.selectAll('.border')
        .style('stroke-width', 1/arg.scale);
    });
  }

  //$('#choropleth').click(createChoropleth);
  createChoropleth();

  // Test streams
  tangelo.stream.start("example", function(d) { key = d; console.log(key);
    tangelo.stream.run(key, function(data) {
      data = eval(data);
      if (data && data.length !== 0) {
        visdata.push(data[0]);
        if (tweetFeature) {
          tweetLayer.deleteFeature(tweetFeature);
        }
        tweetFeature = tweetLayer.createFeature("point", {selectionAPI: true})
          .data(visdata)
          .geoOn(geo.event.pointFeature.mouseover, function (d) {
            $('#popup').css({
              top: d.mouse.page.y,
              left: d.mouse.page.x,
              position: "absolute",
              display: ""
            })
            $('#popup a').html(d.data.text);
          })
          .geoOn(geo.event.pointFeature.mouseout, function (d) {
            $('#popup').css({display: "none"});
          })
          .position(function (d) { return { x: d.location.coordinates[1],
                                            y: d.location.coordinates[0],
                                            z: 0
                                          }})
        myMap.draw();
      }
    });
  });
}

function exit() {
  if (key !== null) {
    tangelo.stream.delete(key);
  }
}
