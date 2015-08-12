

define(['jquery'], function($) {
 
   return {
     getMovies: function(callbackfunction) {
       var title = $("#titleInput").val();
     $.ajax({
       url: "http://www.omdbapi.com/?t=" + title}).done(function(data) {
     
       console.log(data);
       callbackfunction.call(this, data);
       });
     }
   };
});
