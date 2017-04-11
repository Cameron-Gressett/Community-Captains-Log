
var voteSubLogCardTemplate;
var subLogCardTemplate;
var InitLogErrorlistTemplate;
var InitLogSuccesslistTemplate;
var logPaginationTemplate;
var submisionInitLogErrorlistTemplate;
var subLogPaginationTemplate;
var votingErrorsTemplate;

$(document).ready(function () {
	voteSubLogCardTemplate = Tempo.prepare("submissionLogList").when(TempoEvent.Types.ITEM_RENDER_STARTING, function (event) {
		var settings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/SubmissionLog/VotedInPost/" + event.item._id,
				"method": "GET",
				"headers": { "content-type": "application/json", "cache-control": "no-cache" },
				"processData": false,
				"data": ""
			}
		$.ajax(settings).done(function (response) {

			console.log(response);
			if (response == true) {
				console.log($("#subLogInstanceCard" + event.item._id).addClass('votedCard'));
				$("#subLogInstanceCard" + event.item._id).css("background-color", "#7606fb");
			}
		});
	});

	subLogCardTemplate = Tempo.prepare("officialLogList");
	InitLogErrorlistTemplate = Tempo.prepare("pageErrorList");
	InitLogSuccesslistTemplate = Tempo.prepare("pageSuccessList");
	logPaginationTemplate = Tempo.prepare("officialLogPages");
	submisionInitLogErrorlistTemplate = Tempo.prepare("submissionErrorList");
	subLogPaginationTemplate = Tempo.prepare("homeLogPages");
	votingErrorsTemplate = Tempo.prepare("votingErrorList");


	checkUserSignedIn();//changing elements in the page depending on if there is a user signed in or not

	checkUserRatable();//checks what actions the current logged in user has already taken on the page and can no longer do (ex: liking and disliking)				

	adjustRatingVals();//calculates the rating based on how many likes the captain's log has against how many likes/dislikes 

	wakePageInteractions(getURLLogID());//begins stage and enables user interaction with the page		          



	$("#logLikeButton").click(function () {
		likeLog();
	});

	$("#logDislikeButton").click(function () {
		dislikeLog();
	});


	$("#postSubButton").click(function () {
		$("#postSubButton").prop("disabled", true);
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
		$.ajax(settings).done(function (userResponse) {
			if (userResponse == false) {
				$("#postSubButton").prop("disabled", false);
				$("#submissionErrorMessage").show();

				submisionInitLogErrorlistTemplate.clear();

				submisionInitLogErrorlistTemplate.render({ "msg": "You must be logged in to post a submission" });
			}
			else {
				var subPost = $("#subPostText").val();

				var postData =
					{
						Name: "",
						Content: subPost,
						User: userResponse,
						PostID: getURLLogID()
					};

				$.post("http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/SubmissionLog", postData).done(function (subResponse) {
					$("#postSubButton").prop("disabled", false);
					if (subResponse == true) {
						$("#submissionErrorMessage").hide();
						$("#subPostText").val("");
					}
					else {
						$("#submissionErrorMessage").show();

						submisionInitLogErrorlistTemplate.clear();

						submisionInitLogErrorlistTemplate.render(subResponse);
					}
				});
			}
		});
	});

	$("#forgotPassLink").click(function () {
		$('#forgotPassLink').prop('disabled', true);
		var errorMessage = "";
		var user = $("#usernameInput").val();

		if (user == "") {
			errorMessage += "<br>Search field is blank";
		}

		if (errorMessage != "") {
			$("#errorMessage").html(errorMessage);
			$("#successMessage").hide();
			$("#errorMessage").show();
			return;
		}
		else {
			$("#errorMessage").hide();
		}

		var userSettings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/users/user/username/" + user,
				"method": "GET",
				"headers": { "content-type": "application/json", "cache-control": "no-cache" },
				"processData": false,
				"data": ""
			}
		$.ajax(userSettings).done(function (userResponse) {
			if (userResponse == false) {
				errorMessage += "Must have a valid username inputed to reset password";

				$("#errorMessage").html(errorMessage);
				$("#successMessage").hide();
				$("#errorMessage").show();
				return;
			}
			else {
				var forgotSettings =
					{
						"async": true,
						"crossDomain": true,
						"url": "http://" + window.location.hostname + ":" + window.location.port + "/users/forgot/",
						"method": "POST",
						"headers": { "content-type": "application/json", "cache-control": "no-cache" },
						"processData": false,
						"data": "{\n\t\"email\":\"" + userResponse[0].email + "\"\n}"
					}
				$.ajax(forgotSettings).done(function (forgotResponse) {
					$('#forgotPassLink').prop('disabled', false);
					if (forgotResponse == true) {
						$("#errorMessage").hide();
						$("#successMessage").show();
						$("#pageSuccessList").show();

						InitLogSuccesslistTemplate.clear();

						InitLogSuccesslistTemplate.render({ "msg": "Email to reset password has been sent to the email you are registered with" });
					}
				});
			}
		});
	});

	$("#ModPageButton").click(function () {
		window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/CCLModPage.html";
	});



	$("#loginButton").click(function () {
		$('#loginButton').prop('disabled', true);
		var user = $("#usernameInput").val();
		var pass = $("#passwordInput").val();

		var postData =
			{
				username: user,
				password: pass
			};

		$.post("http://" + window.location.hostname + ":" + window.location.port + "/users/login/", postData).done(function (userResponse) {
			if (userResponse == true) {
				$("#errorMessage").hide();

				var userSettings =
					{
						"async": true,
						"crossDomain": true,
						"url": "http://" + window.location.hostname + ":" + window.location.port + "/users/user/",
						"method": "GET",
						"headers": { "content-type": "application/json", "cache-control": "no-cache" },
						"processData": false,
						"data": ""
					}
				$.ajax(userSettings).done(function (userResponse) {
					$('#loginButton').prop('disabled', false);
					if (userResponse.Muted == true) {
						$('#loginButton').prop('disabled', true);
						var mutedSettings =
							{
								"async": true,
								"crossDomain": true,
								"url": "http://" + window.location.hostname + ":" + window.location.port + "/users/MuteTimeExp/" + userResponse._id,
								"method": "GET",
								"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
								"data": ""
							}
						$.ajax(mutedSettings).done(function (mutedResponse) {
							$('#loginButton').prop('disabled', false);

							$("#successMessage").hide();
							$("#errorMessage").show();
							$("#pageErrorList").show();

							InitLogErrorlistTemplate.clear();

							InitLogErrorlistTemplate.render({ "msg": "Your account is currently muted. Unmuted functionality will return to your acount: " + mutedResponse });
						});
					}
					if (userResponse.Mod == true) {
						console.log($('.smallScreenDropDown').css('display').toString());
						if ($('.smallScreenDropDown').css('display').toString() == 'none') {
							console.log("mod");
							$("#ModPageButton").show();
						}
						else $("#smallModPageButton").show();
					}
					else {
						console.log("not mod");
						$("#smallModPageButton").hide();
						$("#ModPageButton").hide();
					}
					toggleUserLogOutDiv(userResponse.username);
				});
			}
			else {
				$('#loginButton').prop('disabled', false);
				$("#successMessage").hide();
				$("#errorMessage").show();
				$("#pageErrorList").show();

				InitLogErrorlistTemplate.clear();

				InitLogErrorlistTemplate.render(userResponse);
			}
		});
	});

	$("#ModPageButton").click(function () {
		window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/CCLModPage.html";
	});

	$("#logoutButton").click(function () {
		var settings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/users/logout/",
				"method": "GET",
				"headers": { "content-type": "application/json", "cache-control": "no-cache" },
				"processData": false,
				"data": ""
			}
		$.ajax(settings).done(function (response) {
			toggleUserLogInDiv();
		});
	});

	$("#signupButton").click(function () {
		console.log("in sign up button");
		window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/CCLSignUpPage.html";
	});



	$("#smallloginButton").click(function () {
		$('#smallloginButton').prop('disabled', true);
		var user = $("#smallusernameInput").val();
		var pass = $("#smallpasswordInput").val();

		var postData =
			{
				username: user,
				password: pass
			};

		$.post("http://" + window.location.hostname + ":" + window.location.port + "/users/login/", postData).done(function (userResponse) {
			if (userResponse == true) {
				$("#errorMessage").hide();

				var userSettings =
					{
						"async": true,
						"crossDomain": true,
						"url": "http://" + window.location.hostname + ":" + window.location.port + "/users/user/",
						"method": "GET",
						"headers": { "content-type": "application/json", "cache-control": "no-cache" },
						"processData": false,
						"data": ""
					}
				$.ajax(userSettings).done(function (userResponse) {
					$('#smallloginButton').prop('disabled', false);
					if (userResponse.Muted == true) {
						$('#smallloginButton').prop('disabled', true);
						var mutedSettings =
							{
								"async": true,
								"crossDomain": true,
								"url": "http://" + window.location.hostname + ":" + window.location.port + "/users/MuteTimeExp/" + userResponse._id,
								"method": "GET",
								"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
								"data": ""
							}
						$.ajax(mutedSettings).done(function (mutedResponse) {
							$('#smallloginButton').prop('disabled', false);

							$("#successMessage").hide();
							$("#errorMessage").show();
							$("#pageErrorList").show();

							InitLogErrorlistTemplate.clear();

							InitLogErrorlistTemplate.render({ "msg": "Your account is currently muted. Unmuted functionality will return to your acount: " + mutedResponse });
						});
					}
					if (userResponse.Mod == true) {
						if ($('.smallScreenDropDown').css('display') == 'none')
							$("#ModPageButton").show();
						else $("#smallModPageButton").show();
					}
					else {
						$("#smallModPageButton").hide();
						$("#ModPageButton").hide();
					}
					toggleUserLogOutDiv(userResponse.username);
				});
			}
			else {
				$('#smallloginButton').prop('disabled', false);
				$("#successMessage").hide();
				$("#errorMessage").show();
				$("#pageErrorList").show();

				InitLogErrorlistTemplate.clear();

				InitLogErrorlistTemplate.render(userResponse);
			}
		});
	});

	$("#smallModPageButton").click(function () {
		window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/CCLModPage.html";
	});

	$("#smalllogoutButton").click(function () {
		var settings =
			{
				"async": true,
				"crossDomain": true,
				"url": "http://" + window.location.hostname + ":" + window.location.port + "/users/logout/",
				"method": "GET",
				"headers": { "content-type": "application/json", "cache-control": "no-cache" },
				"processData": false,
				"data": ""
			}
		$.ajax(settings).done(function (response) {
			toggleUserLogInDiv();
		});
	});

	$("#smallsignupButton").click(function () {
		console.log("in sign up button");
		window.location.href = "http://" + window.location.hostname + ":" + window.location.port + "/CCLSignUpPage.html";
	});
});








