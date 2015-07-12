
document.addEventListener("DOMContentLoaded", function(event) {

  $('#limit-section-header, #limit-section').tooltipster({
    contentAsHTML : true
  });

  $.ajax({
    dataType: "json",
    url: createUrl('get_limits'),
    success: function(data) {

      showLimits(data.limits);

    }
  });

});


function showLimits(limits){

  var limit_keys = Object.keys(limits);

  var limit_ul = document.createElement('ul');

  for(var i = 0; i < limit_keys.length; i++){
    var limit = limits[limit_keys[i]];

    var limit_li = document.createElement('li');
    limit_li.innerHTML = '<b>' + limit_keys[i] + '</b>' + ': ' + limit;

    limit_ul.appendChild(limit_li);
  }

  $('#limit-section').html(limit_ul);
}
