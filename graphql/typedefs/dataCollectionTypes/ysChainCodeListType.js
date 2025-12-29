const { gql } = require("apollo-server-express");

const ysChainCodeListType = gql`
  type YsChainCode {
    id: ID!
    remoteID: String!
    chainCode: String!
    restaurantName: String!
    platformID: String
  }

  input YsChainCodeInput {
    id: ID
    remoteID: String!
    chainCode: String!
    restaurantName: String!
  }

  extend type Query {
    getYsChainCodes: [YsChainCode]
    getYsChainCodeByRemoteID(remoteID: String!): YsChainCode
  }

  extend type Mutation {
    addYsChainCode(ysChainCodeInput: YsChainCodeInput!): ResponseAll!
    updateYsChainCode(
      id: ID!
      ysChainCodeInput: YsChainCodeInput!
    ): ResponseAll!
    deleteYsChainCode(id: ID!): ResponseAll!
  }
`;

module.exports = ysChainCodeListType;