function checkUserSignedIn() {
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
			toggleUserLogInDiv();
		}
		else {
			if (response.Mod == true) $("#ModPageButton").show();
			else $("#ModPageButton").hide();
			toggleUserLogOutDiv(response.username);
		}
	});
}

function adjustRatingVals() {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/GetRatingVars/" + getURLLogID(),
			"method": "GET",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		$("#dislikes").html(response.D);
		$("#likes").html(response.L);
		if (response.R != null) $("#ratingsLabel").html(response.R + "%");
		else $("#ratingsLabel").html("unrated");
	});
}

function checkUserRatable() {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/CheckRated/" + getURLLogID() + "",
			"method": "GET",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		if (response != false) {
			if (response.rate == true)//like
			{
				$("#logLikeButton").attr("disabled", true);
				$("#logDislikeButton").attr("disabled", true);

				$("#logLikeButton").css("background-color", "#00308F");
				$("#logDislikeButton").css("background-color", "#DBDBDB");
			}
			else if (response.rate == false)//dislike
			{
				$("#logLikeButton").attr("disabled", true);
				$("#logDislikeButton").attr("disabled", true);

				$("#logDislikeButton").css("background-color", "#00308F");
				$("#logLikeButton").css("background-color", "#DBDBDB");
			}
		}
	});
}

