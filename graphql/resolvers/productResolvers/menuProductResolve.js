const db = require("../../../db");
const config = require("../../../fb/config");

module.exports = {
  Query: {
    getMenuProducts: async (parent, args, context) => {
      console.log(args);
      var productListAll = db.collection("menuProducts");
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
    getMenuProduct: async (parent, args, context) => {
      const productcode = args.id;

      const snapshot = db.collection("menuProducts").doc(productcode);

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
    GetMenuProductsByMenuID: async (parent, args, context) => {
      const menuID = args.menuID;

      const snapshot = await db
        .collection("menuProducts")
        .where("productMenuID", "==", menuID)
        .get();
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Log the results and return
      console.log("products", products);
      return products;
    },
  },
  Mutation: {
    addMenuProduct: async (parent, args, context) => {
      try {
        const productcode = args.productcode;
        let product = args.productInput;

        const snapshot = db.collection("menuProducts");

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
    updateMenuProduct: async (parent, args, context) => {
      try {
        const productcode = args.id;
        let product = args.productInput;

        const snapshot = db.collection("menuProducts").doc(productcode);

        const update = snapshot.update(product).then((result) => {
          return result;
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
    updateMenuProductOrderNo: async (parent, args, context) => {
      try {
        const productcode = args.productOrderUpdateInput.id;
        let productOrderNo = args.productOrderUpdateInput.productOrderNo;

        const snapshot = db.collection("menuProducts").doc(productcode);

        const update = snapshot
          .update({ productOrderNo: productOrderNo })
          .then((result) => {
            return result;
          });

        return {
          success: true,
          message: "Product Order No Updated",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    deleteMenuProduct: async (parent, args, context) => {
      try {
        const productcode = args.id;

        const snapshot = db.collection("menuProducts").doc(productcode);

        const deleteDoc = snapshot.delete().then((result) => {
          return result;
        });

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
