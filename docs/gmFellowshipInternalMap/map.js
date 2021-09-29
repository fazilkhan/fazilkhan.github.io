
mapboxgl.accessToken = "pk.eyJ1IjoiZmF6aWxraGFuIiwiYSI6ImNrcm00Y2lwYzc0MWsydnF1dTJxbjNsbWUifQ.UZ-_vM0aTglLe7I7XkpcuQ";

    var map = new mapboxgl.Map({
        container: 'map',
        style: "mapbox://styles/fazilkhan/cktsxsqgu043d19qjmhzurp4b",
        zoom: 9.5,
        center: [-74, 40.71]
    });

    map.on("load", function () {
        map.addLayer(
          {
            id: "addresses",
            type: "circle",
            source: {
              type: "geojson",
              data: "data/caseAddresses.geojson",
            },
            paint: {
              "circle-radius": 4,
              "circle-opacity": 0.7,
              "circle-color": '#85c8ba',
              "circle-stroke-color": "#4d4d4d",
              "circle-stroke-width": 0.5,
            },
          },
          "road-label-simple"
        );

        map.addLayer(
          {
            id: "boroughCases",
            type: "fill",
            source: {
              type: "geojson",
              data: "data/boroConfirmedCases.geojson",
            },
            paint: {
              "fill-opacity": 0.4,
              'fill-color': [
                'match',
                ['get', 'BoroName'],
                'Bronx',
                '#fbb03b',
                'Brooklyn',
                '#223b53',
                'Manhattan',
                '#e55e5e',
                'Queens',
                '#3bb2d0',
                'Staten Island',
                '#446faa',
                /* other */ '#ccc'
                ]
            },
          },
          "addresses"
        );

        map.addLayer(
          {
            id: "casesPerThousand",
            type: "fill",
            source: {
              type: "geojson",
              data: "data/covidAndForeignBorn.geojson",
            },
            paint: {
              "fill-opacity": 0.7,
              'fill-outline-color': '#ffffff',
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Case_RatePer1K'],
                0,
                '#ffffb2',
                220,
                '#f03b20',
                ]
            },
          },
          "addresses"
        );

        map.addLayer(
          {
            id: "casesPerThousand_hoverOutline",
            type: "line",
            source: {
              type: "geojson",
              data: "data/covidAndForeignBorn.geojson",
            },
            paint: {
              "line-opacity": 1,
              'line-color': '#000000',
              'line-width': 2, 
            },
            "filter": ["==", "MOD_ZCTA", ""]
          },
          "addresses"
        );
      
        map.addLayer(
          {
            id: "foreignBornPop",
            type: "fill",
            source: {
              type: "geojson",
              data: "data/covidAndForeignBorn.geojson",
            },
            paint: {
              "fill-opacity": 0.7,
              'fill-outline-color': '#ffffff',
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'foreignBornPerc'],
                0,
                '#ffffb2',
                80,
                '#f03b20',
                ]
            },
          },
          "addresses"
        );

        map.addLayer(
          {
            id: "foreignBornPop_hoverOutline",
            type: "line",
            source: {
              type: "geojson",
              data: "data/covidAndForeignBorn.geojson",
            },
            paint: {
              "line-opacity": 1,
              'line-color': '#000000',
              'line-width': 2, 
            },
            "filter": ["==", "MOD_ZCTA", ""]
          },
          "addresses"
        );

        // var layers = ['0-1,000', '1,000-2,000', '2,000-3,000', '3,000+'];
        // var colors = ['#fdd0a2', '#fd8d3c', '#d94801', '#8c2d04'];

        // for (i = 0; i < layers.length; i++) {
        //   var layer = layers[i];
        //   var color = colors[i];
        //   var item = document.createElement('div');
        //   var key = document.createElement('span');
        //   key.className = 'legend-key';
        //   key.style.backgroundColor = color;

        //   var value = document.createElement('span');
        //   value.innerHTML = layer;
        //   item.appendChild(key);
        //   item.appendChild(value);
        //   legend.appendChild(item);
        // };
      });

  /// Adding popups on hover to addresses.
    
    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'addresses', function (e) {
        map.getCanvas().style.cursor = 'pointer';
        var name = e.features[0].properties.firstName;
        var surname = e.features[0].properties.lastName;
        var strAdd = e.features[0].properties.fullAddress;
        var diedOn = e.features[0].properties.deathDate;
        var gender = e.features[0].properties.gender;
        var age = e.features[0].properties.age;
        var coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
        
        popup
            .setLngLat(coordinates)
            .setHTML('<h2>' + name + '&nbsp;' + surname + ',' + '&nbsp;' + age + '</h2>'
            + '<p><strong>Address:</strong> '+ strAdd +'</p>'
            + '<p><strong>Died on:</strong> '+ diedOn +'</p>'
            + '<p><strong>Gender:</strong> '+ gender +'</p>')
            .addTo(map);
      });

    map.on('mouseleave', 'addresses', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

  //////

    // For adding stroke on hover to ZIP code boundaries.

    map.on("mousemove", "casesPerThousand", "foreignBornPop", function(e) {
        map.getCanvas().style.cursor = 'pointer';
        map.setFilter("casesPerThousand_hoverOutline", "foreignBornPop_hoverOutline", ["==", "MOD_ZCTA", e.features[0].properties.MOD_ZCTA]);
    });

    map.on("mouseleave", "casesPerThousand", "foreignBornPop", function() {
        map.getCanvas().style.cursor = '';
        map.setFilter("casesPerThousand_hoverOutline", "foreignBornPop_hoverOutline", ["==", "MOD_ZCTA", ""]);
    });

    /////

    /// Adding click popups for Zip (info).

    map.on('click', 'casesPerThousand', function (e) {
        var zip = e.features[0].properties.MOD_ZCTA;
        var neighborhood = e.features[0].properties.Neighborhood;
        var confirmedCases = e.features[0].properties.COVID_Case_Count;
        var confirmedDeaths = e.features[0].properties.COVID_Death_Count;
        var confirmedDeathRate = e.features[0].properties.Death_RatePer1K;
        var caseFatality = e.features[0].properties.Case_Fatality_Rate;
      // stateName = stateName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h2>'+zip+'</h2>'
            +'<h4>'+neighborhood+'</h4>'
            + '<p><strong>Canfirmed cases:</strong> '+ confirmedCases +'</p>'
            + '<p><strong>Confirmed deaths:</strong> '+ confirmedDeaths +'</p>'
            + '<p><strong>Death rate per 1K:</strong> '+ confirmedDeathRate +'</p>'
            + '<p><strong>Case fatality %:</strong> '+ caseFatality +'</p>'
            + '<p><i>' + "(As of Sept. 27)" + '</i></p>')
        .addTo(map);
    });

    map.on('mouseenter', 'casesPerThousand', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'casesPerThousand', function () {
        map.getCanvas().style.cursor = '';
    });

  //////