function displayParentLog(logInfo) {
	$("#usernameText").html(logInfo.User);
	$("#LogNameText").html(logInfo.Name);
	document.title = logInfo.Name + " - Community Captain's Log";
	$("#LogText").html(logInfo.Content);
	$("#captainsNameText").html(logInfo.Captain);
	$("#shipsNameText").html(logInfo.Ship);
	$("#charText").html(logInfo.CharLimit);
}

function setStage() {
	loadDisplayLogs();

	var stageSsettings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Stage/" + getURLLogID(),
			"method": "GET",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": ""
		}
	$.ajax(stageSsettings).done(function (stageResponse) {
		stage = stageResponse;

		if (stageResponse == true)//submission Time
		{
			$("#submissionsPostDiv").show();
			$("#allSubmissionsDiv").hide();
			$("#timerLbl").html("Submissions time: ");

			getRemainingTime();
		}
		else//vote Time
		{
			$("#submissionsPostDiv").hide();
			$("#allSubmissionsDiv").show();
			$("#timerLbl").html("Voting time: ");

			var postSettings =
				{
					"async": true,
					"crossDomain": true,
					"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/SubmissionLog/Post/" + getURLLogID() + '/1',
					"method": "GET",
					"headers": { "content-type": "application/json", "cache-control": "no-cache" },
					"processData": false,
					"data": ""
				}
			$.ajax(postSettings).done(function (postResponse) {
				var pageAmount = postResponse.pages;
				if (pageAmount > 1) {
					$("#subPagesDiv").show();
					setupSubLogPages(postResponse, "displayVoteSubLogs");
				}
				else {
					$("#subPagesDiv").hide();
				}

				voteSubLogCardTemplate.clear();

				voteSubLogCardTemplate.render(postResponse.docs);

				getRemainingTime();
			});
		}

	});
}


