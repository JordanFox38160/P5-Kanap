//APPEL D'API POUR LA RECUPERATION DES PRODUITS
fetch("http://localhost:3000/api/products")
.then(response => {
    if (response.ok) {
        return response.json();
    }

    throw new Error("Impossibler de joindre l'API");
})
.then(value =>{
    //On boucle sur data
    value.forEach(products => {

        //On créé chaques éléments HTML
        const targetContainer = document.getElementById("items");
        const a = document.createElement('a');

        const article = document.createElement('article');
        article.classList.add("productCard");

        const img = document.createElement('img');
        img.classList.add('productImage');

        const h3 = document.createElement('h3');
        h3.classList.add("productName");

        const p = document.createElement('p');
        p.classList.add("productDescription");

        //On imbrique les différent elements entre eux
        a.appendChild(article);
        article.appendChild(img);
        article.appendChild(h3);
        article.appendChild(p);
        targetContainer.appendChild(a);


        a.href = "./product.html?id=" + products._id;
        img.src = products.imageUrl;
        h3.innerText = products.name;
        img.alt = products.altTxt;
        p.innerText = products.description;

    });
})
.catch(e => {
     alert("Impossible de charger les canapés")
});