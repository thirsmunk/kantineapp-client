const SDK = {
    serverURL: "",
    request: (options, callback) => {

        //Retrieves the token from localStorage - initially (during login) it's empty
        //But after succesful login the token value will be saved in localStorage and used for each request
    let token = localStorage.getItem('token');

        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            //The headers are retrieved by the above loop
            headers: {
                token: token,
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
                    username: username,
                    password: password
                },
                method: "POST",
                url: "/login",
            }, (err, data) => {

                //If login fails
                if(err) return cb(err);

                //Else

            })
        },

        logOut: (callback) => {
            SDK.request({
                method: "POST",
                url: "/logout",
            }, callback)
        }
    },

    Storage: {
        prefix: "KantineAppSDK",
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value == 'object') ? JSON.stringify(value) : value)
        },
    }


}