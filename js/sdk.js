/* Jespers overordnede framework er brugt fra https://github.com/Distribuerede-Systemer-2017/javascript-client med direkte kopiering af enkelte metoder */
const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, callback) => {

        //Array of headers
        let headers = {};

        //If the call contains one or more headers it will loop through
        if (options.headers) {
            //Iterate through the headers array
            //Fill out the headers array with the options.headers objects. Using the ternary operator, if the type of options.headers[h] = 'object'
            //stringify the header and transfer it into the headers array at [h] index, else transfer the options.headers value
            Object.keys(options.headers).forEach(function (h) {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            //The headers are retrieved by the above loop
            headers: headers,
            //What the server sends
            contentType: "application/json",
            //What the client receives
            dataType: "text",
            //Encrypt sent data
            data: SDK.Encryption.encryptDecrypt(JSON.stringify(options.data)),
            //xhr is the response from the server (XML HTTP Request)
            success: (data, status, xhr) => {
                //null because callback objects always have an error as first parameters, if it has something in its value there is an error, if
                //its null its successful
                //Decrypt received data
                callback(null, JSON.parse(SDK.Encryption.encryptDecrypt(data)), status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                callback({xhr: xhr, status: status, error: errorThrown});
            }
        });

    },

    Staff: {
        findAll: (callback) => {
            SDK.request({
                method: "GET",
                url: "/staff/getOrders/",
                headers: {
                    authorization: "Bearer " + SDK.Storage.load("token")
                }
            }, callback);
        },

        makeReady: (order_id, callback) => {
            SDK.request({
                method: "POST",
                url: "/staff/makeReady/" + order_id,
                headers: {
                    authorization: "Bearer " + SDK.Storage.load("token")
                }
            }, (err) => {

                if(err) {
                    return callback(err);
                }

                callback(null);
            });
        }
    },

    User: {
        createOrder: (user_id, items, callback) => {
            SDK.request({
                method: "POST",
                url: "/user/createOrder",
                headers: {
                    authorization: "Bearer " + SDK.Storage.load("token")
                },
                data: {
                    user_id: user_id,
                    items: items
                }
            }, (err) => {

                //If creating fails
                if (err) {
                    return callback(err);
                }

                callback(null);


            });
        },

        myOrder: (callback) => {
            SDK.request({
                method: "GET",
                url: "/user/getOrdersById/" + SDK.Storage.load("user_id"),
                headers: {
                    authorization: "Bearer " + SDK.Storage.load("token")
                }
            }, (err, data) => {

                if (err) {

                    return callback(err);
                }

                callback(null, data);
            })
        },

        findAll: (callback) => {
            SDK.request({
                method: "GET",
                url: "/user/getItems/",
                headers: {
                    authorization: "Bearer " + SDK.Storage.load("token")
                }
            }, (err, data) => {

                if (err) {
                    return callback(err);
                }

                callback(null, data);
            })
        },

        createUser: (username, password, callback) => {
            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                method: "POST",
                url: "/user/createUser",
            }, (err) => {

                //If creation fails
                if (err) {
                    return callback(err);
                }

                //success
                callback(null);
            })


        },

        addToBasket: (item) => {
            let basket = SDK.Storage.load("basket");

            //Has anything been added to the basket before?
            if (!basket) {
                return SDK.Storage.persist("basket", [{
                    count: 1,
                    item: item
                }]);
            }

            //Does the item already exist?
            let foundItem = basket.find(b => b.item.itemId === item.itemId);
            if (foundItem) {
                let i = basket.indexOf(foundItem);
                basket[i].count++;
            } else {
                basket.push({
                    count: 1,
                    item: item
                });
            }

            SDK.Storage.persist("basket", basket);
        }

    },

    LogInOut: {
        logIn: (username, password, callback) => {
            SDK.request({
                data: {
                    username: username,
                    password: password
                },
                method: "POST",
                url: "/start/login",
            }, (err, data) => {

                //If login fails
                if (err) {
                    return callback(err);
                }

                //Values to be saved
                SDK.Storage.persist("user_id", data.user_id);
                SDK.Storage.persist("username", data.username);
                SDK.Storage.persist("token", data.token);
                SDK.Storage.persist("isStaff", data.isPersonel);

                callback(null);


            });
        },

        logOut: () => {

            SDK.request({
                data: {
                    user_id: SDK.Storage.load("user_id")
                },
                method: "POST",
                url: "/start/logout",
                headers: {
                    authorization: "Bearer " + SDK.Storage.load("token")
                }
            }, (err, callback) => {

                //If logout fails (cant remove token from server)
                if (err) {
                    return callback(err);
                }

                //Else
                //Remove logged in information
                SDK.Storage.remove("user_id");
                SDK.Storage.remove("username");
                SDK.Storage.remove("token");
                SDK.Storage.remove("isStaff");
                SDK.Storage.remove("basket");

                //Redirect to index.html
                window.location.href = "index.html";

            });
        }
    },

    //From Jespers code
    Storage: {
        prefix: "KantineAppSDK",
        persist: (key, value) => {
            //Hvis value er et objekt bliver det lavet til JSON for at kunne gemmes som en "streng", ellers bliver det gemt som dets nuværende value
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value == 'object') ? JSON.stringify(value) : value);
        },
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    },

    Encryption: {

        /** Method from https://github.com/KyleBanks/XOREncryption/blob/master/JavaScript/XOREncryption.js
         * Changed the key to corresponding cipher in our server (Y O L O)
         * @param input
         * @returns {string}
         */
        encryptDecrypt(input) {

            //Only encrypts/decrypts if data is sent or received
            if (input != undefined) {
                var key = ['Y', 'O', 'L', 'O']; //Can be any chars, and any size array
                var output = [];

                for (var i = 0; i < input.length; i++) {
                    var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
                    output.push(String.fromCharCode(charCode));
                }

                return output.join("");

            } else {

                return input;

            }

        }


    },

    Navigation: {
        //Fra Jespers eksempel -- loads NavBar and all the logic for the two additional top menu bars
        loadNav: (cb) => {
            //Loads the nav bar
            $("#nav-container").load("nav.html", () => {
                const activeToken = SDK.Storage.load("token");
                const isStaff = SDK.Storage.load("isStaff");
                //If user is logged in
                if (activeToken && !isStaff) {
                    $(".navbar-right").html(`
            <li><a href="#" id="view-basket-link"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> View Basket</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
                    //If staff is logged in
                } else if (activeToken && isStaff) {

                    //Remove the menu link
                    $("#nav-menu-link").remove();

                    //Remove the My Orders link
                    $("#nav-orders-link").remove();

                    //Insert View All Orders link
                    $(".navbar-nav").html(`
            <li><a href="stafforders.html" id="view-all-orders">View all orders</a></li>
          `);

                    $(".navbar-right").html(`
            <li><a href="#" id="logout-link">Logout</a></li>
          `);

                } else {

                    $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
                }

                //If logout is clicked, run the logout function
                $("#logout-link").click(() => SDK.LogInOut.logOut());
                cb && cb();

                $("#view-basket-link").click(() => {
                    //Show the "basket"
                    $("#purchase-modal").modal("toggle");
                });

                //Fill the basket with the localStorage data
                $("#purchase-modal").on("shown.bs.modal", () => {
                    const basket = SDK.Storage.load("basket");

                    //If no items are in the basket, present this message and return
                    if (!basket) {
                        alert("You have to add items to your basket first!");
                        $("#purchase-modal").modal("toggle");
                        return;
                    }

                    const $modalTbody = $("#modal-tbody");
                    let $sum = 0;
                    basket.forEach((entry) => {

                        $sum += entry.item.itemPrice;

                        $modalTbody.append(`
         <tr>
             <td>Picture to be added</td>
             <td>${entry.item.itemName}</td>
             <td>${entry.count}</td>
             <td>kr. ${entry.item.itemPrice}</td>
         </tr>
       `);

                    });

                    $modalTbody.append(`
         <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>Total: kr. ${$sum}</strong></td>
        `);
                });

                //Delete the basket contents shown after hiding it, to avoid duplicate
                $("#purchase-modal").on("hidden.bs.modal", () => {
                    $("#modal-tbody").children("tr").remove();
                })


            });
        }
    },
};