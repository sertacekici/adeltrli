const db = require("../../../db");
const config = require("../../../fb/config");
const { FieldValue } = require("firebase-admin/firestore");

module.exports = {
  Query: {
    getLisanceRequests: async (parent, args, context) => {
      var lisanceRequestListAll = db.collection("lisancerequests");

      const allLisanceRequests = lisanceRequestListAll
        .get()
        .then((snapshot) => {
          let lisanceRequestList = [];

          snapshot.forEach((doc) => {
            lisanceRequestList.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          return lisanceRequestList;
        });

      

      return allLisanceRequests;
    },
    getLisanceRequest: async (parent, args, context) => {
      const lisanceRequestcode = args.id;

      const snapshot = db.collection("lisancerequests").doc(lisanceRequestcode);

      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
        if (documentSnapshot.exists) {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        } else {
          return "User Not Found";
        }
      });
      return sendResult;
    },
  },

  Mutation: {
    addLisanceRequest: async (parent, args, context) => {
      try {
        const {
          Username,
          UserPass,
          LicenseCustomer,
          LicenceProduct,
          CustomerName,
          ProductName,
          LicenseNote,
        } = args.lisanceRequestInput;

        const lisanceAdd = {
          ProductName,
          CustomerName,
          LicenseCustomer,
          LicenceProduct,
          LicenseNote,
          Username,
          UserPass,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        };

        // customers tablosundaki id ile LicenseCustomer karşılaştırılacak eğer yoksa işleme devam etmeyecek.
        const checkLisanceCustomerExist = await db
          .collection("customers")
          .where("id", "==", LicenseCustomer)
          .get();

        if (checkLisanceCustomerExist.docs.length > 0) {
          return {
            success: false,
            message: "Lisance Customer Not Exist",
          };
        }

        if (checkLisanceCustomerExist.docs.length > 0) {
          return {
            success: false,
            message: "Lisance Customer Not Exist",
          };
        }

        const lisanceSnapshot = db.collection("lisancerequests");

        const docRef = await lisanceSnapshot.add(lisanceAdd);

        return {
          success: true,
          message: docRef.id,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    updateLisanceRequest: async (parent, args, context) => {
      try {
        const {
          Username,
          UserPass,
          LicenseCustomer,
          LicenceProduct,
          CustomerName,
          ProductName,
          LicenseNote,
        } = args.lisanceRequestInput;

        const lisanceUpdate = {
          ProductName,
          CustomerName,
          LicenseCustomer,
          LicenceProduct,
          LicenseNote,
          Username,
          UserPass,
          updatedAt: FieldValue.serverTimestamp(),
        };
        const lisanceSnapshot = db.collection("lisancerequests").doc(args.id);

        await lisanceSnapshot.update(lisanceUpdate);

        return {
          success: true,
          message: "Lisance Request Updated",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    deleteLisanceRequest: async (parent, args, context) => {
      try {
        const lisanceSnapshot = db.collection("lisancerequests").doc(args.id);

        await lisanceSnapshot.delete();

        return {
          success: true,
          message: "Lisance Request Deleted",
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
//
