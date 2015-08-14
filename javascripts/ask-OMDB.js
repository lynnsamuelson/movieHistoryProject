define(['jquery'], function($) {
  return {
    getMovies: function(sentInfo, callbackfunction) {
      var searchString;
      if(sentInfo === "find") {
        searchString = $("#search-input").val();
        $.ajax({
          url: "http://www.omdbapi.com/?s=" + searchString + "&type=movie"
        }).done(function(data) {
          $("#search-input").val("");
          callbackfunction.call(this, data);
        });
      } else {
        $.ajax({
          url: "http://www.omdbapi.com/?t=" + sentInfo.addTitle + "&y=" + sentInfo.addYear + "&plot=short&r=json"
        }).done(function(data) {
          var newMovie = {};
          newMovie.title = data.Title;
          newMovie.poster = data.Poster;
          callbackfunction.call(this, newMovie);
        });
      }
    }
  };
});