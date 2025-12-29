const db = require("../../../db");

module.exports = {
  Query: {
    getYsChainCodes: async (parent, args, context) => {
      const ysChainCodeListSnapshot = await db.collection("ysChainCodes").get();
      const ysChainCodeList = [];
      ysChainCodeListSnapshot.forEach((doc) => {
        ysChainCodeList.push({
          id: doc.id,
          remoteID: doc.data().remoteID,
          chainCode: doc.data().chainCode,
          restaurantName: doc.data().restaurantName,
          platformID: doc.data().platformID,
        });
      });
      return ysChainCodeList;
    },
    getYsChainCodeByRemoteID: async (parent, args, context) => {
      const ysChainCodeListSnapshot = await db
        .collection("ysChainCodes")
        .where("remoteID", "==", args.remoteID)
        .get();
      let ysChainCode = {};
      ysChainCodeListSnapshot.forEach((doc) => {
        ysChainCode = {
          id: doc.id,
          remoteID: doc.data().remoteID,
          chainCode: doc.data().chainCode,
          restaurantName: doc.data().restaurantName,
          platformID: doc.data().platformID,
        };
      });
      return ysChainCode;
    },
  },

  Mutation: {
    addYsChainCode: async (parent, args, context) => {
      const remoteID = args.ysChainCodeInput.remoteID;
      const chainCode = args.ysChainCodeInput.chainCode;
      const restaurantName = args.ysChainCodeInput.restaurantName;

      const ysChainCodeListSnapshot = await db
        .collection("ysChainCodes")
        .where("remoteID", "==", remoteID)
        .get();

      if (ysChainCodeListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Ys Chain Code Already Exists",
          data: remoteID,
        };
      }

      await db.collection("ysChainCodes").add({
        remoteID: remoteID,
        chainCode: chainCode,
        restaurantName: restaurantName,
      });

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Ys Chain Code Added Successfully",
        data: remoteID,
      };
    },
    updateYsChainCode: async (parent, args, context) => {
      const ysChainCodeID = args.id;
      const remoteID = args.ysChainCodeInput.remoteID;
      const chainCode = args.ysChainCodeInput.chainCode;
      const restaurantName = args.ysChainCodeInput.restaurantName;
      

/*       const ysChainCodeListSnapshot = await db
        .collection("ysChainCodes")
        .where("remoteID", "==", remoteID)
        .get();
      if (ysChainCodeListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Ys Chain Code Already Exists",
          data: remoteID,
        };
      } */
      await db.collection("ysChainCodes").doc(ysChainCodeID).update({
        remoteID: remoteID,
        chainCode: chainCode,
        restaurantName: restaurantName
      });
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Ys Chain Code Updated Successfully",
        data: remoteID,
      };
    },
    deleteYsChainCode: async (parent, args, context) => {
      const ysChainCodeID = args.id;
      await db.collection("ysChainCodes").doc(ysChainCodeID).delete();
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Ys Chain Code Deleted Successfully",
        data: ysChainCodeID,
      };
    },
  },
};
