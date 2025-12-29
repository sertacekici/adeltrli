const db = require("../../../db");
const config = require("../../../fb/config");
const NetGsm = require("netgsm");
const bcrypt = require("bcryptjs");
const date = require("date-and-time");
const { FieldValue } = require("firebase-admin/firestore");

module.exports = {
  Query: {
    getLisances: async (parent, args, context) => {
      var lisanceListAll = db.collection("lisances");
      const allLisances = lisanceListAll.get().then((snapshot) => {
        let lisanceList = [];

        snapshot.forEach((doc) => {
          lisanceList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        lisanceList.sort((a, b) => {
          const dateA = new Date(a.lisanceFinishDate);
          const dateB = new Date(b.lisanceFinishDate);
          return dateA - dateB;
        });
        return lisanceList;
      });

      return allLisances;
    },
    getLisancesYemekSepeti: async (parent, args, context) => {
      const ysCustomerList = db.collection("ysCustomerList");

      const allLisances = await ysCustomerList.get().then((snapshot) => {
        let lisanceList = [];
        snapshot.forEach(async (doc) => {
          lisanceList.push({
            ...doc.data(),
          });
        });

        return lisanceList;
      });

      return allLisances;
    },
    getLisancesGetir: async (parent, args, context) => {
      const getirCustomerList = db.collection("gtrCustomerList");

      const allLisances = await getirCustomerList.get().then((snapshot) => {
        let gtrLisanceList = [];
        snapshot.forEach(async (doc) => {
          gtrLisanceList.push({
            ...doc.data(),
          });
        });

        return gtrLisanceList;
      });

      return allLisances;
    },
    getLisanceByCustomerPhone: async (parent, args, context) => {
      const customerPhone = args.customerPhone;
      const customerSnapshot = await db
        .collection("customers")
        .where("customerPhone", "==", customerPhone)
        .get();
      let customer;

      customerSnapshot.forEach((doc) => {
        customer = { id: doc.id, ...doc.data() };
      });

      if (!customer) {
        throw new Error("Customer not found");
      }

      const lisances = await db
        .collection("lisances")
        .where("lisanceCustomer", "==", customer.id)
        .get()
        .then((snapshot) => {
          let lisanceList = [];
          snapshot.forEach(async (doc) => {
            lisanceList.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          return lisanceList;
        });

      lisances.sort((a, b) => {
        const dateA = new Date(a.lisanceFinishDate);
        const dateB = new Date(b.lisanceFinishDate);
        return dateA - dateB;
      });

      return lisances;
    },
    getLisancesNearEnd: async (parent, args, context) => {
      var lisanceListAll = db.collection("lisances");
      const allLisances = lisanceListAll.get().then((snapshot) => {
        let lisanceList = [];

        snapshot.forEach((doc) => {
          const lisancefinishDate = doc.data().lisanceFinishDate;
          const lisancestatus = doc.data().lisanceStatus;

          const dayLisance = new Date(lisancefinishDate);
          const fndate = new Date(dayLisance);
          const dayNow = new Date();
          const daycount = date.subtract(fndate, dayNow).toDays();
          const daycountMath = Math.round(daycount);

          if (daycountMath <= 31 && lisancestatus === "1") {
            lisanceList.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });

        lisanceList.sort((a, b) => {
          const dateA = new Date(a.lisanceFinishDate);
          const dateB = new Date(b.lisanceFinishDate);
          return dateA - dateB;
        });

        return lisanceList;
      });
      return allLisances;
    },
    getLisance: async (parent, args, context) => {
      const lisanceno = args.id;

      const snapshot = db.collection("lisances").doc(lisanceno);

      let lisanceList = [];
      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
        if (documentSnapshot.exists) {
          lisanceList.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        } else {
          return "Lisance Not Found";
        }
      });
      return lisanceList;
    },
    getLisanceDeletedCustomers: async (parent, args, context) => {
      var lisanceListAll = db.collection("lisances");
      var customerListAll = db.collection("customers");

      const allLisances = lisanceListAll.get().then((snapshot) => {
        let lisanceList = [];

        snapshot.forEach((doc) => {
          const lisanceCustomer = doc.data().lisanceCustomer;
          const lisanceID = doc.id;

          const checkExist = checkCustomerExist(lisanceCustomer, lisanceID);

          if (checkExist === false) {
            lisanceList.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
        return lisanceList;
      });
      return allLisances;
    },
    getLisanceByCustomerCode: async (parent, args, context) => {
      const customerCode = args.customerCode;
      const lisanceListAll = db.collection("lisances");
      const allLisances = lisanceListAll.get().then((snapshot) => {
        let lisanceList = [];
        snapshot.forEach((doc) => {
          if (doc.data().lisanceCustomer === customerCode) {
            lisanceList.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
        return lisanceList;
      });
      return allLisances;
    },
    getLisanceByProductCode: async (parent, args, context) => {
      const productCode = args.productCode;
      const lisanceListAll = db.collection("lisances");
      const allLisances = lisanceListAll.get().then((snapshot) => {
        let lisanceList = [];
        snapshot.forEach((doc) => {
          if (doc.data().lisanceProduct === productCode) {
            lisanceList.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
        return lisanceList;
      });
      return allLisances;
    },
    getLisancesByLisanceCode: async (parent, args, context) => {
      const lisancecode = args.id;
      const username = args.username;
      const userpass = args.userpass;

      const lisanceSnapshot = db.collection("lisances").doc(lisancecode).get();

      const lisanceResult = await lisanceSnapshot.then(async (snapshot) => {
        if (snapshot.exists) {
          const lisancefinishDate = snapshot.data().lisanceFinishDate;
          const lisancestatus = snapshot.data().lisanceStatus;

          if (lisancestatus === "0") {
            return {
              __typename: "ResponseAll",
              success: false,
              message: "Lisance is not active",
            };
          }

          const dayLisance = new Date(lisancefinishDate);
          const fndate = new Date(dayLisance);
          const dayNow = new Date();
          const daycount = date.subtract(fndate, dayNow).toDays();
          const daycountMath = Math.round(daycount);

          const isEqual = await bcrypt.compare(
            userpass,
            snapshot.data().swuserpass
          );
          const isEqual2 = await bcrypt.compare(
            username,
            snapshot.data().swusername
          );

          if (!isEqual) {
            return {
              __typename: "ResponseAll",
              success: false,
              message: "User Passwords is not correct",
            };
          }
          if (!isEqual2) {
            return {
              __typename: "ResponseAll",
              success: false,
              message: "User Name is not correct",
            };
          }
          //daycountMath is show how long time remaining to finish lisance
          if (daycountMath <= 0) {
            return {
              __typename: "LisanceControl",
              lisanceStatus: "finished",
              lisanceRemainDays: 0,
            };
          } else {
            return {
              __typename: "LisanceControl",
              lisanceStatus: "active",
              lisanceRemainDays: daycountMath,
            };
          }
        } else {
          return {
            __typename: "ResponseAll",
            success: false,
            message: "Lisance Not Found",
          };
        }
      });
      return lisanceResult;
    },
  },
  Lisance: {
    lisanceProduct: async (parent) => {
      const lisanceno = parent.lisanceProduct;
      const snapshot = db.collection("products").doc(lisanceno);
      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
        //console.log(documentSnapshot);
        if (documentSnapshot.exists) {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        } else {
          return "Product Not Found";
        }
      });
      return sendResult;
    },
    lisanceCustomer: async (parent) => {
      const customerno = parent.lisanceCustomer;
      const snapshot = db.collection("customers").doc(customerno);

      const sendResult = await snapshot
        .get()
        .then(async (documentSnapshot) => {
          if (documentSnapshot.exists) {
            return {
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            };
          } else {
            console.log("customerno  ::: ", customerno);
            console.log("Customer Not Found");
            return "Customer Not Found";
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return sendResult;
    },
  },
  YemekSepetiList: {
    lisanceCustomer: async (parent) => {
      const customerno = parent.lisanceCustomerID;

      const snapshot = db.collection("customers").doc(customerno);

      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
        if (documentSnapshot.exists) {
          return {
            ...documentSnapshot.data(),
          };
        } else {
          console.log("Customer Not Found");
          return "Customer Not Found";
        }
      });
      return sendResult;
    },
  },
  GetirList: {
    lisanceCustomer: async (parent) => {
      const customerno = parent.lisanceCustomerID;

      const snapshot = db.collection("customers").doc(customerno);

      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
        if (documentSnapshot.exists) {
          return {
            ...documentSnapshot.data(),
          };
        } else {
          console.log("Customer Not Found");
          return "Customer Not Found";
        }
      });
      return sendResult;
    },
    lisanceInfo: async (parent) => {
      const lisanceno = parent.lisanceID;
      const snapshot = db.collection("lisances").doc(lisanceno);

      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
        if (documentSnapshot.exists) {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        } else {
          return "Lisance Not Found";
        }
      });
      return sendResult;
    },
  },
  Mutation: {
    addLisance: async (parent, args, context) => {
      try {
        let lisance = args.lisanceInput;

        const hashedUserName = await bcrypt.hash(lisance.swusername, 12);
        const hashedUserPass = await bcrypt.hash(lisance.swuserpass, 12);

        const lisanceprice = lisance.lisancePrice;
        const lisancestartdate = lisance.lisanceFinishDate;
        let customerName = lisance.customerName;
        let productName = lisance.productName;
        let customercode = lisance.lisanceCustomer;

        const newLisance = {
          lisanceFinishDate: lisance.lisanceFinishDate,
          lisanceStatus: lisance.lisanceStatus,
          lisanceNote: lisance.lisanceNote,
          lisanceProduct: lisance.lisanceProduct,
          lisanceCustomer: lisance.lisanceCustomer,
          swusername: hashedUserName,
          swuserpass: hashedUserPass,
          lisancePrice: lisance.lisancePrice,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          creatorUser: lisance.creatorUser,
        };

        // check if customer exist customercode equels to customerID

        const customerrecord = db.collection("customers").doc(customercode);

        // eğer customer yoksa lisance eklenmeyecek

        const customerExist = await customerrecord.get().then((doc) => {
          return doc.exists;
        });

        console.log("customerExist : ", customerExist);

        if (customerExist) {
          const snapshot = db.collection("lisances");
          const addID = await snapshot.add(newLisance).then((result) => {
            const resultID = result.id;
            return resultID;
          });

          //const customersnaps = db.collection("customers").doc(customercode);

          await customerrecord.update({
            customerLisances: FieldValue.arrayUnion(addID),
          });

          return {
            success: true,
            message: addID,
          };
        } else {
          return {
            success: false,
            message: "Customer does not exist",
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    updateLisance: async (parent, args, context) => {
      const lisanceno = args.id;
      let lisance = args.lisanceInput;
      const lisanceprice = lisance.lisancePrice;
      const lisancestartdate = lisance.lisanceFinishDate;
      let customerName = lisance.customerName;
      let productName = lisance.productName;

      const newLisance = {
        lisanceFinishDate: lisance.lisanceFinishDate,
        lisanceStatus: lisance.lisanceStatus,
        lisanceNote: lisance.lisanceNote,
        lisanceProduct: lisance.lisanceProduct,
        lisanceCustomer: lisance.lisanceCustomer,
        lisancePrice: lisance.lisancePrice,
        creatorUser: lisance.creatorUser,
        updatedAt: FieldValue.serverTimestamp(),
      };

      const snapshot = db.collection("lisances").doc(lisanceno);

      const updateResult = await snapshot
        .update(newLisance)
        .then(async (result) => {
          /*  smsGonderUpdateLisance(
            customerName,
            productName,
            lisanceprice,
            lisancestartdate,
            lisanceno
          ); */

          return {
            success: true,
            message: "Lisance Updated",
          };
        });
      return updateResult;
    },
    updateLisanceByCustomerCode: async (parent, args, context) => {
      const customerID = args.customerID;
      const newLisanceDate = args.newLisanceDate;

      // find and update lisances by customer code
      const lisanceList = db
        .collection("lisances")
        .where("lisanceCustomer", "==", customerID);

      const updateResult = await lisanceList.get().then(async (snapshot) => {
        snapshot.forEach(async (doc) => {
          const lisanceID = doc.id;

          const newLisance = {
            lisanceFinishDate: newLisanceDate,
            updatedAt: FieldValue.serverTimestamp(),
          };

          const lisanceSnapshot = db.collection("lisances").doc(lisanceID);

          await lisanceSnapshot.update(newLisance);
        });
      });

      return {
        success: true,
        message: "Lisances Updated",
      };
    },

    updateLisanceUser: async (parent, args, context) => {
      const lisanceno = args.id;
      let lisance = args.lisanceUserUpdateInput;

      const hashedUserName = await bcrypt.hash(lisance.swusername, 12);
      const hashedUserPass = await bcrypt.hash(lisance.swuserpass, 12);

      const newLisance = {
        swusername: hashedUserName,
        swuserpass: hashedUserPass,
      };

      const snapshot = db.collection("lisances").doc(lisanceno);

      const updateResult = await snapshot
        .update(newLisance)
        .then(async (result) => {
          return {
            success: true,
            message: "Lisance Updated",
          };
        });
      return updateResult;
    },
    deleteLisance: async (parent, args, context) => {
      const lisanceno = args.id;
      const customercode = args.customerID;

      const snapshot = db.collection("lisances").doc(lisanceno);

      const deleteResult = await snapshot.delete().then(async (result) => {
        const customersnaps = db.collection("customers").doc(customercode);

        await customersnaps.update({
          customerLisances: FieldValue.arrayRemove(lisanceno),
        });
        return {
          success: true,
          message: "Lisance Deleted",
        };
      });
      return deleteResult;
    },
  },
};

const smsGonderNewLisance = async (
  customerName,
  productName,
  price,
  enddate,
  lisanceID
) => {
  const dd = new Date(enddate);
  const finishdate = date.format(dd, "YYYY/MM/DD HH:mm:ss");
  const createdLink = `https://www.siparisrobotu.com/customerinfo/${lisanceID}`;
  const messagetxt = `NEW LISANCE - Hi Boss,  ${customerName} -  ${createdLink} - Product : ${productName} - Price: ${price} TRY  Finish Date : ${finishdate}`;

  sendSms(messagetxt);
};

const smsGonderUpdateLisance = async (
  customerName,
  productName,
  price,
  enddate,
  lisanceID
) => {
  const dd = new Date(enddate);
  const finishdate = date.format(dd, "YYYY/MM/DD HH:mm:ss");
  const createdLink = `https://www.siparisrobotu.com/customerinfo/${lisanceID}`;
  const messagetxt = `UPDATE LISANCE - Hi Boss,  ${customerName} -  ${createdLink} - Product : ${productName} - Price: ${price} TRY NEW Finish Date : ${finishdate}`;

  sendSms(messagetxt);
};

const sendSms = (messagetxt) => {
  if (config.serviceStatus === "development") {
    return;
  } else {
    (async () => {
      const netgsm = new NetGsm({
        usercode: config.usercode,
        password: config.userpass,
        msgheader: config.msgheader,
      });
      const response = await netgsm.get("sms/send/get/", {
        gsmno: 5327985436,
        message: messagetxt,
      });
    })();
  }
};

const checkCustomerExist = async (customercode, lisanceID) => {
  if (
    customercode === undefined ||
    customercode === null ||
    customercode === ""
  ) {
  } else {
    const snapshot = db.collection("customers").doc(customercode);

    const customer = await snapshot.get().then((doc) => {
      if (!doc.exists) {
        const snapnap = db.collection("lisances").doc(lisanceID);
        snapnap.delete();

        return false;
      } else {
        return true;
      }
    });
    return customer;
    //const snapnap = db.collection("lisances").doc(lisanceID);
    //snapnap.delete();
    //return false;
  }
};
