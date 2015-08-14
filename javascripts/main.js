// The main module (i.e. javascripts/main.js) should then use the 
// return objects from all three dependencies to populate your song list.

requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'firebase': '../bower_components/firebase/firebase'
  },
  shim: {
    'bootstrap': ['jquery'],
    'fireebase': {
      export: 'Firebase'
    }
  }
});

requirejs(["jquery", "hbs", "bootstrap", "ask-OMDB", "firebase", "templates"],
function($, Handlebars, bootstrap, ask, _firebase, templates) {
  var tempMovies;
  var allMovies;
  $("#find").click(function(evt){
    evt.preventDefault();
    ask.getMovies("find", function(searchedMovies) {
      $("#find-results").html(templates.found(searchedMovies));
    });
  });


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


  var myFirebaseRef = new Firebase("https://movies-refactored.firebaseio.com/");
  myFirebaseRef.child("movie").on("value", function(snapshot) {
    var movie = snapshot.val();
    $("#movie-list").html(templates.movies({movie:movie}));
  });
});