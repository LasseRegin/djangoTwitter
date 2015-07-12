
document.addEventListener("DOMContentLoaded", function(event) {

  $('#settings').tooltipster({
    contentAsHTML : true
  });

  //
  $.ajax({
    dataType: "json",
    url: createUrl('get_weekly_events'),
    success: function(data) {
      //console.log(data);
      showTweets(data.events);

      $(function() {
        $('a[href*=#]:not([href=#])').click(function() {
          if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
              $('html,body').animate({
                scrollTop: target.offset().top
              }, 1000);
              return false;
            }
          }
        });
      });
    }
  });

  $('.week-day-menu-button').click(function(e){
    $(e.target).addClass('active');
    console.log(e);
  });

  /*$('body')[0].onscroll = function(e) {
    checkMenuScroll(document.body.scrollTop);
  };*/
  $(window).scroll(function(e){
    checkMenuScroll($('body')[0].scrollTop);
  });

});

var weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var weekDaysTitlePos = [];


function showTweets(events){

  var eventsByDay = [];
  for(var j = 0; j < weekDays.length; j++){
    eventsByDay[j] = [];
  }

  // Rearrange tweets for proper order of weekdays
  var keys = Object.keys(events);
  for(var i = 0; i < keys.length; i++){
    var key = keys[i];
    for(var j = 0; j < weekDays.length; j++){
      if(key === weekDays[j].toLowerCase()){
        for(var k = 0; k < events[key].length; k++){
          eventsByDay[j].push(events[key][k]);
        }
      }
    }
  }

  var eventDiv = document.createElement('div');
  for(var i = 0; i < eventsByDay.length; i++){
    var dayDiv = document.createElement('div');
    dayDiv.className = 'dayDiv';
    dayDiv.id = weekDays[i];

    // Add title
    var titleDiv = document.createElement('h1');
    titleDiv.innerHTML = weekDays[i];
    titleDiv.className = 'ui header teal left aligned event-tweet-header';
    dayDiv.appendChild(titleDiv);

    // Add tweets
    for(var j = 0; j < eventsByDay[i].length; j++){
      dayDiv.appendChild(createTweetDiv(eventsByDay[i][j]));
    }
    eventDiv.appendChild(dayDiv);
  }

  // Create menu
  var menuDiv = document.createElement('div');
  menuDiv.className = 'ui vertical menu';
  for(var i = 0; i < eventsByDay.length; i++){
    var menuDayDiv = document.createElement('a');
    menuDayDiv.className = 'teal item week-day-menu-button';
    menuDayDiv.innerHTML = weekDays[i] + ' <div class="ui teal label">' + eventsByDay[i].length + '</div>';
    menuDayDiv.href = '#' + weekDays[i];

    if(menuDayDiv.attachEvent)
      menuDayDiv.attachEvent('onclick', onMenuClick); // For IE below v. 9
    menuDayDiv.addEventListener('click', onMenuClick , false); // For other

    menuDiv.appendChild(menuDayDiv);
  }
  $('#week-day-menu').html(menuDiv);

  $('#events').html(eventDiv);

  // Update week day title positions
  for(var i = 0; i < weekDays.length; i++){

    var element = document.getElementById(weekDays[i]);

    if(element){
      var rect = element.getBoundingClientRect();
      weekDaysTitlePos.push(rect.top);
    }
  }

}

function createTweetDiv(tweet){
  var tweetDiv = document.createElement('blockquote');
  tweetDiv.className = 'ui message event-tweet';

  // Profile picture
  var tweetImageDiv = document.createElement('div');
  var tweetImage = document.createElement('img');
  tweetImage.src = tweet.user.profile_picture;
  tweetImage.title = tweet.user.name;
  tweetImageDiv.className = 'profile-picture-div';

  tweetImageDiv.appendChild(tweetImage);
  tweetDiv.appendChild(tweetImageDiv);

  // Text
  var tweetTextDiv = document.createElement('div');
  tweetTextDiv.className = 'tweet-text-div';
  var tweetUser = document.createElement('p');
  tweetUser.innerHTML = 'By: <b>' + tweet.user.name + '</b>';
  var tweetText = document.createElement('p');
  tweetText.innerHTML = tweet.text;

  tweetTextDiv.appendChild(tweetUser);
  tweetTextDiv.appendChild(tweetText);
  tweetDiv.appendChild(tweetTextDiv);

  return tweetDiv;
}


function onMenuClick(e){
  //$(e.target).parent().children().removeClass('active');
  //$(e.target).addClass('active');
}

function checkMenuScroll(y){
  for(var i = weekDaysTitlePos.length - 1; i >= 0; i--){

    if(y > weekDaysTitlePos[i]){
      var element = $('#week-day-menu .menu a')[i];
      $(element).parent().children().removeClass('active');
      $(element).addClass('active');
      break;
    }
  }
}
