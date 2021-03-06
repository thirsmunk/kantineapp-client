$(document).ready(() => {

    //Loads the navbar
    SDK.Navigation.loadNav();

    //On click of the login button
    $("#create-button").click(() => {

        //Put entered information in boxes into variables
        const username = $("#inputCreateUsername").val();
        const password = $("#inputCreatePassword").val();

        if (!username || !password) {
            alert("Remember to input both username and password!");
            return;
        }

        //Send variables as parameters in SDK function
        SDK.User.createUser(username, password, (err) => {

            if (err) {
                console.log("Error occured");
                $(".form-group").addClass("has-error");
                alert("Couldn't create user");

            } else {

                //success
                alert("User created!");
                window.location.href = "login.html";
            }
        });

    });

});