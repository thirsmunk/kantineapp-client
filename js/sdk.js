const SDK = {
    serverURL: "http://localhost:8080/",
    request: (options, callback) => {

        //Retrieves the token from localStorage - initially (during login) it's empty
        //But after successful login the token value will be saved in localStorage and used for each request
        let token = localStorage.getItem('token');

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            //The headers are retrieved by the above loop
            headers: {
                token: token
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            //xhr is the response from the server (XML HTTP Request)
            success: (data, status, xhr) => {
                //null because callback objects always have an error as first parameters, if it has something in its value there is an error, if
                //its null its succesful
                callback(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                callback({xhr: xhr, status: status, error: errorThrown});
            }

        });

    },

    Staff: {
        findAll: (callback) => {
            let token = localStorage.getItem('token');
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
                    username: SDK.Encryption.encryptDecrypt(username),
                    password: SDK.Encryption.encryptDecrypt(password)
                },
                method: "POST",
                url: "/login",
            }, (err, data) => {

                //If login fails
                if (err) return callback(err);

                //Else... add from jespers... spørg
                //Does the token have to be decrypted? no? Hvordan kan vi være sikre på at vi trækker token ud?
                SDK.Storage.persist("token", data.token);
                callback(null, data);
            });
        },

        logOut: (callback) => {
            SDK.request({
                method: "POST",
                url: "/logout",
            }, callback)
        }
    },

    //From jespers code
    Storage: {
        prefix: "KantineAppSDK",
        persist: (key, value) => {
            //Hvis value er et objekt bliver det lavet til JSON for at kunne gemmes som en "streng", ellers bliver det gemt som dets nuværende value
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value == 'object') ? JSON.stringify(value) : value)
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
            <li><a href="my-page.html">Your orders</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
                } else {
                    $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
                }
                $("#logout-link").click(() => SDK.User.logOut());
                cb && cb();
            });
        }
    }
};