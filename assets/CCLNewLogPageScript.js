	
			$(document).ready(function()
      {
        checkUserSignedIn();

	      function getMaxChar()
	      {
	        var maxChar = 4000;

	        if($("#maxChardropdownMenuButton").html() == $("#maxChar500").html())
	        {
	          maxChar = 500;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar1000").html())
	        {
	          maxChar = 1000;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar2000").html())
	        {
	          maxChar = 2000;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar4000").html())
	        {
	          maxChar = 4000;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar10000").html())
	        {
	          maxChar = 10000;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar20000").html())
	        {
	          maxChar = 20000;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar50000").html())
	        {
	          maxChar = 50000;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar100000").html())
	        {
	          maxChar = 100000;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar200000").html())
	        {
	          maxChar = 200000;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar400000").html())
	        {
	          maxChar = 400000;
	        }
	        else if($("#maxChardropdownMenuButton").html() == $("#maxChar1000000").html())
	        {
	          maxChar = 1000000;
	        }

	        return maxChar;
	      }


	      function getSubTime()
	      {
	      	var subTime = 600000;
	        if($("#subTimedropdownMenuButton").html() == $("#subTime10min").html())
	        {
	          subTime = 600000;
	        }
	        if($("#subTimedropdownMenuButton").html() == $("#subTime30min").html())
	        {
	          subTime = 1800000;
	        }
	        if($("#subTimedropdownMenuButton").html() == $("#subTime1hr").html())
	        {
	          subTime = 3600000;
	        }
	        if($("#subTimedropdownMenuButton").html() == $("#subTime3hr").html())
	        {
	          subTime = 10800000;
	        }
	        if($("#subTimedropdownMenuButton").html() == $("#subTime12hr").html())
	        {
	          subTime = 43200000;
	        }
	        if($("#subTimedropdownMenuButton").html() == $("#subTime1day").html())
	        {
	          subTime = 86400000;
	        }
	        if($("#subTimedropdownMenuButton").html() == $("#subTime3day").html())
	        {
	          subTime = 259200000;
	        }
	        if($("#subTimedropdownMenuButton").html() == $("#subTime1week").html())
	        {
	          subTime = 604800000;
	        }

	        return subTime;
	      }

	      function getVoteTime()
	      {
	      	var voteTime = 600000;
	        if($("#voteTimedropdownMenuButton").html() == $("#voteTime10min").html())
	        {
	          voteTime = 600000;
	        }
	        if($("#voteTimedropdownMenuButton").html() == $("#voteTime30min").html())
	        {
	          voteTime = 1800000;
	        }
	        if($("#voteTimedropdownMenuButton").html() == $("#voteTime1hr").html())
	        {
	          voteTime = 3600000;
	        }
	        if($("#voteTimedropdownMenuButton").html() == $("#voteTime3hr").html())
	        {
	          voteTime = 10800000;
	        }
	        if($("#voteTimedropdownMenuButton").html() == $("#voteTime12hr").html())
	        {
	          voteTime = 43200000;
	        }
	        if($("#voteTimedropdownMenuButton").html() == $("#voteTime1day").html())
	        {
	          voteTime = 86400000;
	        }
	        if($("#voteTimedropdownMenuButton").html() == $("#voteTime3day").html())
	        {
	          voteTime = 259200000;
	        }
	        if($("#voteTimedropdownMenuButton").html() == $("#voteTime1week").html())
	        {
	          voteTime = 604800000;
	        }

	        return voteTime;
	      }

	      $("#subTime10min").click(function()
        {
          $("#subTimedropdownMenuButton").html($("#subTime10min").html());
        }); 

	      $("#subTime30min").click(function()
        {
          $("#subTimedropdownMenuButton").html($("#subTime30min").html());
        });   

	      $("#subTime1hr").click(function()
        {
          $("#subTimedropdownMenuButton").html($("#subTime1hr").html());
        });
	      
	      $("#subTime3hr").click(function()
        {
          $("#subTimedropdownMenuButton").html($("#subTime3hr").html());
        });
	      
	      $("#subTime12hr").click(function()
        {
          $("#subTimedropdownMenuButton").html($("#subTime12hr").html());
        });
	      
	      $("#subTime1day").click(function()
        {
          $("#subTimedropdownMenuButton").html($("#subTime1day").html());
        });
	      
	      $("#subTime3day").click(function()
        {
          $("#subTimedropdownMenuButton").html($("#subTime3day").html());
        });
	      
	      $("#subTime1week").click(function()
        {
          $("#subTimedropdownMenuButton").html($("#subTime1week").html());
        });
	  
	      $("#voteTime10min").click(function()
        {
          $("#voteTimedropdownMenuButton").html($("#voteTime10min").html());
        }); 

	      $("#voteTime30min").click(function()
        {
          $("#voteTimedropdownMenuButton").html($("#voteTime30min").html());
        });   
	      
	      $("#voteTime1hr").click(function()
        {
          $("#voteTimedropdownMenuButton").html($("#voteTime1hr").html());
        });
	      
	      $("#voteTime3hr").click(function()
        {
          $("#voteTimedropdownMenuButton").html($("#voteTime3hr").html());
        });
	      
	      $("#voteTime12hr").click(function()
        {
          $("#voteTimedropdownMenuButton").html($("#voteTime12hr").html());
        });
	      
	      $("#voteTime1day").click(function()
        {
          $("#voteTimedropdownMenuButton").html($("#voteTime1day").html());
        });
	      
	      $("#voteTime3days").click(function()
        {
          $("#voteTimedropdownMenuButton").html($("#voteTime3days").html());
        });
	      
	      $("#voteTime1week").click(function()
        {
          $("#voteTimedropdownMenuButton").html($("#voteTime1week").html());
        });

	      $("#maxChar500").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar500").html());
        });

	      $("#maxChar1000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar1000").html());
        });

	      $("#maxChar2000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar2000").html());
        });

	      $("#maxChar4000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar4000").html());
        });

	      $("#maxChar10000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar10000").html());
        });

	      $("#maxChar20000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar20000").html());
        });

	      $("#maxChar50000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar50000").html());
        });

	      $("#maxChar100000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar100000").html());
        });

	      $("#maxChar200000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar200000").html());
        });

	      $("#maxChar400000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar400000").html());
        });

	      $("#maxChar1000000").click(function()
        {
          $("#maxChardropdownMenuButton").html($("#maxChar1000000").html());
        });

        $("#ModPageButton").click(function()
        {
            window.location.href = "http://" + window.location.hostname + ":" +window.location.port+"/CCLModPage.html";
        });

        $("#postLogButton").click(function()
          {
              $("#postLogButton").prop("disabled",true);
              var errorMessage = "";
              var fieldsMissing = "";

              if ($("#inputLogName").val() == "") 
              {                  
                  fieldsMissing += "<br>Log Name";                  
              }

              if ($("#inputInitialLog").val() == "") 
              {                  
                  fieldsMissing += "<br>The log itself";                  
              }

              if ($("#inputCaptainsName").val() == "") 
              {                  
                  fieldsMissing += "<br>Captain's Name";                  
              }

              if ($("#inputShipsName").val() == "") 
              {                  
                  fieldsMissing += "<br>Ship's Name";                  
              }

              if ($("#subTimedropdownMenuButton").html() == "Submissions Time") 
              {                  
                  fieldsMissing += "<br>Submissions Time";                  
              }

              if ($("#voteTimedropdownMenuButton").html() == "Votes Time") 
              {                  
                  fieldsMissing += "<br>Votes Time";                  
              }

              if ($("#maxChardropdownMenuButton").html() == "Character Max") 
              {                  
                  fieldsMissing += "<br>Character Max";                  
              }
              else if($("#inputInitialLog").val().length > getMaxChar())
              {
                  errorMessage += "Your log is more than " + getMaxChar().toString()+" characters long";
              }

              if (fieldsMissing != "") 
              {                  
                  errorMessage += "<p>The following field(s) are missing:" + fieldsMissing;                  
              }              

              if (errorMessage != "") 
              {                  
                  $("#errorMessage").html(errorMessage);
                  $("#successMessage").hide();
                  $("#errorMessage").show();
                  return;
              } 
              else 
              {                    
                  $("#errorMessage").hide();                      
              }

              var content = $("#inputInitialLog").val();
              var postName = $("#inputLogName").val();
              var capName = $("#inputCaptainsName").val();
              var shipName = $("#inputShipsName").val();
              var subTime = getSubTime();
              var voteTime = getVoteTime();
              var maxChar = getMaxChar();

              var postData = 
              {
                Name: postName,
                Content: content,
                Captain:capName,
                Ship:shipName,
                CharLimit:maxChar,
                SubTime:subTime,
                VoteTime:voteTime,
                Stage:true
              };

              $.post("http://" + window.location.hostname + ":" +window.location.port+"/CaptainsLog/",postData).done(function(resp)
              {      
                $("#postLogButton").prop("disabled",false);
                if(resp != false)
                {
                    window.location.href = "http://" + window.location.hostname + ":" +window.location.port+"/CCLInitLogPage.html?logId="+resp._id;
                }
                else
                {
                    var errorMessage = "You must be logged as an unmuted user to post a new Captain's Log.";                    

                    if (errorMessage != "") 
                    {                          
                        $("#errorMessage").html(errorMessage);
                        $("#successMessage").hide();
                        $("#errorMessage").show();
                        return;
                    } 
                    else 
                    {                    
                        $("#errorMessage").hide();                      
                    }
                }
              });
          });        	
      });