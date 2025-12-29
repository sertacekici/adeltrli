const db = require("../../../db");
const config = require("../../../fb/config");
const authornot = require("../../../middleware/authCheck");

module.exports = {
  Query: {
    getCustomers: async (parent, args, context) => {
      var customerListAll = db.collection("customers");
      const allCustomers = customerListAll.get().then((snapshot) => {
        let customerList = [];

        snapshot.forEach((doc) => {
          customerList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        return customerList;
      });
      return allCustomers;
    },
    getCustomer: async (parent, args, context) => {
      const customercode = args.id;

      const snapshot = db.collection("customers").doc(customercode);

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
  Customer: {
    customerLisances: async (parent) => {
      const snapshot = await db
        .collection("lisances")
        .where("lisanceCustomer", "==", parent.id)
        .get();

      let lisances = [];
      snapshot.forEach((doc) => {
        lisances.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return lisances;
    },
  },
  Mutation: {
    addCustomer: async (parent, args, context) => {
      try {
        const customercode = args.customercode;
        let customer = args.customerInput;

        const snapshot = db.collection("customers");

        const addID = snapshot.add(customer).then((result) => {
          const resultID = result.id;
          return resultID;
        });

        return {
          success: true,
          message: addID,
        };
      } catch (e) {
        return {
          success: false,
          message: e.message,
        };
      }
    },
    updateCustomer: async (parent, args, context) => {
      try {
        const customercode = args.id;
        const customer = args.customerInput;
        const snapshot = db.collection("customers").doc(customercode);
        await snapshot.update(customer);
        return {
          success: true,
          message: "Customer Updated",
        };
      } catch (e) {
        return {
          success: false,
          message: e.message,
        };
      }
    },
    deleteCustomer: async (parent, args, context) => {
      try {
        const customercode = args.id;
        const snapshot = db.collection("customers").doc(customercode);
        await snapshot.delete();
        return {
          success: true,
          message: "Customer Deleted",
        };
      } catch (e) {
        return {
          success: false,
          message: e.message,
        };
      }
    },
  },
};

