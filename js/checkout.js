$(document).ready(() => {

    //If the checkout button is clicked, create the order
    //make loop that only sends item objects and not count etc
    $("#checkout-button").click(() => {

        let windowConfirm = confirm("Are you sure you want to create this order?");

        if (windowConfirm) {

            let userId = SDK.Storage.load("user_id");
            let basket = SDK.Storage.load("basket");
            let orderItems = [];

            //Add the basket's item contents into another array to be sent to the server
            //With parameters element, index, array
            basket.forEach((item, i, basket) => {
                orderItems.push(basket[i].item);
            });

            //Send it off!
            SDK.User.createOrder(userId, orderItems, (err, data) => {

                //Do something when it's succesful or error

                if (err && err.xhr.status === 500) {

                    //Something went wrong server side
                    alert("Server error!");

                } else if (err) {

                    alert("Couldn't complete order, please try again");

                } else {

                    //Success
                    SDK.Storage.remove("basket");
                    alert("Order completed!");
                    $("#purchase-modal").modal("toggle");
                    window.location.href = "orders.html";

                }


            });

        }

    });
});