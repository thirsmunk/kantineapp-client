$(document).ready(() => {

    console.log("foo")

    //Loads the navbar
    SDK.Navigation.loadNav();

    //On click of the login button
    $("#login-button").click(() => {

        //Put entered information in boxes into variables
        const username = $("#inputUsername").val();
        const password = $("#inputPassword").val();

        //Send variables as parameters in SDK function
        SDK.LogInOut.logIn(username, password, (err, data) => {
            //If something exists within the error object and the XML HTTP Request returns a 400 error code do...
           if (err && err.xhr.status === 401) {
               //Add error message
            $("#inputUsername").attr("placeholder", "Username or password incorrect!");
            $("#inputPassword").attr("placeholder", "Username or password incorrect!");
           }
           else if (err) {
               console.log("Error occured" + err.print());
           } else {
               //Save the username in the localStorage for personalization
            SDK.Storage.persist("Username", username);

            //Redirect to index.html
               window.location.href = "index.html";
           }
        });

    });


    //On success

    //On failure
});