function wakePageInteractions(id) {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/ID/" + id,
			"method": "GET",
			"headers": { "cache-control": "no-cache" }
		}
	$.ajax(settings).done(function (response) {
		displayParentLog(response);

		setStage();
	});
}


function loadDisplayLogs() {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Log/Post/" + getURLLogID() + "/1",
			"method": "GET",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		var pageAmount = response.pages;

		if (pageAmount > 1) {
			$("#officialLogPages").show();
			setupLogPages(response, "displayPagedLogs");
		}
		else {
			$("#officialLogPages").show();
		}

		subLogCardTemplate.clear();

		subLogCardTemplate.render(response.docs);
	});
}

function displayPagedLogs(pageNum) {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Log/Post/" + getURLLogID() + "/" + pageNum,
			"method": "GET",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": ""
		}

	$.ajax(settings).done(function (response) {
		var pageAmount = response.pages;

		subLogCardTemplate.clear();

		subLogCardTemplate.render(response.docs);

		setupLogPages(response, "displayPagedLogs");
	});
}

function getURLLogID() {
	var urlVars = getUrlVars();
	return urlVars["logId"];
}

function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
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

function displayVoteSubLogs(pageNum) {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/SubmissionLog/Post/" + getURLLogID() + '/' + pageNum,
			"method": "GET",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		var pageAmount = response.pages;

		voteSubLogCardTemplate.clear();

		voteSubLogCardTemplate.render(response.docs);

		setupSubLogPages(response, "displayVoteSubLogs");
	});
}

function getRemainingTime() {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Timer/" + getURLLogID(),
			"method": "GET",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		var now = new Date();
		var time = response - now.getTime();
		if (time > 0) {
			setTimer(time / 1000);
			startTimer(response);
		}
		else {
			runWaitingStageChanger();
		}
	});
}

var timer;
var days;
var hours;
var minutes;
var seconds;
var timeInterval;
var stage;

function startTimer(exp) {
	timeInterval = setInterval(function () { runTimer(exp) }, 1000);
}

function stopTimer() {
	clearInterval(timeInterval);
}

function setTimer(duration)//duration=amount of seconds
{
	timer = duration, days, hours, minutes, seconds;
}

