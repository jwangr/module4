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
    let cartTotal = 0;
    cartitems.forEach(element => {
        showCartItems(element);
        cartTotal += element.price;
    });
    console.log(cartitems.length);
    document.querySelectorAll('.cartitemslength').forEach(element => element.innerText = cartitems.length);
    document.getElementById('cartTotal').innerText = cartTotal.toFixed(2);
}

async function displayProducts(product) {
    let template = document.getElementById("card-template").content.cloneNode(true);
    template.querySelector('.card-title').innerText = product.title;
    template.querySelector('.card-price').innerText = `$ ` + product.price;
    template.querySelector('.card-category').innerText = product.category.toUpperCase();
    template.querySelector('.image').style.backgroundImage = `url(${product.image})`;

    // change button display, if product is in db databse
    const checkInCart = await db.get(product.id);
    const cartButton = template.querySelector('a');
    if (checkInCart) {
        cartButton.classList.remove('btn-outline-success');
        cartButton.classList.add('btn-success');
        cartButton.innerText = "In Cart"
    }
    else {
        cartButton.classList.add('btn-outline-success');
        cartButton.classList.remove('btn-success');
        cartButton.innerText = "Add to Cart"
    }
    

    const container = document.getElementById("productspanel");
    container.appendChild(template);
    // Grab the last inserted card and attach event
    const lastCard = container.lastElementChild;
    lastCard.querySelector('a').addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("Picked up click");
        try {
            await db.add(product);
            window.location.reload();
        }
        catch (err) { console.log("Item not added again") };
    })
}

function showCartItems(product) {
    let template = document.getElementById("cart-items").content.cloneNode(true);
    template.querySelector('.card-title').innerText = product.title;
    template.querySelector('.card-price').innerText = `$ ` + product.price;

    const container = document.getElementById("shopping-card-list");
    container.appendChild(template);

    const lastItem = container.lastElementChild;
    lastItem.querySelector('button').addEventListener("click", async () => {
        try {
            await db.delete(product.id);
            window.location.reload();
        }
        catch (err) { console.err("Could not remove item") }
    })
}