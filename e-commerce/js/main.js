window.onload = async () => {
    const productsDao = new ProductsDao();
    try {
        const products = await productsDao.getProducts();
        console.log(products);
        products.forEach(element => {
            displayProducts(element);
        });
    }
    catch (error) {
        console.log(error)
    }
}

function displayProducts(product) {
    let template = document.getElementById("card-template").content.cloneNode(true);
    template.querySelector('.card-title').innerText = product.title;
    template.querySelector('.card-price').innerText = `$ ` + product.price;
    template.querySelector('.card-category').innerText = product.category.toUpperCase();
    template.querySelector('.image').style.backgroundImage = `url(${product.image})`;

    document.getElementById("productspanel").appendChild(template);
}