// The main module (i.e. javascripts/main.js) should then use the 
// return objects from all three dependencies to populate your song list.

requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'firebase': '../bower_components/firebase/firebase',
    'star-rating': 'star-rating'
  },
  shim: {
    'star-rating': ['jquery'],
    'bootstrap': ['jquery'],
    'fireebase': {
      export: 'Firebase'
    }
  }
});

requirejs(["jquery", "hbs", "bootstrap", "ask-OMDB", "firebase","star-rating", "templates"],
function($, Handlebars, bootstrap, ask, _firebase, starrating, templates) {
  var tempMovies;
  var allMovies;
  var arrayOfMovies = [];

  $("#search").click(function(evt){
    evt.preventDefault();
    var allMovieRatings = $("input");
    console.log(allMovieRatings);
    for(var i=0; i<allMovieRatings.length; i++) {
      var retrievedRating = $(allMovieRatings[i]).val();
      $(".input-id").rating('update', retrievedRating);
    }
  });

  $("#find").click(function(evt){
    evt.preventDefault();
    ask.getMovies("find", function(searchedMovies) {
      $("#find-results").html(templates.found(searchedMovies));
    });
  });

  function alphebetizer(sentObject) {
    var internalMovieArray = [];
    for(var key in sentObject){
      var movieObj = {};
      movieObj[key] = sentObject[key];
      internalMovieArray[internalMovieArray.length] = movieObj;
    }
    sortedMovieArray = internalMovieArray.sort(function(a, b) {
      var aTitle;
      var bTitle;
      for(var key1 in a) {
        aTitle = a[key1].title;
      }
      for(var key2 in b) {
        bTitle = b[key2].title;
      }
      if(aTitle > bTitle){
        return 1;
      }
      if(aTitle < bTitle){
        return -1;
      }
      if(aTitle == bTitle){
        return 0;
      }
    });
    return sortedMovieArray;
  }

  function keyGetter(clickedElement) {
    var clickedMovie = {};
    clickedMovie.key = $(clickedElement).parents(".movie-holder").attr("key");
    clickedMovie.title = $(clickedElement).parents(".movie-holder").attr("title");
    clickedMovie.poster = $(clickedElement).parents(".movie-holder").find("img").attr("src");
    return clickedMovie;
  }


  $("#find-results").on("click", ".add-btn", function(evt){
    evt.preventDefault();
    var addMovie = {};
    addMovie.addTitle = $(this).siblings(".find-title").html();
    addMovie.addYear = $(this).siblings(".find-year").html();
    ask.getMovies(addMovie, function(newMovie) {
      $.ajax({
        url: "https://movies-refactored.firebaseio.com/movie.json",
        method: "POST",
        data: JSON.stringify(newMovie)
      });
    });
  });

  $("#movie-list").on("mouseover", ".poster", function(e) {
    if($(this).parents(".movie-holder").find("input").hasClass("rating")){
    } else {
      $(this).find(".delete-btn").removeClass("hidden");
    }
  });

  $("#movie-list").on("mouseout", ".poster", function(e) {
    if($(this).parents(".movie-holder").find("input").hasClass("rating")){
    } else {
      $(this).find(".delete-btn").addClass("hidden");
    }
  });

  $("#movie-list").on("click", ".delete-btn", function(e) {
    var keyOfMovieToDelete = keyGetter($(this));
    myFirebaseRef.child("movie").child(keyOfMovieToDelete.key).set(null);
  });

  $("#movie-list").on("click", ".watched-btn", function(e) {
    var movieToChange = keyGetter($(this));
    var changedMovie = {};
    changedMovie.title = movieToChange.title;
    changedMovie.poster = movieToChange.poster;
    changedMovie.seenit = true;
    changedMovie.rating = 5;
    console.log(changedMovie);
    myFirebaseRef.child("movie").child(movieToChange.key).set(changedMovie);
  });

  $("#movie-list").on('rating.change', '.input-id', function(event, value, caption) {
    var movieToChange = keyGetter($(this));
    var changedMovie = {};
    changedMovie.title = movieToChange.title;
    changedMovie.poster = movieToChange.poster;
    changedMovie.seenit = true;
    changedMovie.rating = Number(value);
    console.log(changedMovie);
    myFirebaseRef.child("movie").child(movieToChange.key).set(changedMovie);
  });

  var myFirebaseRef = new Firebase("https://movies-refactored.firebaseio.com/");
  myFirebaseRef.child("movie").on("value", function(snapshot) {
    arrayOfMovies = [];
    var movie = snapshot.val();
    console.log(movie);
    arrayOfMovies = alphebetizer(movie);
    console.log("sorted", arrayOfMovies);
    $("#movie-list").html(templates.movies(arrayOfMovies));
    $(".input-id").rating({'size':'sm', 'showCaption': false, 'showClear': false});
  });
});