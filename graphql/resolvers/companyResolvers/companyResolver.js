const db = require("../../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../fb/config");
const generator = require("generate-password");
var axios = require("axios");

module.exports = {
  Query: {
    getCompanies: async () => {
      const companyListSnapshot = await db.collection("companies").get();

      const companyList = [];
      companyListSnapshot.forEach((doc) => {
        companyList.push({
          id: doc.id,
          companyName: doc.data().companyName,
          companyAddress: doc.data().companyAddress,
          companyPhone: doc.data().companyPhone,
          companyStatus: doc.data().companyStatus,
          companyCity: doc.data().companyCity,
          companyCounty: doc.data().companyCounty,
          companyTypeOfBusiness: doc.data().companyTypeOfBusiness,
          companyNote: doc.data().companyNote,
          companyEmail: doc.data().companyEmail,
          companyStatus: doc.data().companyStatus,
          companyPostalCode: doc.data().companyPostalCode,
          companyWebSite: doc.data().companyWebSite,
          companyManagerName: doc.data().companyManagerName,
          companyActivation: doc.data().companyActivation,
          companyUserType: doc.data().companyUserType,
          companyMainCompany: doc.data().companyMainCompany,
          companyOrderArea: doc.data().companyOrderArea,
        });
      });
      return companyList;
    },
    getCompany: async (parent, args) => {
      const companySnapshot = await db
        .collection("companies")
        .doc(args.id)
        .get();
      const company = companySnapshot.data();

      companyData = {
        id: companySnapshot.id,
        companyName: company.companyName,
        companyAddress: company.companyAddress,
        companyPhone: company.companyPhone,
        companyStatus: company.companyStatus,
        companyCity: company.companyCity,
        companyCounty: company.companyCounty,
        companyTypeOfBusiness: company.companyTypeOfBusiness,
        companyNote: company.companyNote,
        companyEmail: company.companyEmail,
        companyPassword: company.companyPassword,
        companyStatus: company.companyStatus,
        companyPostalCode: company.companyPostalCode,
        companyWebSite: company.companyWebSite,
        companyManagerName: company.companyManagerName,
        companyActivation: company.companyActivation,
        companyUserType: company.companyUserType,
        companyMainCompany: company.companyMainCompany,
        companyOrderArea: company.companyOrderArea,
      };
      return { ...companyData };
    },
    companyLogin: async (parent, args, context) => {
      const companyEmail = args.companyEmail;
      const companyPassword = args.companyPassword;

      const companySnapshot = await db
        .collection("companies")
        .where("companyEmail", "==", companyEmail)
        .get();
      if (companySnapshot.empty) {
        return {
          __typename: "CompanyLoginControlResult",
          success: false,
          message: "Company not found",
          token: "",
        };
      }
      const company = companySnapshot.docs[0].data();
      const companyId = companySnapshot.docs[0].id;
      const companyPasswordHash = company.companyPassword;
      const companyActivation = company.companyActivation;

      const isPasswordValid = await bcrypt.compare(
        companyPassword,
        companyPasswordHash
      );
      if (!isPasswordValid) {
        return {
          __typename: "CompanyLoginControlResult",
          success: false,
          message: "Password is incorrect",
          token: "",
        };
      }
      if (companyActivation === "false") {
        return {
          __typename: "CompanyLoginControlResult",
          success: false,
          message: "Company is not activated",
          token: "",
        };
      }

      const token = jwt.sign(
        {
          id: companyId,
          email: companyEmail,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      context.res.status(200).cookie("_cpx", token, {
        httpOnly: true,
        maxAge: 36000000,
        secure: true,
        sameSite: "None",
      });

      return {
        __typename: "CompanyLoginControlResult",
        success: true,
        message: "Login successful",
        token: token,
      };
    },
    logdedCompany: async (parent, args, context) => {
      const token = context.req.cookies._cpx;

      if (!token || token === "null") {
        return {
          __typename: "CompanyLoginControlResult",
          success: false,
          message: "No token provided",
          token: "",
        };
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const companySnapshot = await db
          .collection("companies")
          .doc(decoded.id)
          .get();
        const company = companySnapshot.data();

        const companyData = {
          id: companySnapshot.id,
          companyName: company.companyName,
          companyEmail: company.companyEmail,
          companyPostalCode: company.companyPostalCode,
          companyWebSite: company.companyWebSite,
          companyManagerName: company.companyManagerName,
          companyActivation: company.companyActivation,
          companyUserType: company.companyUserType,
        };

        return {
          __typename: "CompanyLoginControl",
          id: companyData.id,
          companyEmail: companyData.companyEmail,
          companyActivation: companyData.companyActivation,
          companyName: companyData.companyName,
          companyManagerName: company.companyManagerName,
          companyUserType: company.companyUserType,
        };
      } catch (err) {
        return {
          __typename: "CompanyLoginControlResult",
          success: false,
          message: "Invalid token",
          token: "",
        };
      }
    },
    logoutCompany: async (parent, args, context) => {
      context.res.clearCookie("_cpx");
      const token = "";
      context.res.status(200).cookie("_cpx", token, {
        httpOnly: true,
        maxAge: 1,
        secure: true,
        sameSite: "none",
      });

      return {
        __typename: "CompanyLoginControlResult",
        success: true,
        message: "Logout successful",
        token: "",
      };
    },
    getCompanyByMainCompany: async (parent, args) => {
      const companySnapshot = await db
        .collection("companies")
        .where("companyMainCompany", "==", args.id)
        .get();

      const companyList = [];
      companySnapshot.forEach((doc) => {
        companyList.push({
          id: doc.id,
          companyName: doc.data().companyName,
          companyAddress: doc.data().companyAddress,
          companyPhone: doc.data().companyPhone,
          companyStatus: doc.data().companyStatus,
          companyCity: doc.data().companyCity,
          companyCounty: doc.data().companyCounty,
          companyTypeOfBusiness: doc.data().companyTypeOfBusiness,
          companyNote: doc.data().companyNote,
          companyEmail: doc.data().companyEmail,
          companyStatus: doc.data().companyStatus,
          companyPostalCode: doc.data().companyPostalCode,
          companyWebSite: doc.data().companyWebSite,
          companyManagerName: doc.data().companyManagerName,
          companyActivation: doc.data().companyActivation,
          companyUserType: doc.data().companyUserType,
          companyMainCompany: doc.data().companyMainCompany,
          companyOrderArea: doc.data().companyOrderArea,
        });
      });
      return companyList;
    },
  },

  Company: {
    companyMenuList: async (parent, args) => {
      const snapshot = await db
        .collection("menus")
        .where("menuCompanyID", "==", parent.id)
        .get();

      let menus = [];
      snapshot.forEach((doc) => {
        menus.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return menus;
    },
  },

  Mutation: {
    addCompany: async (parent, args) => {
      const {
        companyName,
        companyAddress,
        companyPhone,
        companyStatus,
        companyCity,
        companyCounty,
        companyTypeOfBusiness,
        companyNote,
        companyEmail,
        companyPassword,
        companyActivation,
        companyPostalCode,
        companyWebSite,
        companyManagerName,
        companyUserType,
        companyMainCompany,
        companyOrderArea,
      } = args.companyInput;

      console.log(companyUserType, companyMainCompany, companyOrderArea);

      const hashedPassword = await bcrypt.hash(companyPassword, 10);
      const newCompany = {
        companyName,
        companyAddress,
        companyPhone,
        companyStatus,
        companyCity,
        companyCounty,
        companyTypeOfBusiness,
        companyNote,
        companyEmail,
        companyPassword: hashedPassword,
        companyActivation,
        companyPostalCode,
        companyWebSite,
        companyManagerName,
        companyUserType,
        companyMainCompany,
        companyOrderArea,
      };

      const companySnapshot = await db
        .collection("companies")
        .where("companyEmail", "==", companyEmail)
        .get();
      if (companySnapshot.docs.length > 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "This email is already in use. Please try another one.",
        };
      }

      const companyRef = await db.collection("companies").add(newCompany);

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Company added successfully",
      };
    },
    updateCompany: async (parent, args) => {
      const {
        companyName,
        companyAddress,
        companyPhone,
        companyStatus,
        companyCity,
        companyCounty,
        companyTypeOfBusiness,
        companyNote,
        companyActivation,
        companyPostalCode,
        companyWebSite,
        companyManagerName,
        updateCompanyId,
        companyMainCompany,
        companyOrderArea,
      } = args.companyInput;

      const updatedCompany = {
        companyName,
        companyAddress,
        companyPhone,
        companyStatus,
        companyCity,
        companyCounty,
        companyTypeOfBusiness,
        companyNote,
        companyActivation,
        companyPostalCode,
        companyWebSite,
        companyManagerName,
        companyMainCompany,
        companyOrderArea,
      };

      const result = await db
        .collection("companies")
        .doc(args.id)
        .update(updatedCompany);

      return {
        __typename: "ResponseAll",
        success: true,
        message: "Company update successfully",
      };
    },
    updateCompanyPassword: async (parent, args) => {
      const { id, companyPasswordNew, companyPasswordOld } =
        args.companyPasswordUpdateInput;

      const hashedPassword = await bcrypt.hash(companyPasswordNew, 10);

      const companySnapshot = await db.collection("companies").doc(id).get();
      const company = companySnapshot.data();

      if (company === undefined || company === null) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Company Not Found",
        };
      }

      if (company.companyPassword !== companyPasswordOld) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "Password cannot be changed. Please try again.",
        };
      }

      const updatedCompany = {
        companyPassword: hashedPassword,
      };

      await db.collection("companies").doc(id).update(updatedCompany);
      const updatedCompanyWithId = {
        ...updatedCompany,
        id,
      };
      return {
        __typename: "ResponseAll",
        success: false,
        message: "Password updated successfully",
      };
    },

    forgetCompanyPassword: async (parent, args) => {
      const { companyEmail } = args.CompanyForgetPasswordInput;
      const companySnapshot = await db
        .collection("companies")
        .where("companyEmail", "==", companyEmail)
        .get();
      if (companySnapshot.docs.length === 0) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "User not found",
        };
      }

      if (!companySnapshot) {
        return {
          __typename: "ResponseAll",
          success: false,
          message: "User not found",
        };
      }

      var password = generator.generate({
        length: 10,
        numbers: true,
      });
      const hashedPassword = await bcrypt.hash(password, 10);

      const companyId = companySnapshot.docs[0].id;

      const newLink = `https://admin.siparisrobotu.com/renewpw/?cp=${companyId}&xp=${hashedPassword}`;

      var data = JSON.stringify({
        email: "sertacekici@gmail.com",
        useremail: companyEmail,
        subject: "Password Reset",
        text: newLink,
      });

      var config = {
        method: "post",
        url: "https://adelemailservice.herokuapp.com/forgetpassword",
        headers: {
          Authorization:
            "Basic RDJFajRGZ3lXVWlkR2xMVk5lN0V3OlBnNWFiVFJKeGsySVJIbUhUbHVmUQ==",
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          //console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });

      const updatedCompany = {
        companyPassword: hashedPassword,
      };
      await db.collection("companies").doc(companyId).update(updatedCompany);

      return {
        __typename: "ResponseAll",
        success: true,
        message: "User password renew link has been sent to user email.",
      };
    },

    deleteCompany: async (parent, args) => {
      await db.collection("companies").doc(args.id).delete();
      return {
        __typename: "ResponseAll",
        success: true,
        message: "Company Successfully Deleted",
      };
    },
  },
};
