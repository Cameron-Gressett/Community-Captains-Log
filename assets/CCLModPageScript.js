
var errorlistTemplate;
var flagCardTemplate;

$(document).ready(function () {
	errorlistTemplate = Tempo.prepare("pageErrorList");
	flagCardTemplate = Tempo.prepare("flagCardDiv");
	checkUserSignedIn();
	displayParentFlaggedContent();

	$("#parentFlagsButton").click(function () {
		displayParentFlaggedContent();
	});

	$("#captainsFlagsButton").click(function () {
		displayCaptainsFlaggedContent();
	});

	$("#submissionFlagsButton").click(function () {
		displaySubmissionFlaggedContent();
	});
});


function displayParentFlaggedContent() {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Flagged/",
			"method": "GET",
			"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		flagCardTemplate.clear();
		flagCardTemplate.render(response);
	});
}

function displayCaptainsFlaggedContent() {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Log/Flagged/",
			"method": "GET",
			"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		flagCardTemplate.clear();
		flagCardTemplate.render(response);
	});
}

function displaySubmissionFlaggedContent() {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/SubmissionLog/Flagged/",
			"method": "GET",
			"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		flagCardTemplate.clear();
		flagCardTemplate.render(response);
	});
}


function muteUser(user, method, id) {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/users/mute/" + user,
			"method": "PUT",
			"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
			"data": ""
		}
	$.ajax(settings).done(function (resp) {
		replaceContent(method, id, user);
	});
}

function replaceContent(method, id, userId)//method=log type to determine what server call to make
{
	if (method == "Parent") {
		var settings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/" + id + "/" + userId,
				"method": "DELETE",
				"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
				"data": ""
			}
		$.ajax(settings).done(function (response) {
			$("#replaceInput" + id).val("");
		});
	}
	else if (method == "Submission") {
		var msg = $("#replaceInput").val();

		var settings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/SubmissionLog/ReplaceBadContent/" + id + "/" + msg + "/" + userId,
				"method": "PUT",
				"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
				"data": ""
			}
		$.ajax(settings).done(function (response) {
			$("#replaceInput" + id).val("");
		});
	}
	else if (method == "Log") {
		var msg = $("#replaceInput" + id).val();

		var settings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Log/ReplaceBadContent/" + id + "/" + msg + "/" + userId,
				"method": "PUT",
				"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
				"data": ""
			}
		$.ajax(settings).done(function (response) {
			console.log(response);
			$("#replaceInput" + id).val("");
		});
	}
}

function unFlag(method, id) {
	if (method == "Parent") {
		var settings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/unFlag/" + id,
				"method": "PUT",
				"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
				"data": ""
			}
		$.ajax(settings).done(function (response) {
			console.log(response);
		});
	}
	else if (method == "Submission") {
		var settings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/SubmissionLog/unFlag/" + id,
				"method": "PUT",
				"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
				"data": ""
			}
		$.ajax(settings).done(function (response) {
			console.log(response);
		});
	}
	else if (method == "Log") {
		var settings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Log/unFlag/" + id,
				"method": "PUT",
				"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
				"data": ""
			}
		$.ajax(settings).done(function (response) {
			console.log(response);
		});
	}
}


function toggleUserLogOutDiv(user) {
	if ($('.smallScreenDropDown').css('display') == 'none')//large screen
	{
		$(".loginElementLarge").css('display', 'none');
		$(".loginElementSmall").css('display', 'none');

		$("#usernameDisplayLabel").html("Hello, " + user + "!");
		$("#smallusernameDisplayLabel").html("Hello, " + user + "!");

		$(".logoutElementLarge").show();
		$(".logoutElementSmall").show();

		$(".loginElementSmall").css('display', 'none');
	}
	else {
		$(".loginElementSmall").css('display', 'none');
		$(".loginElementLarge").css('display', 'none');

		$("#smallusernameDisplayLabel").html("Hello, " + user + "!");
		$("#usernameDisplayLabel").html("Hello, " + user + "!");

		$(".logoutElementSmall").show();
	}
}

function toggleUserLogInDiv() {
	if ($('.smallScreenDropDown').css('display') == 'none')//large screen
	{
		$(".logoutElementLarge").css('display', 'none');
		$(".logoutElementSmall").css('display', 'none');
		$("#smallModPageButton").css('display', 'none');
		$("#ModPageButton").css('display', 'none');

		$(".loginElementLarge").show();
		$(".loginElementSmall").show();
	}
	else {
		$(".logoutElementSmall").css('display', 'none');
		$(".logoutElementLarge").css('display', 'none');
		$("#smallModPageButton").css('display', 'none');
		$("#ModPageButton").css('display', 'none');

		$(".loginElementSmall").show();
	}
}
