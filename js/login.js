$(document).ready(() => {

    //Loads the navbar
    SDK.Navigation.loadNav();

    //On click of the login button
    $("#login-button").click(() => {

        //Put entered information in boxes into variables
        const username = $("#inputUsername").val();
        const password = $("#inputPassword").val();

        //Send variables as parameters in SDK function
        SDK.LogInOut.logIn(username, password, (err) => {
            //If something exists within the error object and the XML HTTP Request returns a 400 error code do...
            if (err && err.xhr.status === 401) {

                //Add error message
                $(".form-group").addClass("has-error");
                $("#inputUsername").val("The username or password is incorrect!");
                $("#inputPassword").val("");

            }
            else if (err) {
                console.log("Error occured");
                $(".form-group").addClass("has-error");

            } else {

                //Redirect to index.html
                window.location.href = "index.html";
            }
        });

    });

});