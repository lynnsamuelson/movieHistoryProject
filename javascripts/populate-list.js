define(function() {
  return {
    queryMovies: function(callbackfunction) {
      $.ajax({ url: "https://glaring-torch-7890.firebaseio.com/movie.json" }
        ).done(function(data) {
        console.log("This is my poplist", data);
        callbackfunction.call(this, data);
      });
    }
  };
});