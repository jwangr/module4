const db = new IndexedDBHelper('MyDB', 'Users');


window.onload = async () => {
    await db.init(); // optional: (keyPath, autoIncrement)
    const productsDao = new ProductsDao();
    try {
        const products = await productsDao.getProducts(3);
        console.log(products);
        products.forEach(element => {
            displayProducts(element);
        });
    }
    catch (error) {
        console.log(error)
    }
    const cartitems = await db.getAll();
    console.log(cartitems);
}

function displayProducts(product) {
    let template = document.getElementById("card-template").content.cloneNode(true);
    template.querySelector('.card-title').innerText = product.title;
    template.querySelector('.card-price').innerText = `$ ` + product.price;
    template.querySelector('.card-category').innerText = product.category.toUpperCase();
    template.querySelector('.image').style.backgroundImage = `url(${product.image})`;

    document.getElementById("productspanel").appendChild(template);
}