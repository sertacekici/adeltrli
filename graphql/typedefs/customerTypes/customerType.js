const { gql } = require("apollo-server");

const customerType = gql`
  type Customer {
    id: ID!
    customerName: String!
    customerAddress: String!
    customerPhone: String!
    customerStatus: String!
    customerSalesPerson: String!
    customerNote: String!
    customerLisances: [Lisance]
    customerInvoiceName: String
    customerInvoiceAddress: String
    customerInvoiceTaxNumber: String
  }
  input CustomerInput {
    id: ID
    customerName: String!
    customerAddress: String!
    customerPhone: String!
    customerStatus: String!
    customerSalesPerson: String!
    customerNote: String!
    customerLisances: String
    customerInvoiceName: String
    customerInvoiceAddress: String
    customerInvoiceTaxNumber: String
  }
  type ResponseAll{
    success: Boolean!
    message: String!
  }

  extend type Query {
    getCustomers: [Customer!]! 
    getCustomer(id: ID!): Customer! 
  }
  extend type Mutation {
    addCustomer(customerInput: CustomerInput!): ResponseAll!
    updateCustomer(id: ID!, customerInput: CustomerInput!): ResponseAll!
    deleteCustomer(id: ID!): ResponseAll!
  }
`;

module.exports = customerType;