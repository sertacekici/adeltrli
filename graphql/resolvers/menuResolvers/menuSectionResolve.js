const db = require("../../../db");
const config = require("../../../fb/config");
const { FieldValue } = require("firebase-admin/firestore");

module.exports = {
  Query: {
    getMenuSectionsByMenuID: async (parent, args, context) => {
      const menuSectionListSnapshot = await db
        .collection("menuSections")
        .where("menuSectionMenuID", "==", args.menuID)
        .get();
      const menuSectionList = [];
      menuSectionListSnapshot.forEach((doc) => {
        menuSectionList.push({
          id: doc.id,
          menuSectionTitle: doc.data().menuSectionTitle,
          menuSectionMenuID: doc.data().menuSectionMenuID,
          menuSectionStatus: doc.data().menuSectionStatus,
          menuSectionOrderNo: doc.data().menuSectionOrderNo,
          menuSectionDescription: doc.data().menuSectionDescription,
          menuSectionImage: doc.data().menuSectionImage,
          menuSectionImageFileName: doc.data().menuSectionImageFileName,
        });
      });
      return menuSectionList;
    },
  },
  Mutation: {
    addMenuSection: async (parent, args, context) => {
      const menuSectionTitle = args.menuSectionInput.menuSectionTitle;
      const menuSectionMenuID = args.menuSectionInput.menuSectionMenuID;
      const menuSectionStatus = args.menuSectionInput.menuSectionStatus;

      const menuSectionDescription =
        args.menuSectionInput.menuSectionDescription;
      const menuSectionImage = args.menuSectionInput.menuSectionImage;
      const menuSectionImageFileName = args.menuSectionInput.menuSectionImageFileName;

      const orderNo = await getCount("menuSections");

       const menuSectionListSnapshot = await db
        .collection("menuSections")
        .where("menuSectionMenuID", "==", menuSectionMenuID)
        .where("menuSectionTitle", "==", menuSectionTitle)
        .get();

      if (menuSectionListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Menu Section Already Exists",
          data: menuSectionTitle,
        };
      } 

      await db.collection("menuSections").add({
        menuSectionTitle: menuSectionTitle,
        menuSectionMenuID: menuSectionMenuID,
        menuSectionStatus: menuSectionStatus,
        menuSectionOrderNo: orderNo,
        menuSectionDescription: menuSectionDescription,
        menuSectionImage: menuSectionImage,
        menuSectionImageFileName:menuSectionImageFileName,
      });

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Menu Section Added",
        data: menuSectionTitle,
      };
    },
    updateMenuSection: async (parent, args, context) => {
      const menuSectionID = args.id;
      const menuSectionTitle = args.menuSectionInput.menuSectionTitle;
      const menuSectionMenuID = args.menuSectionInput.menuSectionMenuID;
      const menuSectionStatus = args.menuSectionInput.menuSectionStatus;
      const menuSectionDescription =
        args.menuSectionInput.menuSectionDescription;
      const menuSectionImage = args.menuSectionInput.menuSectionImage;
      const menuSectionImageFileName = args.menuSectionInput.menuSectionImageFileName;

/*       const menuSectionListSnapshot = await db
        .collection("menuSections")
        .where("menuSectionMenuID", "==", menuSectionMenuID)
        .where("menuSectionTitle", "==", menuSectionTitle)
        .get();

      if (menuSectionListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Menu Section Already Exists",
          data: menuSectionTitle,
        };
      } */

      await db.collection("menuSections").doc(menuSectionID).update({
        menuSectionTitle: menuSectionTitle,
        menuSectionMenuID: menuSectionMenuID,
        menuSectionStatus: menuSectionStatus,
        menuSectionDescription: menuSectionDescription,
        menuSectionImage: menuSectionImage,
        menuSectionImageFileName:menuSectionImageFileName,
      });

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Menu Section Updated",
        data: menuSectionTitle,
      };
    },
    updateMenuSectionOrderNo: async (parent, args, context) => {
      const menuSectionID = args.menuSectionOrderUpdateInput.id;
      const menuSectionOrderNo =
        args.menuSectionOrderUpdateInput.menuSectionOrderNo;

      await db.collection("menuSections").doc(menuSectionID).update({
        menuSectionOrderNo: menuSectionOrderNo,
      });

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Menu Section Order Updated",
        data: menuSectionOrderNo,
      };
    },
    deleteMenuSection: async (parent, args, context) => {
      const menuSectionID = args.id;

      await db.collection("menuSections").doc(menuSectionID).delete();

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Menu Section Deleted",
        data: menuSectionID,
      };
    },
  },
};

async function getCount(collname) {
  const coll = await db.collection(collname).get();
  const docums = coll.docs;
  let count = 0;

  for (const doc of docums) {
    count += 1;
  }

  return count;
}
