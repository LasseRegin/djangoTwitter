
document.addEventListener("DOMContentLoaded", function(event) {

  $('#settings').tooltipster({
    contentAsHTML : true
  });


  $('#classifier-form .submit').click(function(e){
    $('#classifier-form').submit();
  });

  $('#classifier-form').submit(function(e){
    e.preventDefault();

    var form = e.target;
    disableForm(form);

    var content = $(form).find('#tweet-text').val();

    var postData = {}

    postData.content = content;

    $.ajax({
      dataType: "json",
      url: createUrl('post'),
      data: postData,
      success: function(data) {

        var message;
        if(data.prediction === 1){
          message = "<div class=\"ui positive message\"> \
              <i class=\"close icon\"></i> \
              <div class=\"header\"> \
                Happy! \
              </div> \
              <p>The tweet was classified as <b>Happy</b>.</p> \
            </div>";
        }else if(data.prediction === -1){
          message = "<div class=\"ui negative message\"> \
              <i class=\"close icon\"></i> \
              <div class=\"header\"> \
                Unhappy! \
              </div> \
              <p>The tweet was classified as <b>Unhappy</b>.</p> \
            </div>";
        }

        // Show message
        $('#classifier-form #result-message').html(message);

        $('#classifier-form #result-message .close').click(function(e){
          $('#classifier-form #result-message').fadeOut(500);
          setTimeout(function(){
            $('#classifier-form #result-message').html('');
          });
        });

        var plotData = [{ label : 'Happy', data : data.proba_happy*100, color : '#7CFC00'},
                        { label : 'Unhappy', data : data.proba_angry*100, color : '#8B0000'}];
        $('#result-plot-header').html('Estimated mood probabilities');
        $('#classifier-form #result-plot').html('');
        $('#classifier-form #result-plot').css({ width : '350px', height : '350px', margin : '20px auto'})
        $.plot('#classifier-form #result-plot', plotData, {
          series: {
            pie: {
              show: true,
              radius: 1,
              label: {
                show: true,
                radius: 3/8,
                formatter: function (label, series) {
                  return '<div style="border:1px solid grey;font-size:8pt;text-align:center;padding:4px;box-sizing:border-box;color:white;">' +
                  label + ' : ' + Math.round(series.percent) + '%</div>';
                },
                background: {
                  opacity: 1.0,
                  color: '#000'
                }
              }
            }
          },
          legend: {
              show: false
          }
        });

        enableForm(form);
      }
    });


  });


});

function disableForm(form){
  $('#' + form.id + ' > div').addClass('loading segment');
  $('#' + form.id + ' #tweet-text').prop('disabled', 'disabled');
  $('#' + form.id + ' .submit').addClass('disabled');
}

function enableForm(form){
  $('#' + form.id + ' > div').removeClass('loading segment');
  $('#' + form.id + ' #tweet-text').removeProp('disabled');
  $('#' + form.id + ' .submit').removeClass('disabled');
}
