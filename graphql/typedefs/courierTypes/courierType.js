const { gql } = require("apollo-server");

const courierType = gql`
  type Courier {
    id: ID!
    companyID: ID!
    courierName: String!
    courierPhone: String!
    courierNote: String!
    EmergencyContact: String!
    EmergencyContactPhone: String!
    courierStatus: String!
    courierUsername: String!
    courierPassword: String!
    courierOrderArea: [OrderArea]
  }
  input CourierInput {
    id: ID
    companyID: ID!
    courierName: String!
    courierPhone: String!
    courierNote: String!
    EmergencyContact: String!
    EmergencyContactPhone: String!
    courierStatus: String!
    courierUsername: String
    courierPassword: String
    courierOrderArea: [ID!]!

  }
  extend type Query {
    getCouriers(companyID: ID!): [Courier]
  }
  extend type Mutation {
    addCourier(courierInput: CourierInput!): ResponseAll!
    updateCourier(id: ID!, courierInput: CourierInput!): ResponseAll!
    deleteCourier(id: ID!): ResponseAll!
  }
`;

module.exports = courierType;
