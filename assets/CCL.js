

var errorlistTemplate;
var successlistTemplate;
$(document).ready(function () {
	errorlistTemplate = Tempo.prepare("pageErrorList");
	successlistTemplate = Tempo.prepare("pageSuccessList");

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

						successlistTemplate.clear();

						successlistTemplate.render({ "msg": "Email to reset password has been sent to the email you are registered with" });
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

		$.post("http://" + window.location.hostname + ":" + window.location.port + "/users/login/", postData).done(function (postUserResponse) {
			if (postUserResponse == true) {
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
					console.log(userResponse);
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

							errorlistTemplate.clear();

							errorlistTemplate.render({ "msg": "Your account is currently muted. Unmuted functionality will return to your acount: " + mutedResponse });
						});
					}
					if (userResponse.Mod == true) {
						if ($('.smallScreenDropDown').css('display').toString() == 'none') {
							$("#ModPageButton").show();
						}
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
				console.log(postUserResponse);
				$('#loginButton').prop('disabled', false);
				$("#successMessage").hide();
				$("#errorMessage").show();
				$("#pageErrorList").show();

				errorlistTemplate.clear();

				errorlistTemplate.render(postUserResponse);
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


	$("#smallforgotPassLink").click(function () {
		$('#smallforgotPassLink').prop('disabled', true);
		var errorMessage = "";
		var user = $("#smallusernameInput").val();

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
					$('#smallforgotPassLink').prop('disabled', false);
					if (forgotResponse == true) {
						$("#errorMessage").hide();
						$("#successMessage").show();
						$("#pageSuccessList").show();

						successlistTemplate.clear();

						successlistTemplate.render({ "msg": "Email to reset password has been sent to the email you are registered with" });
					}
				});
			}
		});
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

							errorlistTemplate.clear();

							errorlistTemplate.render({ "msg": "Your account is currently muted. Unmuted functionality will return to your acount: " + mutedResponse });
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

				errorlistTemplate.clear();

				errorlistTemplate.render(userResponse);
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
			console.log(response);
			if (response.Mod == true && $(".smallScreenDropDown").css("display") == "none") $("#ModPageButton").show();
			else $("#ModPageButton").hide();
			toggleUserLogOutDiv(response.username);
		}
	});
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

