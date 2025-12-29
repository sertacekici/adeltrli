const { gql } = require("apollo-server");

const ingredientGroupType = gql`
  type IngredientGroup {
    id: ID!
    companyID: String!
    ingrGrpName: String!
    ingrGrpDescription: String!
    ingrGrpShowPrices: String!
    ingrGrpSingleSizeChoice: String!
    ingrGrpSizeGroupID: String
  }
  input IngredientGroupInput {
    id: ID
    companyID: String!
    ingrGrpName: String!
    ingrGrpDescription: String!
    ingrGrpShowPrices: String!
    ingrGrpSingleSizeChoice: String!
    ingrGrpSizeGroupID: String
  }
  extend type Query {
    getIngredientGroups(companyID: ID): [IngredientGroup!]!
  }
  extend type Mutation {
    addIngredientGroup(
      ingredientGroupInput: IngredientGroupInput!
    ): ResponseAll!
    updateIngredientGroup(
      id: ID!
      ingredientGroupInput: IngredientGroupInput!
    ): ResponseAll!
    deleteIngredientGroup(id: ID!): ResponseAll!
  }
`;

module.exports = ingredientGroupType;