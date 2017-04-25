(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  $("#search-btn").click(function(){
    movies.length = 0;
    let searchString = $("#search").val();
    if(searchString.length > 0){
      let $response = $.getJSON("http://omdbapi.com/?s=" + searchString +"&");
      $response.done(function(data) {
        $.each( data.Search, function( i, movie ) {
          let $plotResponse = $.getJSON("http://omdbapi.com/?i=" + movie.imdbID +"&plot=full&");
          $plotResponse.done(function (plotData){
            let movieObj = {
              id:movie.imdbID,
              poster:movie.Poster,
              title:movie.Title,
              year:movie.Year,
              plot:plotData.Plot
            };
            movies.push(movieObj);
            renderMovies();
          });
        });
      });
      $response.fail(function(err){
        alert("Failed to get movies.  Error : " + err);
      });
    }
    else{
      alert("Please enter a movie to search for.");
    }
    return false;
  });
})();
