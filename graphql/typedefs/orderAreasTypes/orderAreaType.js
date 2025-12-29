const { gql } = require("apollo-server");

const orderAreaType = gql`
    type OrderArea {
        id: ID!
        companyID: ID!
        orderAreaName: String!
        subOrderArea:[SubOrderArea!]!
    }
    type SubOrderArea {
        id: ID!
        subOrderAreaName: String!
    }

    input OrderAreaInput {
        id: ID
        companyID: ID!
        orderAreaName: String!
        subOrderArea:[SubOrderAreaInput!]!
    }

    input SubOrderAreaInput {
        id: ID
        subOrderAreaName: String!
    }

    extend type Query {
        getOrderAres(companyID: ID!): [OrderArea]
    }

    extend type Mutation {
        addOrderArea(orderAreaInput: OrderAreaInput!): ResponseAll!
        updateOrderArea(id: ID!, orderAreaInput: OrderAreaInput!): ResponseAll!
        deleteOrderArea(id: ID!): ResponseAll!
    }
`;

module.exports = orderAreaType;
