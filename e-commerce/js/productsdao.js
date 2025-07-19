class ProductsDao {
    async getProducts() {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            const json = await response.json();
            return json;
        }
        catch(error) {
            throw new ProductFetchError("Unable to fetch products from server");
        }
    }
}