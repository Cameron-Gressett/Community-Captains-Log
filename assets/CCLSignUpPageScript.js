      $(document).ready(function()
      {    

				var errorlistTemplate = Tempo.prepare( "signupErrorList" ); 

				$("#signUserUp").click(function() 
				{
					$("#signUserUp").prop("disabled",true);
					var user = $("#signUpInputUsername1").val();
					var pass = $("#signUpInputPassword1").val();
					var confirm = $("#passwordConfirm").val();
					var emailAd = $("#emailInput").val();
					
					var postData = 
					{
						username: user,
						password: pass,
						password2: confirm,
						email: emailAd
					};

					$.post("http://" + window.location.hostname + ":" +window.location.port+"/users/register/",postData).done(function(response)
					{
						$("#signUserUp").prop("disabled",false);

						if(response == true)
						{
							$("#errorSignUpMessage").hide();
							window.location.href = "http://" + window.location.hostname + ":" +window.location.port+"/CCL.html";
							alert("You are successfully registered! Please log in.");
						}
						else
						{
							$("#errorSignUpMessage").show();

							errorlistTemplate.clear();

							errorlistTemplate.render( response );
						}
					});
				});				
      });