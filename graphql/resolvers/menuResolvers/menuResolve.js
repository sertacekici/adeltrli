const db = require("../../../db");
const config = require("../../../fb/config");
const { FieldValue } = require("firebase-admin/firestore");

module.exports = {
  Query: {
    getMenus: async () => {
      const menuListSnapshot = await db.collection("menus").get();
      const menuList = [];
      menuListSnapshot.forEach((doc) => {
        menuList.push({
          id: doc.id,
          menuName: doc.data().menuName,
          menuCompanyID: doc.data().menuCompanyID,
          menuStatus: doc.data().menuStatus,
          menuOrderNo: doc.data().menuOrderNo,
        });
      });
      return menuList;
    },
    getMenuByCompanyID: async (parent, args, context) => {
      const menuListSnapshot = await db
        .collection("menus")
        .where("menuCompanyID", "==", args.companyID)
        .get();
      const menuList = [];
      menuListSnapshot.forEach((doc) => {
        menuList.push({
          id: doc.id,
          menuName: doc.data().menuName,
          menuCompanyID: doc.data().menuCompanyID,
          menuStatus: doc.data().menuStatus,
          menuOrderNo: doc.data().menuOrderNo,
        });
      });
      return menuList;
    },
    getMenuByMenuID: async (parent, args, context) => {
      const menuid = args.menuID;
 
      const snapshot = db.collection("menus").doc(menuid);
      


      const sendResult = await snapshot.get().then(async (documentSnapshot) => {
      
        if (documentSnapshot.exists) {
       
          console.log("menuid")
     
          let menu = {
            id: documentSnapshot.id,
            menuName: documentSnapshot.data().menuName,
            menuStatus: documentSnapshot.data().menuStatus,
          };

          console.log(menu)
          return menu;
        } else {
          return "Menu Not Found";
        } 
      });
      return sendResult;
    },
  },
  Mutation: {
    addMenu: async (parent, args, context) => {
      console.log("object")
      const menuName = args.menuInput.menuName;
      const menuCompanyID = args.menuInput.menuCompanyID;
      const menuStatus = args.menuInput.menuStatus;

      const orderNo = await getCount("menus");

      const menuListSnapshot = await db
        .collection("menus")
        .where("menuCompanyID", "==", menuCompanyID)
        .where("menuName", "==", menuName)
        .get();

      if (menuListSnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Menu Already Exists",
          data: menuName,
        };
      }
      const menu = {
        menuName: menuName,
        menuCompanyID: menuCompanyID,
        menuStatus: menuStatus,
        menuOrderNo: orderNo,
      };

      const addedMenuID = await db
        .collection("menus")
        .add(menu)
        .then((docRef) => {
          return docRef.id;
        });

      const companysnapshot = await db
        .collection("companies")
        .doc(menuCompanyID)
        .get();

      companysnapshot.ref.update({
        companyMenuList: FieldValue.arrayUnion(addedMenuID),
      });

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Menu Added",
        data: menu,
      };
    },
    updateMenu: async (parent, args, context) => {
      const menuID = args.id;
      const menuName = args.menuInput.menuName;
      const menuStatus = args.menuInput.menuStatus;

      const menu = {
        menuName: menuName,
        menuStatus: menuStatus,
      };

      await db.collection("menus").doc(menuID).update(menu);

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Menu Updated",
        data: menu,
      };
    },
    deleteMenu: async (parent, args, context) => {
      const menuID = args.id;
      const menuSnapshot = await db.collection("menus").doc(menuID).get();
      if (menuSnapshot.exists) {
        const menuCompanyID = menuSnapshot.data().menuCompanyID;

        await db.collection("menus").doc(menuID).delete();

        const companysnapshot = await db
          .collection("companies")
          .doc(menuCompanyID)
          .get();

        await companysnapshot.ref.update({
          companyMenuList: FieldValue.arrayRemove(menuID),
        });

        return {
          __typename: "ResponseAll",
          success: true,
          message: "Menu Deleted",
          data: menuID,
        };
      } else {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Menu Not Found",
          data: menuID,
        };
      }
    },
    updateMenuOrderNo: async (parent, args, context) => {
      const menuID = args.menuOrderUpdateInput.id;
      const menuOrderNo = args.menuOrderUpdateInput.menuOrderNo;

      const menu = {
        menuOrderNo: menuOrderNo,
      };

      await db.collection("menus").doc(menuID).update(menu);

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Menu Order No Updated",
        data: menu,
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
