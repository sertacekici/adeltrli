const { gql } = require("apollo-server");

const smsUserType = gql`
    type SmsUser {
        id: ID!
        companyname: String!
        managername: String!
        phonenumber: String!
        buyingdate: String!
        totalbuy: Int!
        totalspent: Int!
        username: String!
        userpassword: String!
        userstatus: Int!
        createdAt: String
        updatedAt: String
        smsbalance: Int!
    }
    input SmsUserInput {
        id: ID
        companyname: String!
        managername: String!
        phonenumber: String!
        buyingdate: String!
        totalbuy: Int!
        totalspent: Int!
        username: String
        userpassword: String
        userstatus: Int!
        createdAt: String
        updatedAt: String
        smsbalance: Int
    }
    type SmsUserControl {
        smsUserID: ID!
    }
    union SmsUserControlResult = SmsUserControl | ResponseAll
    extend type Query {
        getSmsUsers: [SmsUser!]!
        getSmsUser(id: ID!): SmsUser!
    }
    extend type Mutation {
        addSmsUser(smsUserInput: SmsUserInput!): SmsUserControlResult!
        updateSmsUser(id: ID!, smsUserInput: SmsUserInput!): ResponseAll!
        deleteSmsUser(id: ID!): ResponseAll!
    }
`;

module.exports = smsUserType;