// RECUPERATION DU LOCALSTORAGE
let cart = getCart();

//SI LE PANIER EST VIDE MESSAGE PANIER VIDE + QUANTITE + PRIX A ZERO
if (!Object.keys(cart).length) {
    let containerForm = document.querySelector('h1');
    containerForm.innerText = 'Votre panier est vide';

    let cartOrder = document.querySelector('.cart__order');
    cartOrder.style.visibility = "hidden"
    cartOrder.style.height = "auto"

    let totalQuantity0 = document.querySelector('#totalQuantity');
    totalQuantity0.innerText = '0'

    let totalPrice0 = document.querySelector('#totalPrice');
    totalPrice0.innerText = '0'

    let containerCart = document.querySelector('.cart');
    containerCart.style.height = "260px";
} else {


    //FONCTION REDUCE POUR LE TOTAL DES ARTICLES
    //On crée un tableau vide
    let array = [];

    //On crée une boucle pour push dans le tableau vide
    for (const kanap in cart) {
        const productKanap = cart[kanap]
        array.push(productKanap);
    }
    //On crée une const reducerproductKey
    const reducer = (total, value) => {
        return total + value.quantity
    }

    //On utilise reduce pour accumuler toutes les quantité
    let totalQuantityReduce = array.reduce(reducer, 0);

    //VARIABLE POUR LE TOTAL DU PRIX
    let prixtotal = 0;

    //BOUCLE POUR L'AFFICHAGE DES PRODUITS SUR LA PAGE PANIER
    for (const kanap in cart) {
        const productInStorage = cart[kanap];
        let productIDinStorage = productInStorage.id;

        fetch('http://localhost:3000/api/products/' + productInStorage.id)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error('Impossible de charger les données du produit');
            })

            .then(product => {
                /*SELECT CONTAINER */
                const section = document.getElementById('cart__items');
                //

                /*Image*/
                const article = document.createElement('article');
                article.dataset.id = productInStorage.id;
                article.dataset.color = productInStorage.color;
                article.classList.add('cart__item');
                let vignettes = document.querySelectorAll(".cart__item");

                const cartItemImg = document.createElement('div');
                cartItemImg.classList.add('cart__item__img');

                const img = document.createElement('img');
                //

                /*Description produits*/
                const cartItemContent = document.createElement('div');
                cartItemContent.classList.add('cart__item__content');

                const cartItemContentDescription = document.createElement('div');

                const h2 = document.createElement('h2');

                const colorProduct = document.createElement('p');

                const priceProduct = document.createElement('p');

                priceProduct.innerText = product.price + "€";

                const carItemContentSetting = document.createElement('div');
                carItemContentSetting.classList.add('cart__item__content__settings');

                const cartItemContentSettingQuantity = document.createElement('div');
                cartItemContentSettingQuantity.classList.add('cart__item__content__settings__quantity');

                const cartItemContentSettingDelete = document.createElement('div');
                cartItemContentSettingQuantity.classList.add('cart__item__content__settings__delete');

                // TOTAL ARTICLES //
                let targetQuantity = document.querySelectorAll(".itemQuantity");
                const totalArticle = document.getElementById('totalQuantity');
                totalArticle.innerText = totalQuantityReduce;

                //TOTAL PRICE //
                let priceUnit = product.price;
                let productTotalInLine = priceUnit * productInStorage.quantity;
                prixtotal += priceUnit * productInStorage.quantity;

                let priceTotal = document.querySelector('#totalPrice');
                priceTotal.innerText = prixtotal;

                //SUPPRESSION DES ARTICLES QUAND ON APPUIE SUR LE BOUTON SUPPRIMER
                let deleteItem = document.createElement('p');
                deleteItem.innerText = "Supprimer";
                deleteItem.style.cursor = "pointer";
                deleteItem.classList.add('deleteItem');

                deleteItem.addEventListener("click", (e) => {
                    let cardItem = e.currentTarget.closest(".cart__item");
                    let cardId = cardItem.dataset.id;
                    let cardColor = cardItem.dataset.color;
                    cardItem.remove();
                    delete cart[cardId + cardColor];
                    saveCart(cart);
                    window.location.reload();
                })

                const quantityp = document.createElement('p');
                quantityp.textContent = 'Qté :';

                const itemQuantity = document.createElement('input');
                itemQuantity.classList.add('quantity');
                let inputValue = document.querySelector('input').value;
                itemQuantity.type = 'number';
                itemQuantity.max = 100;
                itemQuantity.min = 1;
                itemQuantity.value = productInStorage.quantity;
                itemQuantity.defaultValue = productInStorage.quantity;

                itemQuantity.addEventListener("change", (e) => {
                    let cardItem = e.currentTarget.closest(".cart__item");
                    let dataId = cardItem.dataset.id;
                    let dataColor = cardItem.dataset.color;
                    //ON INTEROGE L'API POUR RECUPERER LE PRIX UNITAIRE DU PRODUIT MODIFIER
                    fetch('http://localhost:3000/api/products/' + dataId)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }

                            throw new Error('Impossible de charger les données du produit');
                        })

                        .then(product => {
                            //CALCUL DE LA QUANTITE
                            let priceTotal = document.querySelector('#totalPrice');
                            let quantityInital = e.target.defaultValue;
                            let newQuantity = parseInt(e.target.value);
                            let modifier = newQuantity - quantityInital;
                            let newTotalPrice = parseInt(priceTotal.innerText) + modifier * product.price;
                            e.target.defaultValue = newQuantity;
                            priceTotal.innerText = newTotalPrice;
                            const totalArticle = document.getElementById('totalQuantity');
                            totalArticle.innerText = parseInt(totalArticle.innerText) + modifier;

                            //ON AJOUTE LA NOUVELLE QUANTITY DANS LE LOCALSTORAGE
                            cart[dataId + dataColor].quantity = parseInt(newQuantity);
                            saveCart(cart)
                        }
                        )
                })

                section.appendChild(article);
                article.appendChild(cartItemImg);
                cartItemImg.appendChild(img);

                article.appendChild(cartItemContent);
                cartItemContent.appendChild(cartItemContentDescription);
                cartItemContentDescription.appendChild(h2);
                cartItemContentDescription.appendChild(colorProduct);
                cartItemContentDescription.appendChild(priceProduct);


                article.appendChild(carItemContentSetting);
                carItemContentSetting.appendChild(cartItemContentSettingQuantity);
                carItemContentSetting.appendChild(quantityp);
                carItemContentSetting.appendChild(itemQuantity);
                carItemContentSetting.appendChild(cartItemContentSettingDelete);
                cartItemContentSettingDelete.appendChild(deleteItem);

                img.src = productInStorage.imageUrl;
                h2.innerText = productInStorage.title;
                colorProduct.innerText = productInStorage.color;
            })
    }


    // ******************************* FORMULAIRE *******************************
    let FirstForm = document.getElementById("firstName");
    let LastForm = document.getElementById("lastName");
    let AdressForm = document.getElementById("address");
    let CityForm = document.getElementById("city");
    let MailForm = document.getElementById("email");
    let ValidForm = document.getElementById("order");
    let formulaire = document.querySelector(".cart__order__form");


    // ************** PRENOM **************

    formulaire.firstName.addEventListener('change', function () {
        validfirstName(this);
    })

    //FUNCTION POUR CONTROLER LA VALIDATION VIA REGEXP DE LA SAISIE RENTREE
    const validfirstName = (inputFirstname) => {
        //Creation de la reg exp pour la validation du firstname
        let firstNameRegExp = new RegExp('^[a-zA-Z-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s -]*$', 'g');

        let testfirstname = firstNameRegExp.test(inputFirstname.value);

        let errorMessage = inputFirstname.nextElementSibling;

        if (testfirstname == true) {
            FirstForm.style.boxShadow = '0px 0px 10px green';
            FirstForm.style.border = '1px solid green';
            FirstForm.style.boxSizing = 'border-box';

        } else {
            errorMessage.innerText = 'Veuillez saisir un prénom valide.';
            setTimeout(()=>{errorMessage.remove()}, 3000);
            FirstForm.style.boxShadow = '0px 0px 10px red';
            FirstForm.style.border = '1px solid red';
            FirstForm.style.boxSizing = 'border-box';
        }
    };

    // ************** NOM **************

    formulaire.lastName.addEventListener('change', function () {
        validLastName(this);
    })

    //FUNCTION POUR CONTROLER LA VALIDATION VIA REGEXP DE LA SAISIE RENTREE
    const validLastName = (inputLastname) => {
        //Creation de la reg exp pour la validation du inputLastName
        let lastNameRegExp = new RegExp('^[a-zA-Z-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s -]*$', 'g');

        let testNameRegExp = lastNameRegExp.test(inputLastname.value);

        let errorMessage = inputLastname.nextElementSibling;

        if (testNameRegExp == true) {
            LastForm.style.boxShadow = '0px 0px 10px green';
            LastForm.style.border = '1px solid green';
            LastForm.style.boxSizing = 'border-box';

        } else {
            errorMessage.innerText = 'Veuillez saisir un nom valide.';
            setTimeout(()=>{errorMessage.remove()}, 3000);
            LastForm.style.boxShadow = '0px 0px 10px red';
            LastForm.style.border = '1px solid red';
            LastForm.style.boxSizing = 'border-box';
        }
    };


    // ************** ADRESSE **************

    formulaire.address.addEventListener('change', function () {
        validAdress(this);
    })

    //FUNCTION POUR CONTROLER LA VALIDATION VIA REGEXP DE LA SAISIE RENTREE
    const validAdress = (inputAdress) => {
        //Creation de la reg exp pour la validation du firstname
        let AdressRegExp = new RegExp('^[ a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s -]*$', 'g');

        let testAdressRegExp = AdressRegExp.test(inputAdress.value);

        let errorMessage = inputAdress.nextElementSibling;

        if (testAdressRegExp == true) {
            AdressForm.style.boxShadow = '0px 0px 10px green';
            AdressForm.style.border = '1px solid green';
            AdressForm.style.boxSizing = 'border-box';

        } else {
            errorMessage.innerText = 'Veuillez saisir une adresse valide.';
            setTimeout(()=>{errorMessage.remove()}, 3000);
            AdressForm.style.boxShadow = '0px 0px 10px red';
            AdressForm.style.border = '1px solid red';
            AdressForm.style.boxSizing = 'border-box';
        }
    };

    // ************** VILLE **************

    formulaire.city.addEventListener('change', function () {
        validCity(this);
    })

    //FUNCTION POUR CONTROLER LA VALIDATION VIA REGEXP DE LA SAISIE RENTREE
    const validCity = (inputCity) => {
        //Creation de la reg exp pour la validation du firstname
        let CityRegExp = new RegExp('^[ a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s -]*$', 'g');

        let testCityRegExp = CityRegExp.test(inputCity.value);

        let errorMessage = inputCity.nextElementSibling;

        if (testCityRegExp == true) {
            CityForm.style.boxShadow = '0px 0px 10px green';
            CityForm.style.border = '1px solid green';
            CityForm.style.boxSizing = 'border-box';

        } else {
            errorMessage.innerText = `"${inputCity.value} n'est pas une ville valide."`;
            setTimeout(()=>{errorMessage.remove()}, 3000);
            CityForm.style.boxShadow = '0px 0px 10px red';
            CityForm.style.border = '1px solid red';
            CityForm.style.boxSizing = 'border-box';
        }
    };


    // ************** EMAIL **************

    formulaire.email.addEventListener('change', function () {
        validMailForm(this);
    })

    //FUNCTION POUR CONTROLER LA VALIDATION VIA REGEXP DE LA SAISIE RENTREE
    const validMailForm = (inputMailForm) => {
        //Creation de la reg exp pour la validation du firstname
        let MailFormRegExp = new RegExp('^[a-zA-Z0-9ôöáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');

        let testMailRegExp = MailFormRegExp.test(inputMailForm.value);

        let errorMessage = inputMailForm.nextElementSibling;

        if (testMailRegExp == true) {
            MailForm.style.boxShadow = '0px 0px 10px green';
            MailForm.style.border = '1px solid green';
            MailForm.style.boxSizing = 'border-box';

        } else {
            errorMessage.innerText = `"${inputMailForm.value} n'est pas une adresse mail valide.`;
            setTimeout(()=>{errorMessage.remove()}, 3000);
            MailForm.style.boxShadow = '0px 0px 10px red';
            MailForm.style.border = '1px solid red';
            MailForm.style.boxSizing = 'border-box';
        }


        // ************** OrderId **************

        let submitBtn = document.getElementById('order');
        submitBtn.addEventListener("click", function (e) {
            e.preventDefault();

            let idProducts = []
            for (let i = 0; i < array.length; i++) {
                idProducts.push(array[i].id);
            }
            const orderId = {
                contact: {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    address: AdressForm.value,
                    city: CityForm.value,
                    email: MailForm.value,
                },
                products: idProducts,
            };


            const option = {
                method: 'POST',
                body: JSON.stringify(orderId),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            };
            fetch(`http://localhost:3000/api/products/order`, option)
                .then((reponse) => reponse.json())
                .then((data) => {
                    localStorage.clear();
                    localStorage.setItem('orderId', data.orderId);

                    window.location.href = 'confirmation.html';
                })
                .catch((err) => {
                    alert("Problème fetch :" + err.message);
                });

            return false;
        });
    }
}


