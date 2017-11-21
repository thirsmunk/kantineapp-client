$(document).ready(() => {

    //Loads the navbar
    SDK.Navigation.loadNav();

    //On click of the login button
    $("#create-button").click(() => {

        //Put entered information in boxes into variables
        const username = $("#inputUsername").val();
        const password = $("#inputPassword").val();

        //Send variables as parameters in SDK function
        SDK.User.createUser(username, password, (err) => {

            if (err) {
                console.log("Error occured");
                console.log(err);
                alert("Couldn't create user");

            } else {

                //success
                alert("User created!");
                window.location.href = "login.html";
            }
        });

    });

});