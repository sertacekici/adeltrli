const db = require("../../../db");
const config = require("../../../fb/config");
const { FieldValue } = require("firebase-admin/firestore");

module.exports = {
  Query: {
    getCouriers: async (parent, args, context) => {
      const courierListSnapshot = await db
        .collection("couriers")
        .where("companyID", "==", args.companyID)
        .get();
      const courierList = [];

      courierListSnapshot.forEach((doc) => {
        courierList.push({
          id: doc.id,
          courierName: doc.data().courierName,
          courierPhone: doc.data().courierPhone,
          courierNote: doc.data().courierNote,
          EmergencyContact: doc.data().EmergencyContact,
          EmergencyContactPhone: doc.data().EmergencyContactPhone,
          courierStatus: doc.data().courierStatus,
          courierUsername: doc.data().courierUsername,
          courierPassword: doc.data().courierPassword,
          companyID: doc.data().companyID,
          courierOrderArea: doc.data().courierOrderArea,
        });
      });
      return courierList;
    },
  },
  Courier: {
    courierOrderArea: async (parent, args, context) => {
      console.log(parent.courierOrderArea);

      let orderAreaList = [];

      for (let i = 0; i < parent.courierOrderArea.length; i++) {
        const orderArea = await db
          .collection("orderAreas")
          .doc(parent.courierOrderArea[i])
          .get();
        orderAreaList.push({
          id: orderArea.id,
          orderAreaName: orderArea.data().orderAreaName,
          companyID: orderArea.data().companyID,
          subOrderArea: orderArea.data().subOrderArea,
        });
      }

      return orderAreaList;
    },
  },
  Mutation: {
    addCourier: async (parent, args, context) => {
      const courierName = args.courierInput.courierName;
      const courierPhone = args.courierInput.courierPhone;
      const courierNote = args.courierInput.courierNote;
      const EmergencyContact = args.courierInput.EmergencyContact;
      const EmergencyContactPhone = args.courierInput.EmergencyContactPhone;
      const courierStatus = args.courierInput.courierStatus;
      const courierUsername = args.courierInput.courierUsername;
      const courierPassword = args.courierInput.courierPassword;
      const courierOrderArea = args.courierInput.courierOrderArea;
      const companyID = args.courierInput.companyID;

      const courierListSnapshot = await db
        .collection("couriers")
        .where("courierName", "==", courierName)
        .get();

      if (courierListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Courier Already Exists",
          data: courierName,
        };
      }

      await db.collection("couriers").add({
        courierName: courierName,
        courierPhone: courierPhone,
        courierNote: courierNote,
        EmergencyContact: EmergencyContact,
        EmergencyContactPhone: EmergencyContactPhone,
        courierStatus: courierStatus,
        courierUsername: courierUsername,
        courierPassword: courierPassword,
        courierOrderArea: courierOrderArea,
        companyID: companyID,
      });

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Courier Added Successfully",
        data: courierName,
      };
    },
    updateCourier: async (parent, args, context) => {
      const courierID = args.id;
      const courierName = args.courierInput.courierName;
      const courierPhone = args.courierInput.courierPhone;
      const courierNote = args.courierInput.courierNote;
      const EmergencyContact = args.courierInput.EmergencyContact;
      const EmergencyContactPhone = args.courierInput.EmergencyContactPhone;
      const courierStatus = args.courierInput.courierStatus;
      const courierOrderArea = args.courierInput.courierOrderArea;
      const companyID = args.courierInput.companyID;

      await db.collection("couriers").doc(courierID).update({
        courierName: courierName,
        courierPhone: courierPhone,
        courierNote: courierNote,
        EmergencyContact: EmergencyContact,
        EmergencyContactPhone: EmergencyContactPhone,
        courierStatus: courierStatus,
        courierOrderArea: courierOrderArea,
        companyID: companyID,
      });

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Courier Added Successfully",
        data: courierName,
      };
    },
    deleteCourier: async (parent, args, context) => {
      const courierID = args.id;

      await db.collection("couriers").doc(courierID).delete();

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Courier Deleted Successfully",
        data: courierID,
      };
    },
  },
};
