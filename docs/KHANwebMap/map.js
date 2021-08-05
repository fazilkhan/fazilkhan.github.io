
mapboxgl.accessToken = "pk.eyJ1IjoiZmF6aWxraGFuIiwiYSI6ImNrcm00Y2lwYzc0MWsydnF1dTJxbjNsbWUifQ.UZ-_vM0aTglLe7I7XkpcuQ";

    var map = new mapboxgl.Map({
        container: 'map',
        style: "mapbox://styles/fazilkhan/ckrm6yg371z1d17qvmso9tvrj",
        zoom: 8.5,
        center: [-66.5, 18.2]
    });

    map.on("load", function () {
        // map.addLayer(
        //   {
        //     id: "us_states_elections_outline",
        //     type: "line",
        //     source: {
        //       type: "geojson",
        //       data: "data/statesElections.geojson",
        //     },
        //     maxzoom: 6,
        //     paint: {
        //       "line-color": "#ffffff",
        //       "line-width": 0.7,
        //     },
        //   },
        //   "waterway-label"
        // );
        // map.addLayer(
        //   {
        //     id: "us_states_elections",
        //     type: "fill",
        //     source: {
        //       type: "geojson",
        //       data: "data/statesElections.geojson",
        //     },
        //     maxzoom: 6,
        //     paint: {
        //       "fill-color": [
        //         "match",
        //         ["get", "Winner"],
        //         "Donald Trump",
        //         "#cf635d",
        //         "Hillary Clinton",
        //         "#6193c7",
        //         "OTHER",
        //         "#91b66e",
        //         "#ffffff",
        //       ],
        //       "fill-outline-color": "#000000",
        //       "fill-opacity": [
        //         "step",
        //         ["get", "WnrPerc"],
        //         0.3,
        //         0.4,
        //         0.5,
        //         0.5,
        //         0.7,
        //         0.6,
        //         0.9,
        //       ],
        //     },
        //   },
        //   "us_states_elections_outline"
        // );
        map.addLayer(
          {
            id: "counties_outline",
            type: "line",
            source: {
              type: "geojson",
              data: "data/vacHouses.geojson",
            },
            // minzoom: 8.5,
            paint: {
              "line-color": "grey",
              "line-width": 0.5,
            },
          },
          "waterway-shadow"
        );
        map.addLayer(
          {
            id: "vacantHouses",
            type: "fill",
            source: {
              type: "geojson",
              data: "data/vacHouses.geojson",
            },
            paint: {
              "fill-opacity": 1,
              "fill-color": [
                "step",
                ["get", "VacHousesPer10K"],
                "#ffffff",
                0.0,
                "#fdd0a2",
                1000.0,
                "#fd8d3c",
                2000.0,
                "#d94801",
                3000.0,
                "#8c2d04"
              ],
            },
          },
          "counties_outline"
        );
        var layers = ['0-1,000', '1,000-2,000', '2,000-3,000', '3,000+'];
        var colors = ['#fdd0a2', '#fd8d3c', '#d94801', '#8c2d04'];

        for (i = 0; i < layers.length; i++) {
          var layer = layers[i];
          var color = colors[i];
          var item = document.createElement('div');
          var key = document.createElement('span');
          key.className = 'legend-key';
          key.style.backgroundColor = color;

          var value = document.createElement('span');
          value.innerHTML = layer;
          item.appendChild(key);
          item.appendChild(value);
          legend.appendChild(item);
        };
      });

// Create the popup
// map.on('click', 'us_states_elections', function (e) {
//     var stateName = e.features[0].properties.State;
//     var winner = e.features[0].properties.Winner;
//     var wnrPerc = e.features[0].properties.WnrPerc;
//     var totalVotes = e.features[0].properties.Total;
//     wnrPerc = (wnrPerc * 100).toFixed(0);
//     totalVotes = totalVotes.toLocaleString();
//     stateName = stateName.toUpperCase();
//     new mapboxgl.Popup()
//         .setLngLat(e.lngLat)
//         .setHTML('<h4>'+stateName+'</h4>'
//             +'<h2>'+winner+'</h2>'
//             + '<p>'+wnrPerc+'% - ('+totalVotes+' votes)</p>')
//         .addTo(map);
// });
// // Change the cursor to a pointer when the mouse is over the us_states_elections layer.
// map.on('mouseenter', 'us_states_elections', function () {
//     map.getCanvas().style.cursor = 'pointer';
// });
// // Change it back to a pointer when it leaves.
// map.on('mouseleave', 'us_states_elections', function () {
//     map.getCanvas().style.cursor = '';
// });

map.on('click', 'vacantHouses', function (e) {
    // var stateName = e.features[0].properties.State;
    var countyName = e.features[0].properties.BASENAME;
    var totalVacant = e.features[0].properties.totalVacantHouses;
    var vacantPer10K = e.features[0].properties.VacHousesPer10K;
    // var totalVotes = e.features[0].properties.Total;
    // wnrPerc = (wnrPerc * 100).toFixed(0);
    totalVacant = totalVacant.toLocaleString();
    // stateName = stateName.toUpperCase();
    countyName = countyName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h2>' + countyName + '</h2>'
            + '<p><strong>Total Vacant Houses: </strong>' + totalVacant + '</p>'
            + '<p><strong>Vacant per 10K: </strong>' + vacantPer10K + '</p>')
        .addTo(map);
});
map.on('mouseenter', 'vacantHouses', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'vacantHouses', function () {
    map.getCanvas().style.cursor = '';
});