////Adding filter buttons.

    // After the last frame rendered before the map enters an "idle" state.
    map.on('idle', () => {
  // If these two layers were not added to the map, abort
        if (!map.getLayer('addresses') || !map.getLayer('boroughCases') || !map.getLayer('casesPerThousand') || !map.getLayer('foreignBornPop')) {
            return;
    }
   
  // Enumerate ids of the layers.
        const toggleableLayerIds = ['addresses', 'boroughCases', 'casesPerThousand', 'foreignBornPop'];
   
  // Set up the corresponding toggle button for each layer.
        for (const id of toggleableLayerIds) {
  // Skip layers that already have a button set up.
            if (document.getElementById(id)) {
                continue;
            }
   
  // Create a link.
            const link = document.createElement('a');
            link.id = id;
            link.href = '#';
            link.textContent = id;
            link.className = 'active';
   
  // Show or hide layer when the toggle is clicked.
            link.onclick = function (e) {
            const clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();
   
            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
            );
   
  // Toggle layer visibility by changing the layout object's visibility property.
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                  this.className = 'active';
                  map.setLayoutProperty(
                  clickedLayer,
                  'visibility',
                  'visible'
                  );
              }
            };
   
            const layers = document.getElementById('menu');
            layers.appendChild(link);
          }
    });
  