$(document).ready(() => {

    //Load navigation bar and modal logic
    SDK.Navigation.loadNav();


    //Get orders from server
    SDK.User.myOrder((err, orders) => {

        // Check if any orders have been made, if none inform user and go away
        if (err || orders == null) {
            alert("Something went wrong while retrieving orders! Have you made any orders?");
            window.location.href = "menu.html";
            return;
        }

        //Else

        //Fill out the orders table
        const $ordersTbody = $("#orders-tbody");
        orders.forEach((order) => {

            //Reset the items variable for each order
            let $orderItems = [];

            for (let counter = 0; counter < order.items.length; counter++) {

                //Formatting for the table, adding a comma to multiple list elements
                if ($orderItems.length >= 1) {
                    $orderItems += ", " + order.items[counter].itemName;
                }

                else {
                    $orderItems += order.items[counter].itemName;
                }
            }

            //Variable for showing if order has been made ready or not, intially shown as a cross for false
            let $orderReady = '<span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span>';

            if (order.isReady == true) {
                $orderReady = '<span class="glyphicon glyphicon glyphicon-ok" aria-hidden="true"></span>';
            }

            $ordersTbody.append(`
         <tr>
             <td>${order.orderId}</td>
             <td>${order.orderTime}</td>
             <td>${$orderItems}</td>
             <td>${$orderReady}</td>
         </tr>
       `);

        });

    });


});