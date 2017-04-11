
var paginationTemplate;
var MOTDtempo;
var logCardTemplate;
var homeErrorlistTemplate;
var homeSuccesslistTemplate;
$(document).ready(function () {
  paginationTemplate = Tempo.prepare("pageList");
  MOTDtempo = Tempo.prepare('MOTDList');
  homeErrorlistTemplate = Tempo.prepare("pageErrorList");
  logCardTemplate = Tempo.prepare("logCardDiv");
  homeSuccesslistTemplate = Tempo.prepare("pageSuccessList");
  loadDisplayPopularLogs();//displays page 1 of popular logs        
  checkUserSignedIn();//changing elements in the page depending on if there is a user signed in or not
  setupMOTDArea();


  $("#userSearchCategory").click(function () {
    $("#dropdownMenuButton").html($("#userSearchCategory").html());
  });

  $("#titleSearchCategory").click(function () {
    $("#dropdownMenuButton").html($("#titleSearchCategory").html());
  });

  $("#searchButton").click(function () {
    var searchBy = $("#dropdownMenuButton").html();
    var input = $("#searchInput").val();
    var errorMessage = [];

    if (input == "") {
      errorMessage.push({ "msg": "Search field is blank" });
    }

    if (searchBy == "Search by:") {
      errorMessage.push({ "msg": "Select a search category" });
    }

    if (errorMessage.length != 0) {
      $("#successMessage").hide();
      $("#errorMessage").show();
      $("#pageErrorList").show();

      homeErrorlistTemplate.clear();

      homeErrorlistTemplate.render(errorMessage);

      return;
    }
    else {
      $("#errorMessage").hide();
    }

    if (searchBy == $("#userSearchCategory").html()) {
      var userSearchSettings =
        {
          "async": true,
          "crossDomain": true,
          "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/User/" + input + "/1",
          "method": "GET",
          "headers": { "content-type": "text/plain", "cache-control": "no-cache" },
          "processData": false,
          "data": ""
        }
      $.ajax(userSearchSettings).done(function (userResponse) {
        if (userResponse.docs.length > 0)
          displayLogs(userResponse, "displaySearchUserLogs");
        else {
          $("#noMatchLabel").show();
        }
      });
    }
    else if (searchBy == $("#titleSearchCategory").html()) {
      input = input.replace(/ /g, "%20");

      var logSettings =
        {
          "async": true,
          "crossDomain": true,
          "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Name/" + input + "/1",
          "method": "GET",
          "headers": { "content-type": "application/json", "cache-control": "no-cache" },
          "processData": false,
          "data": ""
        }
      $.ajax(logSettings).done(function (logResponse) {
        if (logResponse.docs.length > 0)
          displayLogs(logResponse, "displaySearchTitleLogs");
        else {
          $("#noMatchLabel").show();
        }
      });
    }
  });

  $("#FAQButton").click(function () {
    window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/CCLFAQ.html";
  });


  $("#oldLogsButton").click(function () {
    loadDisplayOldLogs();
  });

  $("#updatedLogsButton").click(function () {
    loadDisplayUpdatedLogs();
  });

  $("#recentLogsButton").click(function () {
    loadDisplayRecentLogs();
  });

  $("#popularLogsButton").click(function () {
    loadDisplayPopularLogs();
  });

  $("#myLogsButton").click(function () {
    loadDisplayMyLogs();
  });

  $("#newCaptainsLogButton").click(function () {
    window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/CCLNewLog.html";
  });
});

function setupMOTDArea() {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://" + window.location.hostname + ":" + window.location.port + "/MOTD/",
    "method": "GET",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "9bfe7b30-2d1e-8cb9-cdd4-4a75aa6bf6ae"
    },
    "processData": false,
    "data": "{\n\t\"Content\":\"This is our First test MOTD With the site built\"\n}"
  }

  $.ajax(settings).done(function (response) {
    MOTDtempo.clear();
    MOTDtempo.render(response);
  });

}

