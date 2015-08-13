define(function() {
  return {
    queryMovies: function(callbackfunction) {
      $.ajax({ url: "https://movies-refactored.firebaseio.com/movie.json" }
        ).done(function(data) {
        console.log("This is my poplist", data);
        callbackfunction.call(this, data);
      });
    }
  };
});