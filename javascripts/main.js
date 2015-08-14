// The main module (i.e. javascripts/main.js) should then use the 
// return objects from all three dependencies to populate your song list.

requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'firebase': '../bower_components/firebase/firebase',
    'star-rating': 'star-rating.min'
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
  $("#find").click(function(evt){
    evt.preventDefault();
    ask.getMovies("find", function(searchedMovies) {
      $("#find-results").html(templates.found(searchedMovies));
    });
  });

  function keyGetter(clickedElement) {
    var keyOfClickedMovie = $(clickedElement).parents(".movie-holder").attr("key");
    return keyOfClickedMovie;
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
    $(this).find(".delete-btn").removeClass("hidden");
  });

  $("#movie-list").on("mouseout", ".poster", function(e) {
    $(this).find(".delete-btn").addClass("hidden");
  });

  $("#movie-list").on("click", ".delete-btn", function(e) {
    var keyOfMovieToDelete = keyGetter($(this));
    myFirebaseRef.child("movie").child(keyOfMovieToDelete).set(null);
  });

  var myFirebaseRef = new Firebase("https://movies-refactored.firebaseio.com/");
  myFirebaseRef.child("movie").on("value", function(snapshot) {
    var movie = snapshot.val();
    $("#movie-list").html(templates.movies({movie:movie}));
    $(".input-id").rating({'size':'sm', 'showCaption': false, 'showClear': false});
    $('#input-id').on('rating.change', function(event, value, caption) {
      console.log(value);
    });
    });
});