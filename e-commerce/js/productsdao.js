class ProductsDao {
    async getProducts(number) {
        try {
            const response = await fetch(`https://fakestoreapi.com/products?limit=${number}`);
            const json = await response.json();
            return json;
        }
        catch(error) {
            throw new ProductFetchError("Unable to fetch products from server");
        }
    }
}