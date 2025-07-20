const db = new IndexedDBHelper('MyDB', 'Users');

document.addEventListener("DOMContentLoaded", async () => {
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

        const cartitems = await db.getAll();
        document.querySelectorAll('.cartitemslength').forEach(element => element.innerText = cartitems.length);


        document.getElementById("categorySelection").addEventListener("change", async () => {
            let option = document.getElementById("categorySelection").value;
            filterCategory(option);
        })

        document.getElementById("SortSelection").addEventListener("change", async () => {
            let option = document.getElementById("SortSelection").value;
            sortProducts(option);
        })
    }
    catch (error) {
        console.log(error)
    }
})

async function displayProducts(product) {
    const template = document.getElementById("card-template").content.cloneNode(true);

    template.querySelector('.card-title').innerText = product.title;
    template.querySelector('.card-price').innerText = `$ ${product.price}`;
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
            cartButton.classList.remove('btn-outline-success');
            cartButton.classList.add('btn-success');
            cartButton.innerText = "In Cart"
        }
        catch (err) { console.log("Item not added again") };
    })
}

let categories = new Set();
function getCategories(element) {
    categories.add(element.category);
}

function displayCategories() {
    const categoryList = Array.from(categories).sort();
    // categoryList.map(category => category.slice(0,1).toUpperCase())
    console.log(categoryList);
    const categorySelections = document.querySelector("#categorySelection");

    categoryList.forEach(element => {
        const option = document.createElement("option");
        option.value = element;
        option.innerText = element.charAt(0).toUpperCase() + element.slice(1);

        categorySelections.appendChild(option);
    });
}

async function filterCategory(category) {
    document.querySelector("#productspanel").innerHTML = "";
    try {
        const productsDao = new ProductsDao();
        const items = await productsDao.getProducts();
        items.forEach(element => {
            if (category == 0) { displayProducts(element) }
            else if (element.category == category) { displayProducts(element) };

        });
    }
    catch (error) { console.log(error) };
}

async function sortProducts(sortby) {
    document.querySelector("#productspanel").innerHTML = "";
    try {
        const productsDao = new ProductsDao();
        const items = await productsDao.getProducts();
        switch (sortby) {
            case 'alphabetical':
                items.sort((prod1, prod2) => prod1.title > prod2.title ? 1 : -1)
                break;
            case 'lowpricefirst':
                items.sort((prod1, prod2) => prod1.price - prod2.price)
                break;
            case 'highpricefirst':
                items.sort((prod1, prod2) => prod2.price - prod1.price)
                break;
            default:
                break;
        }

        items.forEach(element => {
            displayProducts(element);
        });
    }
    catch (error) {
        console.error("Could not sort products");
    }
}
