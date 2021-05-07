/* Splash time para carregamento do site */
var width = 100,
  perfData = window.performance.timing, // The PerformanceTiming interface represents timing-related performance information for the given page.
  EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
  time = parseInt((EstimatedTime / 1500) % 60) * 100;

// Loadbar Animation
jQuery(".loadbar").animate({
  width: width + "%"
}, time);

// Loadbar Glow Animation
$(".glow").animate({
  width: width + "%"
}, time);

// Percentage Increment Animation
var PercentageID = jQuery("#precent"),
  start = 0,
  end = 100,
  durataion = time;
animateValue(PercentageID, start, end, durataion);

function animateValue(id, start, end, duration) {

  var range = end - start,
    current = start,
    increment = end > start ? 1 : -1,
    stepTime = Math.abs(Math.floor(duration / range)),
    obj = $(id);

  var timer = setInterval(function () {
    current += increment;
    $(obj).text(current + "%");
    //obj.innerHTML = current;
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}

// Fading Out Loadbar on Finised
setTimeout(function () {
  $('.preloader-wrap').fadeOut(300);
}, time);

/* Obtendo os dados via JSON */

var URL = "http://terrabrasilis.dpi.inpe.br/geoserver/wfs?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&OUTPUTFORMAT=application%2Fjson";
var biomes = ['amazonia', 'cerrado', 'caatinga', 'pantanal', 'mata-atlantica', 'pampa'];
var biomesInfo = [],
  ctrl = biomes.length;
biomes.forEach(biome => {
  let workspace = ("amazonia" == biome) ? ("prodes-amz") : ("prodes-" + biome);
  let get_data_url = URL + "&TYPENAME=" + workspace + ":" + biome + "_biome_general_info";
  //"../assets/"+biome+".json",
  $.ajax({
    type: "GET",
    url: get_data_url,
    dataType: "json",
    success: function (json) {
      biomesInfo[biome] = json.features[0].properties;
    },
    error: function (detail) {
      console.log(detail.statusText);
    },
    complete: function () {
      ctrl--;
      console.log("complete call to biome:" + biome + " and ctrl is: " + ctrl);
      if (!ctrl) {
        console.log("complete call to all biomes");
        displayData();
        //$('#loading').hide();
      }
    }
  });
});
var displayData = () => {
  biomes.forEach(
      (key, i)=> {
        let biomeValues = biomesInfo[key];
        if (typeof biomeValues == 'object') {
          let html = '<div class="col-lg-4 m' + key + '"><img src="images/' + key + '.svg" alt="Pantanal" class="img-fluid"></div><div class="col-lg-8"><div class="card-body workspace"><h5 class="card-title">' + key + '</h5><ul class="card-text">';
          for (let bv in biomeValues) {
            if (biomeValues.hasOwnProperty(bv)) {
              html += '<li>' + bv + ':' + biomeValues[bv] + ' km²</li>';
            }
          }
          html += '</ul></div>';
          $(".output" + i).append(html);
        }
      }
  );
};

/* Tooltip funcao */
$(".ttip").hover(
  function () {
    var $this = $(this),
      ttip = $($this).data("tip");
    setTimeout(function () {
      $(ttip).addClass("open");
    }, 150);
  },
  function () {
    var $this = $(this),
      ttip = $($this).data("tip");
    setTimeout(function () {
      $(ttip).removeClass("open");
    }, 150);
  });
