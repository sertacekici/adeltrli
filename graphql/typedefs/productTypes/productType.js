const { gql } = require("apollo-server");

const productType = gql`
  type Product {
    id: ID!
    productName: String!
    productDescription: String!
    productPrice: String!
    productStatus: String!
  }
  input ProductInput {
    id: ID
    productName: String!
    productDescription: String!
    productPrice: String!
    productStatus: String!
  }
  input ProductOrderUpdateInput {
    id: ID!
    productOrderNo: Int!
  }
  extend type Query {
    getProducts: [Product!]!
    getProduct(id: ID!): Product!
  }
  extend type Mutation {
    addProduct(productInput: ProductInput!): ResponseAll!
    updateProduct(id: ID!, productInput: ProductInput!): ResponseAll!
    updateProductOrderNo(
      productOrderUpdateInput: ProductOrderUpdateInput!
    ): ResponseAll!
    deleteProduct(id: ID!): ResponseAll!
  }
`;

module.exports = productType;
