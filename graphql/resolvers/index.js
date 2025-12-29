const customerResolver = require("./customerResolvers/customerResolver");
const productResolver = require("./productResolvers/productResolve");
const lisanceResolver = require("./lisanceResolvers/lisanceResolve");
const portalUserResolver = require("./portalResolvers/portalResolve");
const smsUserResolver = require("./smsUserResolvers/smsUserResolver");
const companyResolver = require("./companyResolvers/companyResolver");
const menuResolver = require("./menuResolvers/menuResolve");
const menuSectionResolver = require("./menuResolvers/menuSectionResolve");
const mealSizeResolver = require("./productResolvers/mealSizeResolve");
const ingredientGroupResolver = require("./productResolvers/ingredientGroupResolve");
const ingredientResolver = require("./productResolvers/ingredientResolve");
const orderAreaResolver = require("./orderAreaResolvers/orderAreaResolve.js");
const courierResolver = require("./courierResolvers/courierResolve");
const menuProductResolver = require("./productResolvers/menuProductResolve");
const storeResolver = require("./storeResolvers/storeResolver");
const lisanceRequestResolver = require("./lisanceResolvers/lisanceRequests");
const customerRequestResolver = require("./customerResolvers/customerRequestResolver");
const ysChainCodeResolver = require("./dataCollectionResolvers/ysChainCodeResolve");

const rootResolver = [
  customerResolver,
  productResolver,
  lisanceResolver,
  portalUserResolver,
  smsUserResolver,
  companyResolver,
  menuResolver,
  menuSectionResolver,
  mealSizeResolver,
  ingredientGroupResolver,
  ingredientResolver,
  orderAreaResolver,
  courierResolver,
  menuProductResolver,
  storeResolver,
  lisanceRequestResolver,
  customerRequestResolver,
  ysChainCodeResolver,
];

module.exports = rootResolver;