function runTimer(exp) {
	var now = new Date();
	var time = exp - now.getTime();
	setTimer(time / 1000);

	days = parseInt(timer / 86400, 10);
	var daysMod = parseInt(timer % 86400, 10);

	hours = parseInt(daysMod / 3600, 10);
	var hoursMod = parseInt(daysMod % 3600, 10);

	minutes = parseInt(hoursMod / 60, 10);

	seconds = parseInt(hoursMod % 60, 10);

	$("#timer").html(days.toString() + "d:" + hours.toString() + "h:" + minutes.toString() + "m:" + seconds.toString() + "s");

	if (--timer < 0) //end of timer
	{
		stopTimer();
		runEventTimerCompleted();
	}
}

function runEventTimerCompleted()//checks if server has changed stages before starting next stage on page
{
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Stage/" + getURLLogID(),
			"method": "GET",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		if (response != stage) {
			setStage();
		}
		else {
			runWaitingStageChanger();
		}
	});
}

var waitingStageChanger;

function runWaitingStageChanger()//if server hasn't changed stages this waits until it has changed stages
{
	$("#timer").hide();
	$("#timerLbl").html("One moment...");
	$("#submissionsPostDiv").hide();
	$("#allSubmissionsDiv").hide();

	stageCheckOpenable = true;

	waitingStageChanger = setInterval(function () { runWaitForStage() }, 1000);
}

var stageCheckOpenable = true;

function runWaitForStage()//checks if server has changed stages once a second
{
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Stage/" + getURLLogID(),
			"method": "GET",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		if (stageCheckOpenable) {
			if (response != stage) {
				stageCheckOpenable = false;
				clearInterval(waitingStageChanger);
				$("#timer").show();
				setStage();
			}
		}
	});
}


function setupLogPages(response, method) {
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

	logPaginationTemplate.render(data);

	$("#logPageNumber" + (page).toString()).removeClass("lcars-CCLlightorange-bg");
	$("#logPageNumber" + (page).toString()).addClass("selectedPage");
}


function setupSubLogPages(response, method) {

	var pageAmount = parseInt(response.pages);
	var page = parseInt(response.page);
	var data = [];

	if (page > 5) {
		data[0] = { "page": page - 4, "method": method };

		data[1] = { "page": page - 3, "method": method };

		data[2] = { "page": page - 2, "method": method };

		data[3] = { "page": page - 1, "method": method };

		data[4] = { "page": page, "method": method };

		if (pageAmount >= page + 1) {
			data[5] = { "page": page + 1, "method": method };
		}
		if (pageAmount >= page + 2) {
			data[6] = { "page": page + 2, "method": method };
		}
		if (pageAmount >= page + 3) {
			data[7] = { "page": page + 3, "method": method };
		}
		if (pageAmount >= page + 4) {
			data[8] = { "page": page + 4, "method": method };
		}


	}
	else {
		for (var i = 0; i < pageAmount && i < 9; i += 1) {
			var j = i + 1;

			data[i] = { "page": j, "method": method };


		}
	}

	subLogPaginationTemplate.render(data);

	$("#subLogPageNumber" + (page).toString()).removeClass("selectedPage");
	$("#subLogPageNumber" + (page).toString()).addClass("lcars-CCLlightorange-bg");
}


function voteForSubmission(id) {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/SubmissionLog/Vote/",
			"method": "PUT",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": "{\n\t\"_id\":\"" + id + "\"\n\t\n}"
		}
	$.ajax(settings).done(function (response) {
		if (response == true) {
			$("#votingErrorMessage").hide();
			$("#subLogInstanceCard" + id).css("background-color", "#7606fb");
			$("#subLogInstanceCard" + id).css("color", "#000000");
		}
		else {
			var voteErrors = [];

			voteErrors.push({ "msg": response });

			$("#votingErrorMessage").show();

			votingErrorsTemplate.clear();

			votingErrorsTemplate.render(voteErrors);
		}
	});
}

