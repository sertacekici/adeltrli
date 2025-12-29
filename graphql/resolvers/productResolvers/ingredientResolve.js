const db = require("../../../db");
const config = require("../../../fb/config");
const { FieldValue } = require("firebase-admin/firestore");

module.exports = {
  Query: {
    getIngredients: async (parent, args, context) => {
      const ingredientListSnapshot = await db
        .collection("ingredients")
        .where("ingrGroupID", "==", args.ingrGroupID)
        .get();
      const ingredientList = [];
      ingredientListSnapshot.forEach((doc) => {
        ingredientList.push({
          id: doc.id,
          ingrGroupID: doc.data().ingrGroupID,
          ingrName: doc.data().ingrName,
          ingrDescription: doc.data().ingrDescription,
          ingrStandartPrice: doc.data().ingrStandartPrice,
          ingrPrices: doc.data().ingrPrices,
        });
      });

      return ingredientList;
    },
  },
  Mutation: {
    addIngredient: async (parent, args, context) => {
      const ingrGroupID = args.ingredientInput.ingrGroupID;
      const ingrName = args.ingredientInput.ingrName;
      const ingrDescription = args.ingredientInput.ingrDescription;
      const ingrStandartPrice = args.ingredientInput.ingrStandartPrice;
      const ingrPrices = args.ingredientInput.ingrPrices;
      const ingredientListSnapshot = await db
        .collection("ingredients")
        .where("ingrGroupID", "==", ingrGroupID)
        .where("ingrName", "==", ingrName)
        .get();

      if (ingredientListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Ingredient Already Exists",
          data: ingrName,
        };
      }
      await db.collection("ingredients").add({
        ingrGroupID: ingrGroupID,
        ingrName: ingrName,
        ingrDescription: ingrDescription,
        ingrStandartPrice: ingrStandartPrice,
        ingrPrices: ingrPrices,
      });
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Ingredient Added",
        data: ingrName,
      };
    },
    updateIngredient: async (parent, args, context) => {
      const ingrGroupID = args.ingredientInput.ingrGroupID;
      const ingrName = args.ingredientInput.ingrName;
      const ingrDescription = args.ingredientInput.ingrDescription;
      const ingrStandartPrice = args.ingredientInput.ingrStandartPrice;
      const ingrPrices = args.ingredientInput.ingrPrices;

      await db.collection("ingredients").doc(args.id).update({
        ingrGroupID: ingrGroupID,
        ingrName: ingrName,
        ingrDescription: ingrDescription,
        ingrStandartPrice: ingrStandartPrice,
        ingrPrices: ingrPrices,
      });
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Ingredient Updated",
        data: ingrName,
      };
    },
    deleteIngredient: async (parent, args, context) => {
      const ingredientListSnapshot = await db
        .collection("ingredients")
        .doc(args.id)
        .get();
      const ingrName = ingredientListSnapshot.data().ingrName;
      await db.collection("ingredients").doc(args.id).delete();
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Ingredient Deleted",
        data: ingrName,
      };
    },
  },
};
