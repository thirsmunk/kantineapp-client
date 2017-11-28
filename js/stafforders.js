$(document).ready(() => {

    //Loads the navbar
    SDK.Navigation.loadNav();


    SDK.Staff.findAll((err, orders) => {

        if (err) {
            alert("Something went wrong!");
            console.log(err);
        }

        if (orders.length == 0) {
            alert("No orders to be found");
            window.location.href = "index.html";
            return;
        }


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