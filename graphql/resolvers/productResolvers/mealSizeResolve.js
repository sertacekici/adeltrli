const db = require("../../../db");
const config = require("../../../fb/config");
const { FieldValue } = require("firebase-admin/firestore");

module.exports = {
  Query: {
    getMealSizes: async (parent, args, context) => {
      const mealSizeListSnapshot = await db
        .collection("mealSizes")
        .where("companyID", "==", args.companyID)
        .get();
      const mealSizeList = [];
      mealSizeListSnapshot.forEach((doc) => {
        mealSizeList.push({
          id: doc.id,
          mealSizeName: doc.data().mealSizeName,
          sizeOptions: doc.data().sizeOptions,
        });
      });

      return mealSizeList;
    },
  },

  Mutation: {
    addMealSize: async (parent, args, context) => {
      const mealSizeName = args.mealSizeInput.mealSizeName;
      const companyID = args.mealSizeInput.companyID;
      const sizeOptions = args.mealSizeInput.sizeOptions;
      const mealSizeListSnapshot = await db
        .collection("mealSizes")
        .where("companyID", "==", companyID)
        .where("mealSizeName", "==", mealSizeName)
        .get();

      if (mealSizeListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Meal Size Already Exists",
          data: mealSizeName,
        };
      }
      await db.collection("mealSizes").add({
        mealSizeName: mealSizeName,
        companyID: companyID,
        sizeOptions: sizeOptions,
      });
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Meal Size Added Successfully",
        data: mealSizeName,
      };
    },
    updateMealSize: async (parent, args, context) => {
      const mealSizeName = args.mealSizeInput.mealSizeName;
      const companyID = args.mealSizeInput.companyID;
      const sizeOptions = args.mealSizeInput.sizeOptions;
      const mealSizeListSnapshot = await db
        .collection("mealSizes")
        .where("companyID", "==", companyID)
        .where("mealSizeName", "==", mealSizeName)
        .get();
      if (mealSizeListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Meal Size Already Exists",
          data: mealSizeName,
        };
      }
      await db.collection("mealSizes").doc(args.id).update({
        mealSizeName: mealSizeName,
        companyID: companyID,
        sizeOptions: sizeOptions,
      });
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Meal Size Updated Successfully",
        data: mealSizeName,
      };
    },
    deleteMealSize: async (parent, args, context) => {
      await db.collection("mealSizes").doc(args.id).delete();
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Meal Size Deleted Successfully",
        data: args.id,
      };
    },
  },
};
