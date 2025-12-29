const db = require("../../../db");
const config = require("../../../fb/config");

module.exports = {
  Query: {
    getStoresByCompanyID: async (parent, args, context) => {
      const companyID = args.companyID;
      console.log(companyID);
      var storeListAll = db
        .collection("stores")
        .where("companyID", "==", companyID);
      const allStores = storeListAll.get().then((snapshot) => {
        let storeList = [];
        snapshot.forEach((doc) => {
          storeList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        return storeList;
      });
      return allStores;
    },
    getStoreByStoreID: async (parent, args, context) => {
      try {
        const storeID = args.storeID;
        const snapshot = await db.collection("stores").doc(storeID).get();

        if (!snapshot.exists) {
          throw new Error("Store not found");
        }

        return { id: snapshot.id, ...snapshot.data() };
      } catch (error) {
        console.error("Error fetching store:", error);
        throw new Error("Error fetching store");
      }
    },
  },

  Store: {
    storeMenu: async (parent) => {
      const menuID = parent.storeMenuID;
      const snapshot = db.collection("menus").doc(menuID);
      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
        if (documentSnapshot.exists) {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        } else {
          return "Menu Not Found";
        }
      });
      return sendResult;
    },
  },

  Mutation: {
    addStore: async (parent, args, context) => {
      try {
        const store = args.storeInput;
        const snapshot = db.collection("stores");
        const addID = snapshot.add(store).then((result) => {
          const resultID = result.id;
          return resultID;
        });

        return {
          __typename: "ResponseAll",
          success: true,
          message: "Store Added Successfully",
        };
      } catch (error) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Store Added Failed",
        };
      }
    },
    updateStore: async (parent, args, context) => {
      try {
        const storecode = args.id;
        console.log(storecode);
        let store = args.storeInput;
        let storeRef = db.collection("stores").doc(storecode);
        let setStore = await storeRef.update(store);
        return {
          code: 200,
          success: true,
          message: "Store Updated Successfully",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 400,
          success: false,
          message: "Store Updated Failed",
        };
      }
    },
    deleteStore: async (parent, args, context) => {
      try {
        const storecode = args.id;
        let storeRef = db.collection("stores").doc(storecode);

        let deleteStore = await storeRef.delete();
        console.log(deleteStore);
        return {
          code: 200,
          success: true,
          message: "Store Deleted Successfully",
        };
      } catch (error) {
        console.log(error);
        return {
          code: 400,
          success: false,
          message: "Store Deleted Failed",
        };
      }
    },
  },
};
