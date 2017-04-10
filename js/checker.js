var url = 'https://api.instagram.com/v1';
var client_id = "6cd2b2279a0946d3ba4a16dbe583520c";
var access_token = "47071920.6cd2b22.8184cc9fb56f4d558a17d8ef879cbcd5";
var targetProfile = "dsayunando";
var checkSelf = function() {
  $.ajax( {
    url: url + "/users/self/?access_token=" + access_token,
    dataType: "jsonp",
    success: function( json ) {
      console.log( json );
      $( "#self" ).html( " <img src='" + json.data.profile_picture + " '> <h2> " + json.data.full_name + "</h2>" );
    }
  } )
};
var getLikedPhotos = function( media ) {
  var photoIds = [];
  for ( var i = 0; i < media.data.length; i++ ) {
    photoIds.push( media.data[ i ].id );
  };
  $.each( photoIds, function( i, val ) {
    $.ajax( {
      url: url + "/media/" + photoIds[ i ] + "/likes?access_token=" + access_token,
      dataType: "jsonp",
      success: function( likes ) {
        if ( likes.data[ 0 ].hasOwnProperty( "username" ) ) {
          if ( likes.data[ 0 ].username === targetProfile ) {
            $.ajax( {
              url: url + "/media/" + photoIds[ i ] + "?access_token=" + access_token,
              dataType: "jsonp",
              success: function( photo ) {
                $( "#follow-media" ).append( "<div class='divTable'><img class='cell' src=" + photo.data.images.standard_resolution.url + "></div>" )
              }
            } )
          }
        }
      }
    } )
  } )
};
var checkFollowsPictures = function() {
  $.ajax( {
    url: url + "/users/self/follows?access_token=" + access_token,
    dataType: "jsonp",
    success: function( json ) {
      console.log( json );
      var followId = json.data[ 0 ].id;
      var likedUser = json.data[ 0 ].username;
      var likedUserAvatar = json.data[ 0 ].profile_picture;
      $.each( json.data, function() {
        $( "#follows" ).html( likedUser + "<br>" + "<img src=" + likedUserAvatar + ">" );
        $.ajax( {
          url: url + "/users/" + followId + "/media/recent/?access_token=" + access_token,
          dataType: "jsonp",
          success: getLikedPhotos,
        } );
      } )
    }
  } )
};
/*var getDate = function() {
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: url + "/self/media/recent/?access_token=" + access_token,
        success: function(data) {
            console.log(data);
            //OKAY, now lets get to the pretty stuff, INSTAGRAM PEEKTARS.
            for (var i = 0; i < 5; i++) {
                var date = new Date(parseInt(data[i].created_time) * 1000);
                    $(".instagram").append("\
                        <div class='instagram-feed'>\
                            <img class='instagram-image' src='" + data.data[i].images.standard_resolution.url +"' width='325px'/>\
                            <div class='igHover2'>\
                                posted by: "+data.data[i].user.username+"<br />\
                                posted on: "+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+"<br />\
                            </div />\
                        </div>\
                    ");
                date = null;
            }
        }
    });
};*/
var getRecent = function(){
	$.ajax({
		url: url + "/users/self/media/recent/?access_token=" + access_token,
		dataType: "jsonp",
		cache: false,
		success: function(recentMedia){
			console.log(recentMedia);
			for (var i = 0; i < 1; i++){ 
			console.log(new Date(recentMedia.data[i].created_time*1000));
			}			
		}		
	})
};
//checkSelf();
$( "#check-follows" ).click( checkFollowsPictures );
getRecent();