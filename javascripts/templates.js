define(["hbs!../templates/movies", "hbs!../templates/find"],
function(moviesTemplate, findTemplate) {
  var templateObj = {};
  templateObj.movies = moviesTemplate;
  templateObj.found = findTemplate;
  return templateObj;
});