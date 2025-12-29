const db = require("../../../db");
const config = require("../../../fb/config");
const { FieldValue } = require("firebase-admin/firestore");

module.exports = {
  Query: {
    getIngredientGroups: async (parent, args, context) => {
      const ingredientGroupListSnapshot = await db
        .collection("ingredientGroups")
        .where("companyID", "==", args.companyID)
        .get();
      const ingredientGroupList = [];
      ingredientGroupListSnapshot.forEach((doc) => {
        ingredientGroupList.push({
          id: doc.id,
          companyID: doc.data().companyID,
          ingrGrpName: doc.data().ingrGrpName,
          ingrGrpDescription: doc.data().ingrGrpDescription,
          ingrGrpShowPrices: doc.data().ingrGrpShowPrices,
          ingrGrpSingleSizeChoice: doc.data().ingrGrpSingleSizeChoice,
          ingrGrpSizeGroupID: doc.data().ingrGrpSizeGroupID,
        });
      });

      return ingredientGroupList;
    },
  },
  Mutation: {
    addIngredientGroup: async (parent, args, context) => {
      const companyID = args.ingredientGroupInput.companyID;
      const ingrGrpName = args.ingredientGroupInput.ingrGrpName;
      const ingrGrpDescription = args.ingredientGroupInput.ingrGrpDescription;
      const ingrGrpShowPrices = args.ingredientGroupInput.ingrGrpShowPrices;
      const ingrGrpSingleSizeChoice =
        args.ingredientGroupInput.ingrGrpSingleSizeChoice;
      const ingrGrpSizeGroupID = args.ingredientGroupInput.ingrGrpSizeGroupID;
      const ingredientGroupListSnapshot = await db
        .collection("ingredientGroups")
        .where("companyID", "==", companyID)
        .where("ingrGrpName", "==", ingrGrpName)
        .get();

      if (ingredientGroupListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Ingredient Group Already Exists",
          data: ingrGrpName,
        };
      }
      await db.collection("ingredientGroups").add({
        companyID: companyID,
        ingrGrpName: ingrGrpName,
        ingrGrpDescription: ingrGrpDescription,
        ingrGrpShowPrices: ingrGrpShowPrices,
        ingrGrpSingleSizeChoice: ingrGrpSingleSizeChoice,
        ingrGrpSizeGroupID: ingrGrpSizeGroupID,
      });
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Ingredient Group Added Successfully",
        data: ingrGrpName,
      };
    },
    updateIngredientGroup: async (parent, args, context) => {
      console.log(args);
      const ingrID = args.id;
      const companyID = args.ingredientGroupInput.companyID;
      const ingrGrpName = args.ingredientGroupInput.ingrGrpName;
      const ingrGrpDescription = args.ingredientGroupInput.ingrGrpDescription;
      const ingrGrpShowPrices = args.ingredientGroupInput.ingrGrpShowPrices;
      const ingrGrpSingleSizeChoice =
        args.ingredientGroupInput.ingrGrpSingleSizeChoice;
      const ingrGrpSizeGroupID = args.ingredientGroupInput.ingrGrpSizeGroupID;

      await db.collection("ingredientGroups").doc(ingrID).update({
        companyID: companyID,
        ingrGrpName: ingrGrpName,
        ingrGrpDescription: ingrGrpDescription,
        ingrGrpShowPrices: ingrGrpShowPrices,
        ingrGrpSingleSizeChoice: ingrGrpSingleSizeChoice,
        ingrGrpSizeGroupID: ingrGrpSizeGroupID,
      });
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Ingredient Group Added Successfully",
        data: ingrGrpName,
      };
    },
    deleteIngredientGroup: async (parent, args, context) => {
      await db.collection("ingredientGroups").doc(args.id).delete();
      return {
        __typename: "ResponseAll",
        success: false,
        message: "Ingredient Group Deleted Successfully",
      };
    },
  },
};
