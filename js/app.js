var url = 'https://api.instagram.com/v1';
var client_id = "6cd2b2279a0946d3ba4a16dbe583520c";
var access_token = getParameterByName("access_token"); 
let selfName = "";
let photosToCheck = [];
var chosenTimeRange;
let fans = {};

//Select range of days for which the check will run

//A week in Unix Timestamp is 604800
//Unix Timestamp to Date: console.log(new Date(recentMedia.data[i].created_time*1000));

$("select").on("change", function() {
	chosenTimeRange = parseInt(this.value) * 86400;
});

//Get user info and display in header
var checkSelf = function() {
	$.ajax({
		url: url + "/users/self/?access_token=" + access_token,
		dataType: "jsonp",
		success: function(json) {
            selfName = json.data.username;
			$("#self-pic").html(" <img id='own-avatar' class='img-responsive' src='" + json.data.profile_picture + " '> <h3> " + json.data.full_name + "</h3><h4>" + json.data.username + "</h4>");
		}
	})
};
//Get access token from URL
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

//Display checking user's fans in body
var displayFans = function(){
  var rankedFans = [];
  $(".fans").html("");
  for (var fan in fans){
    var commentVal = 0;
    if (fans[fan].hasOwnProperty("comments")){
      commentVal = fans[fan].comments*2;
    }
    rankedFans.push([fan, fans[fan].likes + commentVal, fans[fan].avatar]);
  };
  rankedFans.sort(function(a, b){
    return b[1] - a[1];
  });
  
  for (var i = 0; i <= 0; i++){
    $(".fans").append("<div class='fan top-fan row'><img class='avatar img-responsive' src='" + rankedFans[i][2] + "'><div class='fan-stats'><div class='fan-place'><i class='fa fa-trophy' aria-hidden='true'></i></div><div class = 'fan-name'>"+ rankedFans[i][0] + "</div>" + "<i class='fa fa-heart' aria-hidden='true'></i> " + fans[rankedFans[i][0]].likes + "<br>"+ "<i class='fa fa-comment-o' aria-hidden='true'></i> "+ (rankedFans[i][1]-fans[rankedFans[i][0]].likes)/2 +"</div></div>" );
  };
  
    for (var i = 1; i <= 1; i++){
    $(".fans").append("<div class='fan second-fan row'><img class='avatar img-responsive' src='" + rankedFans[i][2] + "'><div class='fan-stats'><div class='fan-place'><i class='fa fa-trophy' aria-hidden='true'></i></div><div class = 'fan-name'>"+ rankedFans[i][0] + "</div>" + "<i class='fa fa-heart' aria-hidden='true'></i> " + fans[rankedFans[i][0]].likes + "<br>"+ "<i class='fa fa-comment-o' aria-hidden='true'></i> "+ (rankedFans[i][1]-fans[rankedFans[i][0]].likes)/2 +"</div></div>" );
  };
  
      for (var i = 2; i <= 2; i++){
    $(".fans").append("<div class='fan third-fan row'><img class='avatar img-responsive' src='" + rankedFans[i][2] + "'><div class='fan-stats'><div class='fan-place'><i class='fa fa-trophy' aria-hidden='true'></i></div><div class = 'fan-name'>"+ rankedFans[i][0] + "</div>" + "<i class='fa fa-heart' aria-hidden='true'></i> " + fans[rankedFans[i][0]].likes + "<br>"+ "<i class='fa fa-comment-o' aria-hidden='true'></i> "+ (rankedFans[i][1]-fans[rankedFans[i][0]].likes)/2 +"</div></div>" );
  };
  
        for (var i = 3; i <= 10; i++){
    $(".fans").append("<div class='fan row'><img class='avatar img-responsive' src='" + rankedFans[i][2] + "'><div class='fan-stats'><div class = 'fan-name'>"+ rankedFans[i][0] + "</div>" + "<i class='fa fa-heart' aria-hidden='true'></i> " + fans[rankedFans[i][0]].likes + "<br>"+ "<i class='fa fa-comment-o' aria-hidden='true'></i> "+ (rankedFans[i][1]-fans[rankedFans[i][0]].likes)/2 +"</div></div>" );
  };
  

};
//Check recent photos by checking user
var getRecent = function() {
	photosToCheck = [];
	fans = {};
	$.ajax({
		url: url + "/users/self/media/recent/?access_token=" + access_token,
		dataType: "jsonp",
		cache: false,
		success: function(recentMedia) {
            console.log(recentMedia);
			var lastPhotoDate = recentMedia.data[0].created_time;
			for (var i = 0; i < recentMedia.data.length; i++) {
				if (recentMedia.data[i].created_time >= lastPhotoDate - 604800) {
					photosToCheck.push(recentMedia.data[i].id);
				}
			}
			checkMediaInteractions();
            setTimeout(displayFans, 1000);
		}
    })
};
var checkMediaInteractions = function() {
	for (var i = 0; i < photosToCheck.length; i++) {
		$.ajax({
			url: url + "/media/" + photosToCheck[i] + "/likes?access_token=" + access_token,
			dataType: "jsonp",
			cache: false,
			success: function(likes) {
				for (var i = 0; i < likes.data.length; i++) {
					var name = likes.data[i].username;
                  if (name != selfName){ 
                      if (fans.hasOwnProperty(name) === false) {
                          fans[name] = {};
                          fans[name].user = name;
                          fans[name].likes = 0;
                          fans[name].likes += 1;
                          fans[name].avatar = likes.data[i].profile_picture;
                      } else if(fans.hasOwnProperty(name) && fans[name].hasOwnProperty("likes")){
                          fans[name].likes += 1;						
                      } else {
                          fans[name].likes = 0;
                          fans[name].likes += 1;
                      }
                  }
				}
			}
		})
		$.ajax({
			url: url + "/media/" + photosToCheck[i] + "/comments/?access_token=" + access_token,
			dataType: "jsonp",
			cache: false,
			success: function(comments) {
                console.log(comments);
				for (var i = 0; i < comments.data.length; i++) {
					var name = comments.data[i].from.username;
                    if (name != selfName){ 
                      if (fans.hasOwnProperty(name) === false) {
                          fans[name] = {};
                          fans[name].user = name;
                          fans[name].comments = 0;
                          fans[name].comments += 1;
                          fans[name].avatar = comments.data[i].from.profile_picture;
                      } else if (fans.hasOwnProperty(name) && fans[name].hasOwnProperty("comments") && name != selfName ) {
                          fans[name].comments += 1;
                      } else {
                          fans[name].comments = 0;
                          fans[name].comments += 1;
                      }
                  }
				}

			}
		})
	}

};

checkSelf();
getRecent();