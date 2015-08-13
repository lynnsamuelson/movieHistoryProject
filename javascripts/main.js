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







requirejs(
    ["jquery","hbs", "bootstrap",'ask-OMDB', 'firebase' ],
    function($, Handlebars, bootstrap, ask, _firebase) {
      var tempMovies;
      var allMovies;

        $("#searchButton").click(function(evt){
          console.log(evt);
          ask.getMovies(function(movie) {
            tempMovies = movie; 
            $("#titleIn").val(movie.Title);
            $('#actorsIn').val(movie.Actors);
            $('#yearIn').val(movie.Year);
          });
          $("#titleImput").val('');
        });


        $("#addToMyList").click(function(addevt){
          console.log(addevt);

          var newMovie = {};
          newMovie.title = $("#titleIn").val();
          newMovie.actors = $("#actorsIn").val();
          newMovie.year = $("#yearIn").val();
          newMovie.rating = $("#ratingIn").val();
          console.log("value of radio buttons", $("#seenIt").val());
          newMovie.seenit = $("input[name='viewed']:checked").val() === "yes" ? true : false,
          // console.log(newMovie);
    
          $.ajax({
          url: "https://movies-refactored.firebaseio.com/movie.json",
          method: "POST",
          data: JSON.stringify(newMovie)
          }).done(function(addedMovie) {
          console.log("Your added movie is", addedMovie);
          });   

          $("#titleIn").val('');
          $("#actorsIn").val('');
          $("#yearIn").val('');

        });


        var myFirebaseRef = new Firebase("https://movies-refactored.firebaseio.com/");
        myFirebaseRef.child("movie").on("value", function(snapshot) {

          var movie = snapshot.val();


          require(
            ['hbs!../templates/movies'],
            function(movieTemplate){
              var populatedTemplate = movieTemplate({movie:movie});
              $("#movie-list").html(populatedTemplate);
            });     
        });

  });    
