const { gql } = require("apollo-server");

const ingredientType = gql`
type Ingredient {
    id: ID!
    ingrGroupID: String!
    ingrName: String!
    ingrDescription: String!
    ingrStandartPrice: String!
    ingrPrices: [IngredientPrices!]!
}
type IngredientPrices {
    id: ID!
    ingrGroupID: String!
    ingrSizeID: String!
    ingrSizeName: String!
    ingrPrice: String!
}

input IngredientInput {
    id: ID
    ingrGroupID: String!
    ingrName: String!
    ingrDescription: String!
    ingrStandartPrice: String!
    ingrPrices: [IngredientPricesInput!]!
}

input IngredientPricesInput {
    id: ID
    ingrSizeID: String!
    ingrSizeName: String!
    ingrPrice: String!
}

extend type Query {
    getIngredients(ingrGroupID: ID): [Ingredient!]!
}

extend type Mutation {
    addIngredient(ingredientInput: IngredientInput!): ResponseAll!
    updateIngredient(id: ID!, ingredientInput: IngredientInput!): ResponseAll!
    deleteIngredient(id: ID!): ResponseAll!
}
`;

module.exports = ingredientType;