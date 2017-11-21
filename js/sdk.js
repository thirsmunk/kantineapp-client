const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, callback) => {

        //Array of headers
        let headers = {};

        //If the call contains headers (Authentication or CORS)
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
                callback(null, SDK.Encryption.encryptDecrypt(data), status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                callback({xhr: xhr, status: status, error: errorThrown});
            }
        });

    },

    Staff: {
        findAll: (callback) => {
            //Debugging   let token = localStorage.getItem('token');
            SDK.request({
                method: "GET",
                url: "/staff/getOrders/",
            }, callback);
        },

        makeReady: (callback) => {
            SDK.request({
                method: "POST",
                url: "/staff/" + "", //orderid
            }, callback);
        }
    },

    User: {
        createOrder: (callback) => {
            SDK.request({
                method: "POST",
                url: "/user/createOrder",
            }, callback);
        },

        myOrder: (callback) => {
            SDK.request({
                method: "GET",
                url: "/user/getOrdersById/" + "", //orderID
            }, callback)
        },

        findAll: (callback) => {
            SDK.request({
                method: "GET",
                url: "/user/getItems/",
            }, callback)
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

                //Somehow works, parses the data into a JavaScript object
                var response = JSON.parse(data);

                //Values to be saved
                SDK.Storage.persist("user_id", response.user_id);
                SDK.Storage.persist("username", response.username);
                SDK.Storage.persist("token", response.token);
                SDK.Storage.persist("isStaff", response.isPersonel);

                callback(null, data);


            });
        },

        logOut: (userid) => {

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
            var key = ['Y', 'O', 'L', 'O']; //Can be any chars, and any size array
            var output = [];

            for (var i = 0; i < input.length; i++) {
                var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
                output.push(String.fromCharCode(charCode));
            }

            return output.join("");
        }


    },

    Navigation: {
        //Fra Jespers eksempel
        loadNav: (cb) => {
            //Loads the nav bar
            $("#nav-container").load("nav.html", () => {
                //Retrieves the user object from our storage REVISE REVISE REVISE, SPØRG OM TOKEN OK
                //   const currentUser = SDK.User.current();
                const activeToken = SDK.Storage.load("token");
                if (activeToken) {
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
            });
        }
    }
};