$(document).ready(function () {

    var FAQcard = Tempo.prepare('FAQArea');
    DisplayFAQ();
    checkUserSignedIn();//changing elements in the page depending on if there is a user signed in or not

    function DisplayFAQ() {

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://" + window.location.hostname + ":" +window.location.port+"/FAQ/",
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": "{\n\t\"Q\":\"Q\",\n\t\"A\":\"A\"\n}"
        }

        $.ajax(settings).done(function (response) {
            FAQcard.clear();
            FAQcard.render(response);
        });
    }
});