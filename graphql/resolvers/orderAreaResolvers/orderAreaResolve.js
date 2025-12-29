const db = require("../../../db");
const config = require("../../../fb/config");
const { FieldValue } = require("firebase-admin/firestore");

module.exports = {
  Query: {
    getOrderAres: async (parent, args, context) => {
      const orderAreaListSnapshot = await db
        .collection("orderAreas")
        .where("companyID", "==", args.companyID)
        .get();
      const orderAreaList = [];
      orderAreaListSnapshot.forEach((doc) => {
        orderAreaList.push({
          id: doc.id,
          companyID: doc.data().companyID,
          orderAreaName: doc.data().orderAreaName,
          subOrderArea: doc.data().subOrderArea,
        });
      });
      return orderAreaList;
    },
  },
  Mutation: {
    addOrderArea: async (parent, args, context) => {
      const orderAreaName = args.orderAreaInput.orderAreaName;
      const companyID = args.orderAreaInput.companyID;
      const subOrderArea = args.orderAreaInput.subOrderArea;

      const orderAreaListSnapshot = await db
        .collection("orderAreas")
        .where("companyID", "==", companyID)
        .where("orderAreaName", "==", orderAreaName)
        .get();

      if (orderAreaListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Order Area Already Exists",
          data: orderAreaName,
        };
      }

      await db.collection("orderAreas").add({
        orderAreaName: orderAreaName,
        companyID: companyID,
        subOrderArea: subOrderArea,
      });

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Order Area Added Successfully",
        data: orderAreaName,
      };
    },
    updateOrderArea: async (parent, args, context) => {
      const orderAreaID = args.id;
      const orderAreaName = args.orderAreaInput.orderAreaName;
      const companyID = args.orderAreaInput.companyID;
      const subOrderArea = args.orderAreaInput.subOrderArea;

      const orderAreaListSnapshot = await db
        .collection("orderAreas")
        .where("companyID", "==", companyID)
        .where("orderAreaName", "==", orderAreaName)
        .get();

      if (orderAreaListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Order Area Already Exists",
          data: orderAreaName,
        };
      }

      await db.collection("orderAreas").doc(orderAreaID).update({
        orderAreaName: orderAreaName,
        companyID: companyID,
        subOrderArea: subOrderArea,
      });

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Order Area Updated Successfully",
      };
    },
    deleteOrderArea: async (parent, args, context) => {
      const orderAreaID = args.id;
      await db.collection("orderAreas").doc(orderAreaID).delete();
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Order Area Deleted Successfully",
      };
    },
  },
};
