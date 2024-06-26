import { productsActions } from "./products-slice";

export const getproductsData = () => {
  return async (dispatch) => {
    dispatch(productsActions.gettingProducts());

    const fetchData = async () => {
      const response = await fetch("https://dummyjson.com/products");

      if (!response.ok) {
        throw new Error("Fetching products failed!");
      }
      const data = await response.json();
      return data;
    };

    try {
      const data = await fetchData();
      dispatch(productsActions.addProductsdata(data.products));
    } catch (error) {
      dispatch(
        productsActions.showErrorNotification("Error while getting products.")
      );
    }
  };
};

export const deleteProduct = (id) => {
  return async (dispatch) => {
    dispatch(productsActions.deletingProduct(id));
    const fetchData = async () => {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fail to delete product!");
      }
      const data = await response.json();
      return data;
    };

    try {
      const data = await fetchData();
      dispatch(productsActions.deletedProduct(data));
    } catch (error) {
      dispatch(productsActions.deletionFailed());
    }
  };
};

export const addProduct = ({ title, price, brand, description, thumbnail }) => {
  return async (dispatch) => {
    dispatch(productsActions.formSubmitting());
    const fetchData = async () => {
      const response = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          price: price,
          brand: brand,
          description: description,
          thumbnail: thumbnail,
        }),
      });

      if (!response.ok) {
        throw new Error("Fail to delete product!");
      }
      const data = await response.json();
      return data;
    };

    try {
      const data = await fetchData();
      dispatch(productsActions.addProductInProductsData(data));
    } catch (error) {
      dispatch(productsActions.formSubmissionFailed());
    }
  };
};

export const updateProduct = ({
  title,
  price,
  brand,
  description,
  thumbnail,
  id,
}) => {
  return async (dispatch) => {
    dispatch(productsActions.formSubmitting());
    const fetchData = async () => {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          price: price,
          brand: brand,
          description: description,
          thumbnail: thumbnail,
        }),
      });

      if (!response.ok) {
        throw new Error("Fail to delete product!");
      }
      const data = await response.json();
      return data;
    };

    try {
      const data = await fetchData();
      dispatch(productsActions.updateProductInProductsData(data));
    } catch (error) {
      dispatch(productsActions.formSubmissionFailed());
    }
  };
};
