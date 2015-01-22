window.optly.mrkt.events = {};

var gapi = window.gapi;
var apiKey = 'AIzaSyDvPXqy9MlOTG39-J-MHR-OR2d2YgyJ9uE';
var calendarId = 'optimizely.com_hh3e0hadjvjs9gh34mdlevverk@group.calendar.google.com';

window.optly.mrkt.events.showEvents = function(resp, div){

  var htmlDecode,
    currentDateTime = new Date(),
    futureEvents = [],
    pastEvents = [],
    templateContext = {};

  htmlDecode = function(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '">' + url + '</a>';
    });
  };

  if(!resp.error) {

      var i,
          items = resp.items;

      for(i = 0; i < items.length; i++){

        var entry, eventData, venue, startDate, endDate, zeroRegEx, description;

        entry = items[i];
        startDate = window.moment( entry.start.date || entry.start.dateTime );
        endDate = window.moment( entry.end.date || entry.end.dateTime );
        zeroRegEx = /\-0/g;

        if(typeof entry.location === 'string'){
          venue = entry.location.split(' /')[0];
        }

        description = entry.description.split('-- ')['1'].trim().replace(/\r?\n|\r/g, '');
        eventData = {
          title: entry.summary,
          link: entry.description.split(' --')[0],
          cityState: entry.location.split('/ ')[1],
          startMonth: startDate.format('MMM'),
          startDay: startDate.format('D'),
          endMonth: endDate.format('MMM'),
          endDay: endDate.format('D'),
          endYear: endDate.format('YYYY'),
          description: htmlDecode( description ),
          venue: venue
        };

        if(startDate.isAfter(currentDateTime)) {
          futureEvents.push(eventData);
        } else {
          pastEvents.push(eventData);
        }

      } //end for loop

      //reverse past events
      pastEvents.reverse();

      if(futureEvents.length > 30) {
        futureEvents.splice(30);
      }

      if(pastEvents.length > 30) {
        pastEvents.splice(0, pastEvents.length - 30);
      }

      templateContext.events = futureEvents;

      $(div).html(window.optly.mrkt.templates.eventDisplay(templateContext));
      
      $('body').delegate('#get-past-events', 'click', function(e){
        e.preventDefault();
        $('#get-future-events').parent().removeClass('hide-events-link');
        $(this).parent().addClass('hide-events-link');
        templateContext.events = pastEvents;
        $(div).html(window.optly.mrkt.templates.eventDisplay(templateContext));
      });
      
      $('body').delegate('#get-future-events', 'click', function(e){
        e.preventDefault();
        $('#get-past-events').parent().removeClass('hide-events-link');
        $(this).parent().addClass('hide-events-link');
        templateContext.events = futureEvents;
        $(div).html(window.optly.mrkt.templates.eventDisplay(templateContext));
      });

    } else {

      //report error to google analytics
      window.analytics.track(window.location.pathname, {
        category: 'api error',
        label: 'google cal api error: ' + typeof resp.error === 'object' ? JSON.stringify(resp.error) : resp.error
      }, {
        integrations: {
          Marketo: false
        }
      });

    }

};

function makeApiCall() {
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.list({
      'calendarId': calendarId,
      'orderBy': 'startTime',
      'singleEvents': true
    });

    request.execute(function(resp) {
      //show future events
      window.optly.mrkt.events.showEvents(resp, '#future-events-cont');
    });
  });
}

function gapiLoaded() {
  gapi.client.setApiKey(apiKey);
  makeApiCall();
}

function loadGapi() {
  //recursive hack because onload function isn't working for gapi
  if(!gapi) {
    return loadGapi();
  }
  gapi.load('auth', gapiLoaded);
}

loadGapi();