function setupLogPages(response, method)//pagination display based on how many pages, method being the method called to open the page
{
  var pageAmount = parseInt(response.pages);
  var page = parseInt(response.page);
  var data = [];

  if (page > 5) {
    data[0] = { "page": page - 4, "method": method };
    $("#logPageNumber" + (page - 4).toString()).removeClass("selectedPage");
    $("#logPageNumber" + (page - 4).toString()).addClass("lcars-CCLlightorange-bg");

    data[1] = { "page": page - 3, "method": method };
    $("#logPageNumber" + (page - 3).toString()).removeClass("selectedPage");
    $("#logPageNumber" + (page - 3).toString()).addClass("lcars-CCLlightorange-bg");

    data[2] = { "page": page - 2, "method": method };
    $("#logPageNumber" + (page - 2).toString()).removeClass("selectedPage");
    $("#logPageNumber" + (page - 2).toString()).addClass("lcars-CCLlightorange-bg");

    data[3] = { "page": page - 1, "method": method };
    $("#logPageNumber" + (page - 1).toString()).removeClass("selectedPage");
    $("#logPageNumber" + (page - 1).toString()).addClass("lcars-CCLlightorange-bg");

    data[4] = { "page": page, "method": method };
    $("#logPageNumber" + (page).toString()).removeClass("lcars-CCLlightorange-bg");
    $("#logPageNumber" + (page).toString()).addClass("selectedPage");

    if (pageAmount >= page + 1) {
      data[5] = { "page": page + 1, "method": method };
      $("#logPageNumber" + (page + 1).toString()).removeClass("selectedPage");
      $("#logPageNumber" + (page + 1).toString()).addClass("lcars-CCLlightorange-bg");
    }
    if (pageAmount >= page + 2) {
      data[6] = { "page": page + 2, "method": method };
      $("#logPageNumber" + (page + 2).toString()).removeClass("selectedPage");
      $("#logPageNumber" + (page + 2).toString()).addClass("lcars-CCLlightorange-bg");
    }
    if (pageAmount >= page + 3) {
      data[7] = { "page": page + 3, "method": method };
      $("#logPageNumber" + (page + 3).toString()).removeClass("selectedPage");
      $("#logPageNumber" + (page + 3).toString()).addClass("lcars-CCLlightorange-bg");
    }
    if (pageAmount >= page + 4) {
      data[8] = { "page": page + 4, "method": method };
      $("#logPageNumber" + (page + 4).toString()).removeClass("selectedPage");
      $("#logPageNumber" + (page + 4).toString()).addClass("lcars-CCLlightorange-bg");
    }


  }
  else {
    for (var i = 0; i < pageAmount && i < 9; i += 1) {
      var j = i + 1;

      data[i] = { "page": j, "method": method };

      if (j == page) {
        $("#logPageNumber" + (page).toString()).removeClass("lcars-CCLlightorange-bg");
        $("#logPageNumber" + (page).toString()).addClass("selectedPage");
      }
      else {
        $("#logPageNumber" + (j).toString()).removeClass("selectedPage");
        $("#logPageNumber" + (j).toString()).addClass("lcars-CCLlightorange-bg");
      }

    }
  }

  paginationTemplate.render(data);

  $("#logPageNumber" + (page).toString()).removeClass("lcars-CCLlightorange-bg");
  $("#logPageNumber" + (page).toString()).addClass("selectedPage");
}


function loadDisplayPopularLogs() {
  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/TopRated/1",
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displayPopularLogs");
  });
}

function displayPopularLogs(pageNum) {
  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/TopRated/" + pageNum,
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displayPopularLogs");
  });
}

function loadDisplayMyLogs() {
  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/users/user/",
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    if (response == false) {
      var errorMessage = [];
      errorMessage.push({ "msg": "You must be logged in to open 'My Logs'. Please try logging in or signing up." });

      if (errorMessage.length != 0) {
        $("#successMessage").hide();
        $("#errorMessage").show();
        $("#pageErrorList").show();

        homeErrorlistTemplate.clear();

        homeErrorlistTemplate.render(errorMessage);
        return;
      }
      else {
        $("#errorMessage").hide();
      }
    }
    else {
      $("#errorMessage").hide();

      var settings =
        {
          "async": true,
          "crossDomain": true,
          "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/User/1",
          "method": "GET",
          "headers": { "content-type": "application/json", "cache-control": "no-cache" },
          "processData": false,
          "data": ""
        }
      $.ajax(settings).done(function (resp) {
        displayLogs(resp, "displayMyLogs");
      });
    }
  });
}

