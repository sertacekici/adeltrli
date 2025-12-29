const { gql } = require("apollo-server");

const menuType = gql`
  type Menu {
    id: ID!
    menuName: String!
    menuCompanyID: String!
    menuStatus: Int!
    menuOrderNo: Int!
  }
  input MenuInput {
    id: ID
    menuName: String!
    menuCompanyID: String
    menuStatus: Int
    menuOrderNo: Int
  }

  input MenuOrderUpdateInput {
    id: ID!
    menuOrderNo: Int!
  }

  extend type Query {
    getMenus: [Menu!]!
    getMenuByCompanyID(companyID: String!): [Menu!]!
    getMenuByMenuID(menuID: String!): Menu!
  }

  extend type Mutation {
    addMenu(menuInput: MenuInput!): ResponseAll!
    updateMenuOrderNo(menuOrderUpdateInput: MenuOrderUpdateInput!): ResponseAll!
    updateMenu(id: ID!, menuInput: MenuInput!): ResponseAll!
    deleteMenu(id: ID!): ResponseAll!
  }
`;

module.exports = menuType;