const { gql } = require("apollo-server");

const MealSizeType = gql`
  type MealSizes {
    id: ID!
    mealSizeName: String!
    companyID: String!
    sizeOptions: [MealSizeOptions!]!
  }
  type MealSizeOptions {
    id: ID
    mealSizeOptionName: String!
    mealSizeOptionDefaultPrice: String!
  }
  input MealSizesInput {
    id: ID
    mealSizeName: String!
    companyID: String!
    sizeOptions: [MealSizeOptionsInput!]!
  }
  input MealSizeOptionsInput {
    id: ID
    mealSizeOptionName: String!
    mealSizeOptionDefaultPrice: String!
  }

  extend type Query {
    getMealSizes(companyID: ID): [MealSizes!]!
  }
  extend type Mutation {
    addMealSize(mealSizeInput: MealSizesInput!): ResponseAll!
    updateMealSize(id: ID!, mealSizeInput: MealSizesInput!): ResponseAll!
    deleteMealSize(id: ID!): ResponseAll!
  }
`;

module.exports = MealSizeType;
