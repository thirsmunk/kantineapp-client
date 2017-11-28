$(document).ready(() => {

    //Loads the navbar
    SDK.Navigation.loadNav();

    if(SDK.Storage.load("username")) {
        $("#index_hello").text("Hello, " + SDK.Storage.load("username") + " :-)");

        $("#index_text").text("You have successfully logged in and can now access the different menus.");

        if(SDK.Storage.load("isStaff")) {
            $("#index_text2").text("You are registered as staff and can therefore access all orders. You can use the menu or click the button below.");
            $(".btn-lg").attr("href", "stafforders.html");
        } else {
            $("#index_text2").text("You are registered as a student and can therefore access your own orders. You can use the menu or click the button below.");
        }

    } else {
        $(".btn-lg").remove();
    }




});