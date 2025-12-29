const { gql } = require("apollo-server");

const menuSectionType = gql`
  type MenuSection {
    id: ID!
    menuSectionTitle: String!
    menuSectionMenuID: String!
    menuSectionStatus: Int!
    menuSectionOrderNo: Int!
    menuSectionDescription: String!
    menuSectionImage: String!
    menuSectionImageFileName: String!
  }
  input MenuSectionInput {
    id: ID
    menuSectionTitle: String!
    menuSectionMenuID: String!
    menuSectionStatus: Int
    menuSectionOrderNo: Int
    menuSectionDescription: String!
    menuSectionImage: String!
    menuSectionImageFileName: String!
  }

  input MenuSectionOrderUpdateInput {
    id: ID!
    menuSectionOrderNo: Int!
  }

  extend type Query {
    getMenuSectionsByMenuID(menuID: String!): [MenuSection!]!
  }

  extend type Mutation {
    addMenuSection(menuSectionInput: MenuSectionInput!): ResponseAll!
    updateMenuSectionOrderNo(
      menuSectionOrderUpdateInput: MenuSectionOrderUpdateInput!
    ): ResponseAll!
    updateMenuSection(
      id: ID!
      menuSectionInput: MenuSectionInput!
    ): ResponseAll!
    deleteMenuSection(id: ID!): ResponseAll!
  }
`;
module.exports = menuSectionType;
