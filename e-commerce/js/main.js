const db = new IndexedDBHelper('MyDB', 'Users');

window.onload = async () => {
    const productsDao = new ProductsDao();
    await db.init(); // optional: (keyPath, autoIncrement)

    try {
        const products = await productsDao.getProducts();
        console.log(products);
        products.forEach(element => {
            getCategories(element);
            displayProducts(element);
        });
        displayCategories();

        document.getElementById("categorySelection").addEventListener("change", () => {
            let option = document.getElementById("categorySelection").value;
            filterProducts(option);
            console.log(option);
        })
    }
    catch (error) {
        console.log(error)
    }
}

function displayProducts(product) {
    const template = document.getElementById("card-template").content.cloneNode(true);

    template.querySelector('.card-title').innerText = product.title;
    template.querySelector('.card-price').innerText = `$ ${product.price}`;
    template.querySelector('.card-category').innerText = product.category.toUpperCase();
    template.querySelector('.image').style.backgroundImage = `url(${product.image})`;
    const container = document.getElementById("productspanel");
    container.appendChild(template);

    // // Grab the last inserted card and attach event
    const lastCard = container.lastElementChild;
    console.log(lastCard.querySelector('a').textContent);
    lastCard.querySelector('a').addEventListener("click", async() => {
        console.log("Picked up click");
        await db.add(product);
    })
    // lastCard.querySelector('.addCart').addEventListener("click", async () => {
    //     console.log('Picked up anchor');
    //     // await db.add(product);
    // });
}


let categories = new Set();
function getCategories(element) {
    categories.add(element.category);
}

function displayCategories() {
    const categoryList = Array.from(categories).sort();
    // categoryList.map(category => category.slice(0,1).toUpperCase())
    console.log(categoryList);
    const selector = document.getElementById("categorySelection");

    categoryList.forEach(element => {
        const option = document.createElement("option");
        option.value = element;
        option.innerText = element.charAt(0).toUpperCase() + element.slice(1);

        selector.appendChild(option);
    });
}

async function filterProducts(category) {
    document.querySelector("#productspanel").innerHTML = "";
    try {
        const productsDao = new ProductsDao();
        const items = await productsDao.getProducts();
        items.forEach(element => {
            if (element.category == category) { displayProducts(element) };
        });
    }
    catch (error) { console.log(error) };
}


