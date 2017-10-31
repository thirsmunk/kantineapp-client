const SDK = {
    serverURL:  "",
    request: (options, callback) => {

        //Array
        let headers = {};

        //If the object contains headers === true
        if (options.headers) {
            //Iterate through the headers array
            Object.keys(options.headers).forEach((h) => {
                //Fill out the headers array with the options.headers objects. Using the ternary operator, if the type of options.headers[h] = 'object'
                //stringify the header and transfer it into the headers array at [h] index, else transfer the options.headers value
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });

        }

        $.ajax({
           url: SDK.serverURL + options.url,
           method: options.method,
            //The headers are retrieved by the above loop
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            //xhr?
            success: (data, status, xhr) => {
               //why null?
               callback(null, data, status, xhr);
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
            url:"/staff/getOrders/",
            headers: {
             filter: {
                 include: [""]
             }
           }
        }, callback);
    },

    makeReady: (callback) => {
        SDK.request({
            method: "POST",
            url:"/staff/" + "", //orderid
            headers: {
             filter: {
                 include: [""]
             }
            }
        }, callback);
    }
},

User: {
        createOrder: (callback) => {
            SDK.request({
                method: "POST",
                url:"/user/createOrder",
                headers: {
                    filter: {
                        include: [""]
                    }
                }
            }, callback);
        },

        myOrder: (callback) => {
            SDK.request({
                method: "GET",
                url:"/user/getOrdersById/" + "", //orderID
                headers: {
                    filter: {
                        include: [""]
                    }
                }
            }, callback)
        },

        findAll: (callback) => {
            SDK.request({
                method: "GET",
                url: "/user/getItems/",
                headers: {
                    filter: {
                        include: [""]
                    }
                }
            }, callback)
        }


}


}