$(document).ready(() => {

    const activeToken = SDK.Storage.load("token");
    /*Using the attribute starts-with the logic checks if a user is logged in before allowing access to Menu and My Orders.
    If no user is logged in, the alert is presented */
    $("#nav-menu-link, #nav-orders-link").click(() => {

        if (!activeToken) {

            //Message
            alert("You have to be logged in to access this");

            //Block href
            return false;

        }
    });


});