function likeLog() {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Rate/Like",
			"method": "PUT",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": "{\n\t\"_id\":\"" + getURLLogID() + "\"\n\t\n}"
		}
	$.ajax(settings).done(function (response) {
		if (response == true) {
			$("#logLikeButton").attr("disabled", true);
			$("#logDislikeButton").attr("disabled", true);

			$("#logLikeButton").css("background-color", "#00308F");
			$("#logDislikeButton").css("background-color", "#DBDBDB");

			adjustRatingVals();
		}
		else {
			$("#successMessage").hide();
			$("#errorMessage").show();

			InitLogErrorlistTemplate.clear();

			InitLogErrorlistTemplate.render({ "msg": response.toString() });
		}
	});
}

function dislikeLog() {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Rate/Dislike",
			"method": "PUT",
			"headers": { "content-type": "application/json", "cache-control": "no-cache" },
			"processData": false,
			"data": "{\n\t\"_id\":\"" + getURLLogID() + "\"\n\t\n}"
		}
	$.ajax(settings).done(function (response) {
		if (response == true) {
			$("#logLikeButton").attr("disabled", true);
			$("#logDislikeButton").attr("disabled", true);

			$("#logDislikeButton").css("background-color", "#00308F");
			$("#logLikeButton").css("background-color", "#DBDBDB");

			adjustRatingVals();
		}
		else {
			$("#successMessage").hide();
			$("#errorMessage").show();

			InitLogErrorlistTemplate.clear();

			InitLogErrorlistTemplate.render({ "msg": "You must be logged in to dislike a post" });
		}
	});
}

function flagParent(id) {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Flag/" + id,
			"method": "PUT",
			"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
			"data": ""
		}
	$.ajax(settings).done(function (response) {
		console.log(response);
		if (response == true) {
			$("#errorMessage").hide();
			$("#successMessage").show();
			$("#pageSuccessList").show();

			InitLogSuccesslistTemplate.clear();

			InitLogSuccesslistTemplate.render({ "msg": "Your report has been sent to our moderators. The problem will be handled within the next few days." });
		}
		else {
			$("#successMessage").hide();
			$("#errorMessage").show();

			InitLogErrorlistTemplate.clear();

			InitLogErrorlistTemplate.render({ "msg": "You must be logged in and unmuted to report content." });
		}
	});
}

function flagLog(id) {
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/Log/Flag/" + id,
			"method": "PUT",
			"headers": {
				"content-type": "text/plain",
				"cache-control": "no-cache"
			},
			"data": ""
		}

	$.ajax(settings).done(function (response) {
		if (response = true) {
			$("#errorMessage").hide();
			$("#successMessage").show();
			$("#pageSuccessList").show();

			InitLogSuccesslistTemplate.clear();

			InitLogSuccesslistTemplate.render({ "msg": "Your report has been sent to our moderators. The problem will be handled within the next few days." });
		}
		else {
			$("#successMessage").hide();
			$("#errorMessage").show();

			InitLogErrorlistTemplate.clear();

			InitLogErrorlistTemplate.render({ "msg": "You must be logged in and unmuted to report content." });
		}
	});
}

function flagSubmission(id) {
	console.log("it's a bitch");
	var settings =
		{
			"async": true,
			"crossDomain": true,
			"url": "http://" + window.location.hostname + ":" + window.location.port + "/CaptainsLog/SubmissionLog/Flag/" + id,
			"method": "PUT",
			"headers": { "content-type": "text/plain", "cache-control": "no-cache" },
			"data": ""
		}

	$.ajax(settings).done(function (response) {
		console.log(response);
		if (response = true) {
			$("#errorMessage").hide();
			$("#successMessage").show();
			$("#pageSuccessList").show();

			InitLogSuccesslistTemplate.clear();

			InitLogSuccesslistTemplate.render({ "msg": "Your report has been sent to our moderators. The problem will be handled within the next few days." });
		}
		else {
			$("#successMessage").hide();
			$("#errorMessage").show();

			InitLogErrorlistTemplate.clear();

			InitLogErrorlistTemplate.render({ "msg": "You must be logged in and unmuted to report content." });
		}
	});
}