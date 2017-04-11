      $(document).ready(function()
      {    
			var errorlistTemplate = Tempo.prepare( "resetErrorList" ); 

			function getURLResetToken()
			{
				var urlVars = getUrlVars();
				return urlVars["resetToken"];
			}

			function getUrlVars()
			{
			    var vars = [], hash;
			    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			    for(var i = 0; i < hashes.length; i++)
			    {
			        hash = hashes[i].split('=');
			        vars.push(hash[0]);
			        vars[hash[0]] = hash[1];
			    }
			    return vars;
			}

			$("#updatePassButton").click(function()
			{
				var pass = $("#signUpInputPassword1").val();
				var confirm = $("#passwordConfirm").val();

				var settings = 
				{
					"async": true,
					"crossDomain": true,
					"url": "http://" + window.location.hostname + ":" +window.location.port+"/users/token/"+getURLResetToken(),
					"method": "GET",
					"headers": {"content-type": "application/json","cache-control": "no-cache"},
					"processData": false,
					"data": ""
				}
				$.ajax(settings).done(function (response) 
				{
					if(false)
					{
						$("#errorSignUpMessage").hide();
						window.location.href = "http://" + window.location.hostname + ":" +window.location.port+"/CCL.html";
						alert("You're reset password link has expired. Please try again.");
					}
					else
					{
						var settings = 
						{
							"async": true,
							"crossDomain": true,
							"url": "http://" + window.location.hostname + ":" +window.location.port+"/users/ResetPass/"+response._id,
							"method": "PUT",
							"headers": {"content-type": "application/json","cache-control": "no-cache"},
							"processData": false,
							"data": "{\n\t\"password\":\""+pass+"\",\n\t\"password2\":\""+confirm+"\"\n\t\n}"
						}
						$.ajax(settings).done(function (resp) 
						{
							if(resp == true)
							{
								$("#errorSignUpMessage").hide();
								window.location.href = "http://" + window.location.hostname + ":" +window.location.port+"/CCL.html";
								alert("You're password was successfully reset! Please log in.");
							}
							else
							{
								$("#errorSignUpMessage").show();

								errorlistTemplate.clear();

								errorlistTemplate.render( resp );
							}
						});
					}
				});
			});		        

      });