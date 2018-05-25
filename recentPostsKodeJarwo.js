
function cyberghost(ghost, banget) {
  var showfeed = ghost.split("<");
  for (var i = 0; i < showfeed.length; i++) {
    if (showfeed[i].indexOf(">") != -1) {
      showfeed[i] = showfeed[i].substring(showfeed[i].indexOf(">") + 1, showfeed[i].length);
    }
  }
  showfeed = showfeed.join("");
  showfeed = showfeed.substring(0, banget - 1);
  return showfeed;
}

function showterbaru(json) {
  var entry, posttitle, posturl, postimg, postcontent;
  var showblogfeed = "";
  urlprevious = "";
  urlnext = "";
  for (var k = 0; k < json.feed.link.length; k++) {
    if (json.feed.link[k].rel == 'previous') {
      urlprevious = json.feed.link[k].href;
    }
    if (json.feed.link[k].rel == 'next') {
      urlnext = json.feed.link[k].href;
    }
  }
  for (var i = 0; i < numfeed; i++) {
    if (i == json.feed.entry.length) {
      break;
    }
    entry = json.feed.entry[i];
    posttitle = entry.title.$t;
    for (var k = 0; k < entry.link.length; k++) {
      if (entry.link[k].rel == 'alternate') {
        posturl = entry.link[k].href;
        break;
      }
    }
    if ("content" in entry) {
      postcontent = entry.content.$t;
    } else if ("summary" in entry) {
      postcontent = entry.summary.$t;
    } else {
      postcontent = "";
    }
    if ("media$thumbnail" in entry) {
      postimg = entry.media$thumbnail.url.replace("/s72-c/","/s"+thumb+"/");
    }
    showblogfeed += "<div class='post-outer'><div class='hentry'>";
    showblogfeed += "<div class='thumbnail-post'><a href='" + posturl + "' target='_blank'><img class='thumbnail-post' src='" + postimg + "' /></a></div>";
    showblogfeed += "<div class='entry-header'><h2 class='post-title entry-title'><a href='" + posturl + "'>" + posttitle + "</a></h2></div>";
//  showblogfeed += "<p>" + cyberghost(postcontent, charac) + "...</p>";
    showblogfeed += "</div></div>";
  }
  document.getElementById("terbaru").innerHTML = showblogfeed;
  showblogfeed = "";
  if (urlprevious) {
    showblogfeed += "<a href='javascript:navigasifeed(-1);' class='previous'>&#9668; Previous</a>";
  } else {
    showblogfeed += "<span class='noactived previous'>&#9668; Previous</span>";
  }
  if (urlnext) {
    showblogfeed += "<a href='javascript:navigasifeed(1);' class='next'>Next &#9658;</a>";
  } else {
    showblogfeed += "<span class='noactived next'>Next &#9658;</span>";
  }
//showblogfeed += "<a href='javascript:navigasifeed(0);' class='home'>Home</a>";
  document.getElementById("cg-navigasifeed").innerHTML = showblogfeed;
}

function navigasifeed(url) {
  var p, parameter;
  if (url == -1) {
    p = urlprevious.indexOf("?");
    parameter = urlprevious.substring(p);
  } else if (url == 1) {
    p = urlnext.indexOf("?");
    parameter = urlnext.substring(p);
  } else {
    parameter = "?start-index=1&max-results=" + numfeed + "&orderby=published&alt=json-in-script"
  }
  parameter += "&callback=showterbaru";
  incluirscript(parameter);
}

function incluirscript(parameter) {
  if (startfeed == 1) {
    removerscript();
  }
  document.getElementById("terbaru").innerHTML = "<div id='cg-loading'></div>";
  document.getElementById("cg-navigasifeed").innerHTML = "";
  var archievefeed = urlblog + "/feeds/posts/default" + parameter;
  var terbaru = document.createElement('script');
  terbaru.setAttribute('type', 'text/javascript');
  terbaru.setAttribute('src', archievefeed);
  terbaru.setAttribute('id', 'MASLABEL');
  document.getElementsByTagName('head')[0].appendChild(terbaru);
  startfeed = 1;
}

function removerscript() {
  var elemen = document.getElementById("MASLABEL");
  var parent = elemen.parentNode;
  parent.removeChild(elemen);
}
onload = function() {
  navigasifeed(0);
}