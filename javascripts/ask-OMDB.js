define(['jquery'], function($) {
  return {
    getMovies: function(sentInfo, callbackfunction) {
      if(typeof sentInfo === "string") { // If it's a string, we're searching...
        $.ajax({
          url: "http://www.omdbapi.com/?s=" + sentInfo + "&type=movie"
        }).done(function(data) {
          callbackfunction.call(this, data);
        });
      } else { // ...otherwise it's a movie object, and we're pulling its info.
        $.ajax({
          url: "http://www.omdbapi.com/?t=" + sentInfo.Title + "&y=" + sentInfo.Year + "&plot=short&r=json"
        }).done(function(data) {
          var newMovie = {};
          newMovie.title = data.Title;
          newMovie.year = data.Year;
          newMovie.imdbid =data.imdbID;
          if(data.Poster !== "N/A") {
            newMovie.poster = data.Poster;
          }
          newMovie.notadded = true;
          callbackfunction.call(this, newMovie);
        });
      }
    }
  };
});