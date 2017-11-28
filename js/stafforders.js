$(document).ready(() => {

    //Loads the navbar
    SDK.Navigation.loadNav();


    SDK.Staff.findAll((err, data) => {

        if(err) {
            alert("Something went wrong!");
            console.log(err);
        }



    });




});