function displayMyLogs(pageNum) {
  pageNum = parseInt(pageNum);

  if (pageNum < 1) pageNum = 1;
  if (pageNum > $("#pageNumber").html()) pageNum = $("#pageNumber").html();

  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/users/user/",
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    if (response == false) {
      var errorMessage = [];
      errorMessage.push({ "msg": "You must be logged in to open 'My Logs'. Please try logging in or signing up." });

      if (errorMessage.length != 0) {
        $("#successMessage").hide();
        $("#errorMessage").show();
        $("#pageErrorList").show();

        homeErrorlistTemplate.clear();

        homeErrorlistTemplate.render(errorMessage);
        return;
      }
      else {
        $("#errorMessage").hide();
      }
    }
    else {
      pageNum = parseInt(pageNum);

      if (pageNum < 1) pageNum = 1;
      if (pageNum > $("#pageNumber").html()) pageNum = $("#pageNumber").html();

      var settings =
        {
          "async": true,
          "crossDomain": true,
          "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/User/" + pageNum,
          "method": "GET",
          "headers": { "content-type": "application/json", "cache-control": "no-cache" },
          "processData": false,
          "data": ""
        }
      $.ajax(settings).done(function (resp) {
        displayLogs(resp, "displayMyLogs");
      });
    }
  });
}

function loadDisplayRecentLogs() {
  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Recent/1",
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displayRecentLogs");
  });
}

function displayRecentLogs(pageNum) {
  pageNum = parseInt(pageNum);

  if (pageNum < 1) pageNum = 1;
  if (pageNum > $("#pageNumber").html()) pageNum = $("#pageNumber").html();

  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Recent/" + pageNum,
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displayRecentLogs");
  });
}

function loadDisplayUpdatedLogs() {
  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/RecentlyUpdated/1",
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displayUpdatedLogs");
  });
}

function displayUpdatedLogs(pageNum) {
  pageNum = parseInt(pageNum);

  if (pageNum < 1) pageNum = 1;
  if (pageNum > $("#pageNumber").html()) pageNum = $("#pageNumber").html();

  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/RecentlyUpdated/" + pageNum,
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displayUpdatedLogs");
  });
}

function loadDisplayOldLogs() {
  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Oldest/1",
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displayOldLogs");
  });
}

function displayOldLogs(pageNum) {
  pageNum = parseInt(pageNum);

  if (pageNum < 1) pageNum = 1;
  if (pageNum > $("#pageNumber").html()) pageNum = $("#pageNumber").html();

  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Oldest/" + pageNum,
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displayOldLogs");
  });
}

function displayLogs(response, method) {
  $("#noMatchLabel").hide();
  $("#logCardCollectionDiv").show();

  if (response.pages > 1) {
    $("#contentPageIteraterDiv").show();
    setupLogPages(response, method);
    $("#pageNumber").html(response.pages);
  }
  else {
    $("#contentPageIteraterDiv").hide();
  }

  for (var i = 0; i < response.docs.length; i += 1) {
    response.docs[i].Content = response.docs[i].Content.substring(0, 100) + "...";
    var rate = response.docs[i].Rating;
    var l = response.docs[i].Likes;
    var d = response.docs[i].Dislikes;

    if ((rate != null || rate != NaN) && rate != 0) response.docs[i].Rating = rate.toString() + "%";
    else response.docs[i].Rating = "unrated";
  }

  logCardTemplate.clear();

  logCardTemplate.render(response.docs);
}

function displaySearchUserLogs(pageNum) {
  var input = $("#searchInput").val();

  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/User/" + input + "/" + pageNum,
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displaySearchUserLogs");
  });
}

function displaySearchTitleLogs(pageNum) {
  var input = $("#searchInput").val();
  input = input.replace(/ /g, "%20");

  var settings =
    {
      "async": true,
      "crossDomain": true,
      "url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Name/" + input + "/" + pageNum,
      "method": "GET",
      "headers": { "content-type": "application/json", "cache-control": "no-cache" },
      "processData": false,
      "data": ""
    }
  $.ajax(settings).done(function (response) {
    displayLogs(response, "displaySearchTitleLogs");
  });
}

function openCardLogLink(id) {
  window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/CCLInitLogPage.html?logId=" + id;
}