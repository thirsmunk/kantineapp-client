$(document).ready(() => {

    //Loads the navbar
    SDK.User.loadNav();

    const $menuList = $("#menu-list");

    //Vores callback er hvad der køres, når vi har fået dataene, og er i dette tilfælde en funktion der kører fra linje 10
    //Vi vælger selv vores argumenter i cb, se sdk.js, vi kunne have valgt mange flere
    SDK.User.findAll((err, items) => {

        //En metode bliver kaldt hver gang der itereres
        items.forEach((item) => {

            //Bruger man nullermanden på linje 15 og 47 behøver man ikke at bruge concatenation => her laver man en string på
            //Flere linjer = breaks er ikke nødvendigt og man kan bruge javascript mellem næbene uden problemer
            const shopHtml = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${item.itemName}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-4">
                        <img src="${item.imgUrl}"/>
                    </div>
                    <div class="col-lg-8">
                      <dl>
                        <dt>Description</dt>
                        <dd>${item.itemDescription}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4 price-label">
                            <p>Kr. <span class="price-amount">${item.itemPrice}</span></p>
                        </div>
                        <div class="col-lg-8 text-right">
                        <!-- Alt der sættes efter data kan man selv bestemme, for at lave et variabelnavn -->
                            <button class="btn btn-success purchase-button" data-book-id="${book.id}">Add to basket</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

            $menuList.append(shopHtml);

        });

        /* MANGLER AT KORRIGERES TIL KANTINE

        //Refererer præcis den knap der bliver trykket på, og gemmer id i bookId. Man bruger
        //ikke fat arrow, fordi this-binding ellers ændres. Scopet vil gå helt ud til Window i stedet for blot klassen purchase-button
        $(".purchase-button").click(function() {
            $("#purchase-modal").modal("toggle");
            const bookId = $(this).data("book-id");

            //Iterér igennem array books og callback funktion med parameter book, kald tilbage når den har fundet den bog
            //hvor boget i arrayet er lig den der blev klikket på --> retunér hele bog objektet
            const book = books.find((book) => book.id === bookId);
            SDK.Book.addToBasket(book);
        });

         */

    });

    /*

    $("#purchase-modal").on("shown.bs.modal", () => {
        const basket = SDK.Storage.load("basket");
        const $modalTbody = $("#modal-tbody");
        basket.forEach((entry) => {
            $modalTbody.append(`
        <tr>
            <td>
                <img src="${entry.book.imgUrl}" height="60"/>
            </td>
            <td>${entry.book.title}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.book.price}</td>
            <td>kr. 0</td>
        </tr>
      `);
        })
    });

    */




});