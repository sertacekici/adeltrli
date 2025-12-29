const db = require("../../../db");
const config = require("../../../fb/config");
const base64 = require("base-64");
const fetch = require("node-fetch");
var axios = require("axios");

module.exports = {
  Query: {
    getSmsUser: async (parent, args, context) => {
      const id = args.id;
      const snapshot = db.collection("smsusers").doc(id);
      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
        if (documentSnapshot.exists) {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        } else {
          return "SmsUser Not Found";
        }
      });
      return sendResult;
    },
    getSmsUsers: async (parent, args, context) => {
      var smsUserListAll = db.collection("smsusers");
      const allSmsUsers = smsUserListAll.get().then((snapshot) => {
        let smsUserList = [];

        snapshot.forEach((doc) => {

            const smstotal = parseInt(doc.data().totalbuy);
            const smsspent = parseInt(doc.data().totalspent);
            const smsbalances = smstotal - smsspent;

          smsUserList.push({
            id: doc.id,
            smsbalance:smsbalances,
            ...doc.data(),
          });
        });
        return smsUserList;
      });
      return allSmsUsers;
    },
  },

  Mutation: {
    addSmsUser: async (parent, args, context) => {
      try {
        const smsUser = args.smsUserInput;
        const snapshot = db.collection("smsusers");

        const addID = snapshot.add(smsUser).then((result) => {
          const resultID = result.id;
          return resultID;
        });

        return {
          __typename: "SmsUserControl",
          smsUserID: addID,
        };
      } catch (error) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: error,
        };
      }
    },
    updateSmsUser: async (parent, args, context) => {
      try {
        const id = args.id;
        const smsUser = args.smsUserInput;
        const snapshot = db.collection("smsusers").doc(id);

        const updateResult = await snapshot.update(smsUser).then(() => {
          return {
            success: true,
            message: "SmsUser Updated",
          };
        });

        return updateResult;
      } catch (error) {
        return {
          success: false,
          message: error,
        };
      }
    },
    deleteSmsUser: async (parent, args, context) => {
      try {
        const id = args.id;
        const snapshot = db.collection("smsusers").doc(id);

        const deleteResult = await snapshot.delete().then(() => {
          return {
            success: true,
            message: "SmsUser Deleted",
          };
        });

        return deleteResult;
      } catch (error) {
        return {
          success: false,
          message: error,
        };
      }
    },
  },
};
