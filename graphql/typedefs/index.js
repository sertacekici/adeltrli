const { gql } = require("apollo-server");
const root = require("./rootType");
const customerType = require("./customerTypes/customerType");
const productType = require("./productTypes/productType");
const lisanceType = require("./lisanceTypes/lisanceType");
const portalUserType = require("./portaluserTypes/portaluserType");
const smsUserType = require("./smsUserTypes/smsUserTypes");
const companyType = require("./companyTypes/companyType");
const menuType = require("./menuTypes/menuType");
const menuSectionType = require("./menuTypes/menuSectionType");
const menuProductType = require("./productTypes/menuProductType");
const mealSizeType = require("./productTypes/mealSizeType");
const ingredientGroupType = require("./productTypes/ingredientGroupType");
const ingredientType = require("./productTypes/ingredientType");
const orderAreaType = require("./orderAreasTypes/orderAreaType");
const courierType = require("./courierTypes/courierType");
const storeType = require("./storeTypes/storeType");
const lisanceRequestType = require("./lisanceTypes/lisanceRequestType");
const CustomerRequestType = require("./customerTypes/customerRequest");
const ysChainCodeListType = require("./dataCollectionTypes/ysChainCodeListType");

const schemaArray = [
  root,
  customerType,
  productType,
  lisanceType,
  portalUserType,
  smsUserType,
  companyType,
  menuType,
  menuSectionType,
  mealSizeType,
  menuProductType,
  ingredientGroupType,
  ingredientType,
  orderAreaType,
  courierType,
  storeType,
  lisanceRequestType,
  CustomerRequestType,
  ysChainCodeListType,
];

module.exports = schemaArray;
