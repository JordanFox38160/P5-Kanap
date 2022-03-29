const cartKey = 'cart';

//AJOUTER LE PRODUIT DANS LE LOCALSTORAGE
const getCart = () => {
    //On recupere le contenu de la clé du storage ou est stocké le panier
    let cartParse = JSON.parse(localStorage.getItem(cartKey));
    //si aucun contenu on renvoie une liste vide,
    if (cartParse === null) {
        return {};
        //sinon on renvoie le contenu après formatage
    }
    return cartParse;
}

//SAUVEGARDE DANS LE LOCALSTORAGE
const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

//GESTION DE LA QUANTITE D'UN SEUL PRODUIT
const manageQuantity = (cart, productKey, quantity) => {
    cart[productKey].quantity = quantity;
    saveCart(cart);
}