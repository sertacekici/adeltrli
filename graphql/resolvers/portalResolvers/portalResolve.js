const db = require("../../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../fb/config");

module.exports = {
  Query: {
    portalUserList: async () => {
      const portalUserListSnapshot = await db.collection("portalusers").get();
      const portalUserList = [];
      portalUserListSnapshot.forEach((doc) => {
        portalUserList.push({
          id: doc.id,
          portalUserName: doc.data().portalUserName,
          portalUserRole: doc.data().portalUserRole,
          portalUserStatus: doc.data().portalUserStatus,
        });
      });
      return portalUserList;
    },
    login: async (parent, args, context) => {
      const username = args.username;
      const userpass = args.userpass;

      const portalUserSnapshot = db
        .collection("portalusers")
        .where("portalUserName", "==", username)
        .get();

      const portalUserResult = await portalUserSnapshot.then(
        async (snapshot) => {
          if (snapshot.empty) {
            return {
              __typename: "LoginResult",
              success: false,
              message: "Portal User Not Found",
              token: "",
            };
          } else {
            const user = snapshot.docs[0].data();
            const userid = snapshot.docs[0].id;
            const userpassHash = user.portalUserPass;
            const userRole = user.portalUserRole;
            const userStatus = user.portalUserStatus;
            const userpassCompare = await bcrypt.compare(
              userpass,
              userpassHash
            );

            if (userpassCompare) {
              const token = jwt.sign(
                {
                  userid: userid,
                  username: username,
                  userpass: userpass,
                  userrole: userRole,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1h",
                }
              );

              context.res.status(200).cookie("_usertoken", token, {
                httpOnly: true,
                maxAge: 3600000,
                secure: true,
                sameSite: "none",
              });

              return {
                __typename: "PortalUserControl",
                portalUserName: username,
                portalUserRole: userRole,
                portalUserStatus: userStatus,
              };
            } else {
              return {
                __typename: "LoginResult",
                success: false,
                message: "Password is incorrect",
                token: "",
              };
            }
          }
        }
      );

      return portalUserResult;
    },
    logdedUser: async (parent, args, context) => {
      const token = context.req.cookies._usertoken;

      if (!token || token === "null") {
        return {
          __typename: "LoginResult",
          success: false,
          message: "Token is not provided",
          token: "",
        };
      }

      try {
        
        decodedToken = jwt.verify(token, config.jwtp);

      } catch (err) {
        return {
          __typename: "LoginResult",
          success: false,
          message: "Token is not provided",
          token: "",
        };
      }
      if (!decodedToken) {
        return {
          __typename: "LoginResult",
          success: false,
          message: "Token is not provided",
          token: "",
        };
      }

      const username = decodedToken.username;
      const userpass = decodedToken.userpass;

      const portalUserSnapshot = await db
        .collection("portalusers")
        .where("portalUserName", "==", username)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            return {
              __typename: "LoginResult",
              success: false,
              message: "Portal User Not Found",
              token: "",
            };
          } else {
            const user = snapshot.docs[0].data();
            const _username = snapshot.docs[0].data().portalUserName;
            const _userrole = snapshot.docs[0].data().portalUserRole;
            const _userstatus = snapshot.docs[0].data().portalUserStatus;
            const userid = snapshot.docs[0].id;
            const userpassHash = user.portalUserPass;
            const userpassCompare = bcrypt.compare(userpass, userpassHash);

            if (_userstatus === "0") {
              return {
                __typename: "LoginResult",
                success: false,
                message: "User is not active",
                token: "",
              };
            }

            if (userpassCompare) {
              const token = jwt.sign(
                {
                  userid: userid,
                  username: username,
                  userpass: userpass,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1h",
                }
              );

              context.res.status(200).cookie("_usertoken", token, {
                httpOnly: true,
                maxAge: 3600000,
                secure: true,
                sameSite: "none",
              });

              return {
                __typename: "PortalUserControl",
                portalUserName: _username,
                portalUserRole: _userrole,
                portalUserStatus: _userstatus,
              };
            } else {
              return {
                __typename: "LoginResult",
                success: false,
                message: "Password is incorrect",
                token: "",
              };
            }
          }
        });

      return portalUserSnapshot;
    },
    logOutUser: async (parent, args, context) => {
      const token = "logouted";

      context.res.status(200).cookie("_usertoken", token, {
        httpOnly: true,
        maxAge: 1,
        secure: true,
        sameSite: "none",
      });

      return {
        __typename: "LoginResult",
        success: true,
        message: "Logout Successful",
        token: "",
      };
    },
  },
  Mutation: {
    addPortalUser: async (parent, args, context) => {
      const portalUserName = args.portalUserInput.portalUserName;
      const portalUserPass = args.portalUserInput.portalUserPass;
      const portalUserStatus = args.portalUserInput.portalUserStatus;
      const portalUserRole = args.portalUserInput.portalUserRole;

      const portalUserSnapshot = db
        .collection("portalusers")
        .where("portalUserName", "==", portalUserName)
        .get();

      const portalUserResult = await portalUserSnapshot.then(
        async (snapshot) => {
          if (snapshot.empty) {
            const portalUserPassHash = await bcrypt.hash(portalUserPass, 12);

            const portalUser = {
              portalUserName: portalUserName,
              portalUserPass: portalUserPassHash,
              portalUserStatus: portalUserStatus,
              portalUserRole: portalUserRole,
            };

            const snapshotPortal = db.collection("portalusers");

            const addID = await snapshotPortal
              .add(portalUser)
              .then((result) => {
                const resultID = result.id;
                return resultID;
              });

            return {
              success: true,
              message: "Portal User Added",
            };
          } else {
            return {
              success: false,
              message: "Portal User Already Exists",
            };
          }
        }
      );

      return portalUserResult;
    },
    updatePortalUser: async (parent, args, context) => {
      const portalUserID = args.id;
      const portalUserName = args.portalUserInput.portalUserName;
      const portalUserPass = args.portalUserInput.portalUserPass;
      const portalUserStatus = args.portalUserInput.portalUserStatus;
      const portalUserRole = args.portalUserInput.portalUserRole;



/*       const portalUserSnapshot = await db
        .collection("portalusers")
        .where("portalUserName", "==", portalUserName)
        .get(); */
        const portalUserPassHash = await bcrypt.hash(portalUserPass, 12);
        
        const portalUser = {
          portalUserName: portalUserName,
          portalUserPass: portalUserPassHash,
          portalUserStatus: portalUserStatus,
          portalUserRole: portalUserRole,
        };


   

         await db.collection("portalusers").doc(portalUserID).update(portalUser);

         return {
          __typename: "ResponseAll",
          success: true,
          message: "Portal User Updated",
        };
      /* const portalUserResult = await portalUserSnapshot.then(
        async (snapshot) => {
          if (snapshot.empty) {
          

          

            const portalUserUpdate = db
              .collection("portalusers")
              .doc(portalUserID)
              .update(portalUser);

            return {
              __typename: "ResponseAll",
              success: true,
              message: "Portal User Updated",
            };
          } else {
            return {
              __typename: "ResponseAll",
              success: false,
              message: "Portal User Already Exists",
            };
          }
        }
      );

      return portalUserResult; */
    },
    deletePortalUser: async (parent, args, context) => {
      const portalUserID = args.id;

      const portalUserDelete = db
        .collection("portalusers")
        .doc(portalUserID)
        .delete();

      return {
        success: true,
        message: "Portal User Deleted",
      };
    },
  },
};
