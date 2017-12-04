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
            var $orderReady = '<span class="glyphicon glyphicon glyphicon-remove" aria-hidden="true"></span>';

            if (order.isReady == true) {
                $orderReady = '<span class="glyphicon glyphicon glyphicon-ok" aria-hidden="true"></span>';
            }

            $ordersTbody.append(`
         <tr>
             <td class="order-id">${order.orderId}</td>
             <td>${order.orderTime}</td>
             <td>${$orderItems}</td>
             <td><button class="staff-make-ready" data-item-id="${order.orderId}" >${$orderReady}</button></td>
         </tr>
       `);

        });

        $(".staff-make-ready").click(function () {

            const orderId = $(this).data("item-id");

            const order = orders.find((order) => order.orderId === orderId);

            //If the order is already set as ready, don't do anything
            if (order.isReady) {
                return;
            }

            const confirmOrder = confirm("Make order with order id: " + order.orderId + " ready?");

            if (confirmOrder) {

                SDK.Staff.makeReady(order.orderId, (err) => {

                    if (err) {
                        alert("Couldn't make order ready");
                        return;
                    }

                    alert("Order made ready!");
                    window.location.reload();

                });
            }
        });


    });


});