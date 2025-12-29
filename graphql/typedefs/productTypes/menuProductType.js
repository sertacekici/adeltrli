const { gql } = require("apollo-server");

const menuProductType = gql`
  type MenuProduct {
    id: ID!
    productName: String!
    productDescription: String!
    productPrice: String!
    productStatus: String!
    productImageURL: String!
    productOrderNo: Int!
    productMenuSectionID: String!
    productMenuID: String!
    productPrices: [MenuProductPrices!]!
    productIngredientGroupID: String!
  }
  type MenuProductPrices {
    id: ID!
    productSizeID: String!
    productSizeName: String!
    productPrice: String!
  }
  input MenuProductInput {
    id: ID
    productName: String!
    productDescription: String!
    productPrice: String!
    productStatus: String!
    productImageURL: String!
    productOrderNo: Int!
    productMenuSectionID: String!
    productMenuID: String!
    productPrices: [MenuProductPricesInput!]!
    productIngredientGroupID: String!
  }
  input MenuProductPricesInput {
    id: ID
    productSizeID: String!
    productSizeName: String!
    productPrice: String!
  }
  input MenuProductOrderUpdateInput {
    id: ID!
    productOrderNo: Int!
  }
  extend type Query {
    getMenuProducts: [MenuProduct!]!
    getMenuProduct(id: ID!): MenuProduct!
    GetMenuProductsByMenuID(menuID: ID!): [MenuProduct!]!
  }
  extend type Mutation {
    addMenuProduct(productInput: MenuProductInput!): ResponseAll!
    updateMenuProduct(id: ID!, productInput: MenuProductInput!): ResponseAll!
    updateMenuProductOrderNo(
      productOrderUpdateInput: MenuProductOrderUpdateInput!
    ): ResponseAll!
    deleteMenuProduct(id: ID!): ResponseAll!
  }
`;

module.exports = menuProductType;
