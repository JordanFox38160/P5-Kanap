//REDIRECTION SUR LA PAGE DU PRODUIT SELON L'ID
const queryStringUrl = window.location.search;

const searchParams = new URLSearchParams(queryStringUrl);

const productID = searchParams.get("id");

//APPEL D'API POUR LA RECUPERATION DES PRODUITS SELON LEURS ID
fetch('http://localhost:3000/api/products/' + productID)
    .then(response => {
        if (response.ok) {
            return response.json();
        }

        throw new Error("Désolé, mais ce produit n'existe pas.");
    })

    .then(product => {

        const item = document.querySelector('.item__img');
        let img = document.createElement('img');
        item.appendChild(img);

        let titleProduct = document.querySelector('title');
        let priceProduct = document.querySelector('price');

        const description = document.querySelector('.item__content__description');
        let descriptionSelect = document.querySelector('#description');
        description.innerHTML = product.description;

        const colors = product.colors;

        img.src = product.imageUrl;
        price.innerText = product.price;
        title.innerText = product.name;

        for (let color of colors) {
            let option = document.createElement("option");
            option.value = color;
            option.innerText = color;
            document.getElementById("colors").appendChild(option);

        }

        //----------------AJOUT AU PANIER----------------//

        //FONCTION POUR L'AJOUT DES PRODUIT AU PANIER
        const addProductToCart = (cart, product) => {
            //On test si le produit existe dejà
            const productCartKey = product.id + product.color;
            let quantity = document.getElementById("quantity").value - 0; // -0 Pareil que parseInt, il va forcer pour passer en string
            let colorProduct = product.color;
            let containerpage = document.querySelector('.limitedWidthBlockContainer');

            if (colorProduct == "") {
                //Création des variables pour la création du message des couleurs
                let containermessage = document.createElement('div');
                containerpage.appendChild(containermessage);
                containermessage.style.width = '100%';
                containermessage.style.height = 'auto';
                containermessage.style.backgroundColor = "#3D424F";
                containermessage.style.position = "absolute";
                containermessage.style.marginTop = "1515px";
                containermessage.style.textAlign = "center";
                containermessage.style.paddingTop = "7rem";
                containermessage.style.paddingBottom = "7rem";
                containermessage.style.fontSize = "25px";
                containermessage.style.fontWeight = "bold";
                containermessage.innerText = "Veuillez choisir une couleur";
                setTimeout(()=>{containermessage.remove()}, 3000);
                return;
            }

            if (quantity == "") {
                //Création des variables pour la création du message des quantités
                let containerMessageForQuantity = document.createElement('div');
                containerpage.appendChild(containerMessageForQuantity);
                containerMessageForQuantity.style.width = '100%';
                containerMessageForQuantity.style.height = 'auto';
                containerMessageForQuantity.style.backgroundColor = "#3D424F";
                containerMessageForQuantity.style.position = "absolute";
                containerMessageForQuantity.style.marginTop = "1515px";
                containerMessageForQuantity.style.textAlign = "center";
                containerMessageForQuantity.style.paddingTop = "7rem";
                containerMessageForQuantity.style.paddingBottom = "7rem";
                containerMessageForQuantity.style.fontSize = "25px";
                containerMessageForQuantity.style.fontWeight = "bold";
                containerMessageForQuantity.innerText = "Veuillez ajouter une quantité";
                setTimeout(()=>{containerMessageForQuantity.remove()}, 3000);
                return;
            }

            if (colorProduct && quantity) {
                let containerMessageForAddToCart = document.createElement('div');
                containerpage.appendChild(containerMessageForAddToCart);
                containerMessageForAddToCart.style.width = '100%';
                containerMessageForAddToCart.style.height = 'auto';
                containerMessageForAddToCart.style.backgroundColor = "#3D424F";
                containerMessageForAddToCart.style.position = "absolute";
                containerMessageForAddToCart.style.marginTop = "1515px";
                containerMessageForAddToCart.style.textAlign = "center";
                containerMessageForAddToCart.style.paddingTop = "7rem";
                containerMessageForAddToCart.style.paddingBottom = "7rem";
                containerMessageForAddToCart.style.fontSize = "25px";
                containerMessageForAddToCart.style.fontWeight = "bold";
                containerMessageForAddToCart.innerText = "Produit ajouter au panier !";
                setTimeout(()=>{containerMessageForAddToCart.remove()}, 3000);
            }

            //Test si le produit existe
            if (cart[productCartKey]) {
                //Si plus de 100 articles ajouté au panier
                if (cart[productCartKey].quantity + quantity > 100) {
                    alert("Limite d'article atteinte");
                    //Création des variables pour la création du message des couleurs
                    return;
                } else {
                    manageQuantity(cart, productCartKey, parseInt(cart[productCartKey].quantity) + parseInt(quantity));
                }

                //Sinon si moins de 100 article, on ajoute le produit au panier
            } else {
                if (quantity > 100) {
                    alert("Limite d'article atteinte");
                    return;
                } else {
                    cart[productCartKey] = product;
                    saveCart(cart);
                }
            }
        }

        // Récupération des données selectionné par l'utilisateur //
        let colorSelect = document.querySelector("#colors");

        // Selection de la quantité du formulaire
        const quantityObject = document.getElementById('quantity');

        //Selection du bouton "Ajouter au panier"
        const button = document.getElementById("addToCart");

        //Envoyer le panier
        button.addEventListener("click", (event) => {
            event.preventDefault();

            //Récupération valeur du formulaire
            const dataProduct = {
                id: product._id,
                title: product.name,
                color: colorSelect.value,
                quantity: quantityObject.value - 0,
                imageUrl: product.imageUrl,
            }

            const cart = getCart();
            addProductToCart(cart, dataProduct);
        });
    })
    .catch(error => {
        alert("Désolé, mais ce produit n'existe pas.")
   });