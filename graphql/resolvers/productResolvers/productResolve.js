const db = require("../../../db");
const config = require("../../../fb/config");

module.exports = {
  Query: {
    getProducts: async (parent, args, context) => {
      var productListAll = db.collection("products");
      const allProducts = productListAll.get().then((snapshot) => {
        let productList = [];

        snapshot.forEach((doc) => {
          productList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        return productList;
      });
      return allProducts;
    },
    getProduct: async (parent, args, context) => {
      const productcode = args.id;

      const snapshot = db.collection("products").doc(productcode);

      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
        if (documentSnapshot.exists) {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        } else {
          return "Product Not Found";
        }
      });
      return sendResult;
    },
  },
  Mutation: {
    addProduct: async (parent, args, context) => {
      try {
        const productcode = args.productcode;
        let product = args.productInput;

        const snapshot = db.collection("products");

        const addID = snapshot.add(product).then((result) => {
          const resultID = result.id;
          return resultID;
        });

        return {
          success: true,
          message: "Product Added",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    updateProduct: async (parent, args, context) => {
      try {
        const productcode = args.id;
        let product = args.productInput;

        const snapshot = db.collection("products").doc(productcode);

        const updateID = snapshot.update(product).then((result) => {
          const resultID = result.id;
          return resultID;
        });

        return {
          success: true,
          message: "Product Updated",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    deleteProduct: async (parent, args, context) => {
      try {
        const productcode = args.id;

        const snapshot = db.collection("products").doc(productcode);

        const deleteID = snapshot.delete();
        return {
          success: true,
          message: "Product Deleted",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
  },
};
