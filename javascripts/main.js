
requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min'
  },
  shim: {
    'bootstrap': ['jquery']
  }
});


// Retrieve songs from Firebase and populate the DOM

requirejs(
  ['jquery', 'hbs', 'bootstrap', 'DOM-access', 'populate-movies'], 
  function($, Handlebars, bootstrap, domAccess, pop) {

    pop.querySongs(function(data) {
      allSongs = data;
      
      // binding the song array
      require(['hbs!../templates/songs'], function(songTemplate) {
        $('#song-list').html(songTemplate(data));

    });  
  });
  


  

    // Refresh song list by clicking on View Music on Nav bar
    $(document).on('click', '#refresh-music', function() {
      get_more.querySongs(function(data) {
        // console.log(data);


        require(['hbs!../templates/songs'], function(songTemplate) {
          $('#song-list').html(songTemplate(songs));

        });
      });
    }); 

      

      // $(document).on('click', '#reviewSong'(function() {
      //   require(['hbs...templates/songsToInput'] function(songReview){
      //     $('songsToInput').html(songReview(newSong));
      //   })
      // }));
   
     
    // Post new song to Firebase
      $('#post-song').on ('click', function() {
          
          var newSong = {
                title : $('#song-title-input').val(),
                artist : $('#song-artist-input').val(),
                album : $('#song-album-input').val(),
                year : $('#song-year-input').val(),
                genre : $('#song-genre-input').val()
      };
                    
          
          $.ajax({
            url: 'https://torrid-torch-3031.firebaseio.com/songs.json',
            method: 'POST',
            data: JSON.stringify(newSong),
            success:function() {
               $('.inputField').val("");
          }
        });
      });
     
      // Temporary delete button on song list
     $(document).on ('click', '#deleteButton', function (){
            $(this).parent().remove();
      });  
});





   