// The main module (i.e. javascripts/main.js) should then use the 
// return objects from all three dependencies to populate your Movie list.

requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'firebase': '../bower_components/firebase/firebase',
    'lodash': '../bower_components/lodash/lodash.min',
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

requirejs(["jquery", "lodash", "hbs", "bootstrap", "ask-OMDB", "firebase","star-rating", "templates"],
function($, _, Handlebars, bootstrap, ask, _firebase, starrating, templates) {
  var tempMovies;
  var allMovies;
  var arrayOfMovies = [];


  // Search button
  $("#find").click(function(evt){
    evt.preventDefault();
    $("#filterbtn").show( 1 );
    var searchString = $("#search-input").val().toLowerCase();
    var searchedMoviesArray = [];
    var foundMoviesArray = [];
    var addSearchedMoviesToPage = function(foundMovie) { // Sent in to ask-OMDB on the second round
      foundMoviesArray[foundMoviesArray.length] = foundMovie;
      if(foundMoviesArray.length === searchedMoviesArray.length) { // Keep adding the full movie info until all searched movies are added
        var ourMoviesArray = [];
        for(var i=0; i<arrayOfMovies.length; i++) {
          if(arrayOfMovies[i].title.toLowerCase().indexOf(searchString) != -1) { // Only show us the movies we already have that match
            ourMoviesArray[ourMoviesArray.length] = arrayOfMovies[i];
          }
        }
        for(var j=0; j<ourMoviesArray.length; j++) {
          for(var k=0; k<foundMoviesArray.length; k++) {
            if(foundMoviesArray[k].imdbid === ourMoviesArray[j].imdbid) { // Check the searched movies and get rid of ones that match ones we have
              foundMoviesArray.splice(k, 1);
            }
          }
        }
        var allMoviesArray = ourMoviesArray.concat(foundMoviesArray);  // Combine the movies we have with the movies from the OMDb search
        var sortedMovieArray = alphabetizer(allMoviesArray, false); // Alphebetize them all (false because it's not an object from Firebase)
        $("#movie-list").html(templates.movies(sortedMovieArray));
        $(".input-id").rating({'size':'sm', 'showCaption': false, 'showClear': false});
        $("#search-input").val("");
      }
    };
    ask.getMovies(searchString, function(searchedMovies) {
      searchedMoviesArray = searchedMovies.Search;
      for(var i=0; i<searchedMoviesArray.length; i++) {
        ask.getMovies(searchedMoviesArray[i], addSearchedMoviesToPage);
      }
    });
  });


//targets the watched button
  var seenMovies = [];
  var addMovies = [];
  var wishMovies = [];

  $('.watchedfilter').on('click', function(e) {
    filterResults();
    seenMovies.show();
    wishMovies.hide();
    addMovies.hide();
    $('.watchedtoggle').addClass('active');
    $('.wishtoggle').removeClass('active');
    
    //console.log('watched', seenMovies);
  });

//targets the add button
  $('.filterAdd').on('click', function(e) {
    filterResults();
    seenMovies.hide();
    wishMovies.hide();
    addMovies.show();
    //console.log('add', addMovies);
  });
  // console.log('add', addMovies);

//targets the wish button
  $('.filterWish').on('click', function(e) {
    filterResults();
    seenMovies.hide();
    wishMovies.show();
    addMovies.hide();
    $('.watchedtoggle').removeClass('active');
    $('.wishtoggle').addClass('active');
    //console.log('wish', wishMovies);
  });



  function filterResults() {
    seenMovies = $('.seenMovie').parents('.movie-holder');
    addMovies = $('.add-btn').parents('.movie-holder');
    wishMovies = $('.watched-btn').parents('.movie-holder');

}
  function alphabetizer(sentMovies, isFirebaseObject) {
    var internalMovieArray = [];
    if(isFirebaseObject) {
      for(var keyFB in sentMovies) {
        sentMovies[keyFB].key = keyFB;
        internalMovieArray[internalMovieArray.length] = sentMovies[keyFB];
      }
    } else {
      internalMovieArray = sentMovies;
    }
    var sortedMovieArray = internalMovieArray.sort(function(a, b) {
      if(a.title > b.title) {
        return 1;
      }
      if(a.title < b.title) {
        return -1;
      }
      if(a.title == b.title) {
        if(a.year > b.year) {
          return 1;
        }
        if(a.year < b.year) {
          return -1;
        }
        if(a.year == b.year) {
          return 0;
        }
      }
    });
    return sortedMovieArray;
  }

//Filter Button inbetween posters and Nav Bar. Tied to #Find Id
//Which is tied to the search button in the HTML
//====================================================================    
  $("#filterbtn").click(function(evt){
    evt.preventDefault();
    ask.getMovies("find", function(searchedMovies) {
      $("#find-results").html(templates.found(searchedMovies));
    });
  });

  //Clicking the Search Button in the HTML will
  //make the filter buttons Visible
//==============================================

  // Get info for movie on any of its buttons' click
  function keyGetter(clickedElement) {
    var clickedMovie = {};
    var firebaseKey = $(clickedElement).parents(".movie-holder").attr("key");
    if(firebaseKey !== "") {
      clickedMovie.key = firebaseKey;
    }
    clickedMovie.title = $(clickedElement).parents(".movie-holder").attr("title");
    clickedMovie.year = $(clickedElement).parents(".movie-holder").attr("year");
    clickedMovie.imdbid = $(clickedElement).parents(".movie-holder").attr("imdbid");
    var posterURL = $(clickedElement).parents(".movie-holder").find("img").attr("src");
    if(posterURL !== undefined) {
      clickedMovie.poster = posterURL;
    }
    return clickedMovie;
  }

  // Add movie button
  $("#movie-list").on("click", ".add-btn", function(evt){
    evt.preventDefault();
    var newMovie = keyGetter($(this));
    $.ajax({
      url: "https://movies-refactored.firebaseio.com/movie.json",
      method: "POST",
      data: JSON.stringify(newMovie)
    });
  });

  // Reveal Delete Button
  $("#movie-list").on("mouseover", ".poster", function(e) {
    if($(this).parents(".movie-holder").find("input").hasClass("rating")){
    } else {
      $(this).find(".delete-btn").removeClass("hidden");
    }
  });

  // Hide Delete Button
  $("#movie-list").on("mouseout", ".poster", function(e) {
    if($(this).parents(".movie-holder").find("input").hasClass("rating")){
    } else {
      $(this).find(".delete-btn").addClass("hidden");
    }
  });

  // Delete Button
  $("#movie-list").on("click", ".delete-btn", function(e) {
    var keyOfMovieToDelete = keyGetter($(this));
    myFirebaseRef.child("movie").child(keyOfMovieToDelete.key).set(null);
  });

  // Watched Button
  $("#movie-list").on("click", ".watched-btn", function(e) {
    var movieToChange = keyGetter($(this));
    movieToChange.seenit = true;
    movieToChange.rating = 5;
    console.log("movieToChange", movieToChange);
    myFirebaseRef.child("movie").child(movieToChange.key).set(movieToChange);
  });

  // Ratings Change
  $("#movie-list").on('rating.change', '.input-id', function(event, value, caption) {
    var movieToChange = keyGetter($(this));
    movieToChange.rating = Number(value);
    movieToChange.seenit = true;
    console.log("movieToChange", movieToChange);
    myFirebaseRef.child("movie").child(movieToChange.key).set(movieToChange);
  });

  // Firebase data change
  var myFirebaseRef = new Firebase("https://movies-refactored.firebaseio.com/");
  myFirebaseRef.child("movie").on("value", function(snapshot) {
    arrayOfMovies = [];
    var movie = snapshot.val();
    arrayOfMovies = alphabetizer(movie, true);
    $("#movie-list").html(templates.movies(arrayOfMovies));
    $(".input-id").rating({'size':'sm', 'showCaption': false, 'showClear': false});
    var allStarsArr = $(".input-id");
    for(var i=0; i<allStarsArr.length; i++) {
      var ratingsKey = $(allStarsArr[i]).parents(".movie-holder").attr("key");
      var theRating = movie[ratingsKey].rating;
      $(allStarsArr[i]).rating("update", theRating);
    }
  });
});