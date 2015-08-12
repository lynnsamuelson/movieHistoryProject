
requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'Firebase': '../bower_components/firebase/firebase',
    'lodash': '../bower_components/lodash/lodash.min'
  },

  shim: {
    'bootstrap': ['jquery'],
    'firebase': {
      exports: 'Firebase'
    }
  }
});







// Retrieve songs from Firebase and populate the DOM
var tempMovies;

requirejs(
  ['jquery', 'hbs', 'bootstrap', 'ask-OMDB','DOM-access', 'Firebase', 'lodash'], 
  function($, Handlebars, bootstrap, ask, domAccess, _firebase, lodash) {
    
      $("#searchButton").click(function(evt){
         console.log(evt);
          ask.getMovies(function(movie) {
            tempMovies = movie;

             // success:function() {
             // $('#titleInput').val("");
             //  }
      // Put data into form fields
      $('#titleIn').val(movie.Title);
      $('#actorsIn').val(movie.Actors);
      $('#yearIn').val(movie.Year);
     
        

        });
      });
    });
  
    

    


  

    // // Refresh song list by clicking on View Music on Nav bar
    // $(document).on('click', '#refresh-music', function() {
    //   get_more.querySongs(function(data) {
    //     // console.log(data);


    //     require(['hbs!../templates/songs'], function(songTemplate) {
    //       $('#song-list').html(songTemplate(songs));

    //     });
    //   });
    // }); 

      

      // $(document).on('click', '#reviewSong'(function() {
      //   require(['hbs...templates/songsToInput'] function(songReview){
      //     $('songsToInput').html(songReview(newSong));
      //   })
      // }));
   
     
    // Post new song to Firebase
              
          
//           $.ajax({
//             url: 'https://torrid-torch-3031.firebaseio.com/songs.json',
//             method: 'POST',
//             data: JSON.stringify(newSong),
//           //   success:function() {
//           //      $('.inputField').val("");
//           // }
//         });
//       });
     
//       // Temporary delete button on song list
//      $(document).on ('click', '#deleteButton', function (){
//             $(this).parent().remove();
//       });  
// });





   