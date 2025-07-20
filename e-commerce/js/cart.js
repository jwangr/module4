const db = new IndexedDBHelper('MyDB', 'Users');


window.onload = async () => {
    await db.init(); // optional: (keyPath, autoIncrement)

    const cartitems = await db.getAll();
    let cartTotal = 0;
    cartitems.forEach(element => {
        showCartItems(element);
        cartTotal += element.price;
    });
    document.querySelectorAll('.cartitemslength').forEach(element => element.innerText = cartitems.length);
    document.getElementById('cartTotal').innerText = cartTotal;
}

function showCartItems(product) {
    let template = document.getElementById("cart-items").content.cloneNode(true);
    template.querySelector('.card-title').innerText = product.title;
    template.querySelector('.card-price').innerText = `$ ` + product.price;
    template.querySelector('.image').style.backgroundImage = `url(${product.image})`;

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