const {gql} = require("apollo-server");

const lisanceRequestType = gql`
type LisanceRequest {
    id:ID!
    Username: String!
    UserPass: String!
    ProductName: String!
    CustomerName: String!
    LicenseCustomer: String!
    LicenceProduct: String!
    LicenseNote: String!
    Tarih: String
    createdAt: String
    updatedAt: String
}
input LisanceRequestInput {
    id: ID
    Username: String!
    UserPass: String!
    ProductName: String!
    CustomerName: String!
    LicenseCustomer: String!
    LicenceProduct: String!
    LicenseNote: String!
    Tarih: String
    createdAt: String
    updatedAt: String
}

type ResponseAll{
    success: Boolean!
    message: String!
}
extend type Query {
    getLisanceRequests: [LisanceRequest!]!
    getLisanceRequest(id: ID!): LisanceRequest!
}
extend type Mutation {
    addLisanceRequest(lisanceRequestInput: LisanceRequestInput!): ResponseAll!
    updateLisanceRequest(id: ID!, lisanceRequestInput: LisanceRequestInput!): ResponseAll!
    deleteLisanceRequest(id: ID!): ResponseAll!
}
`;

module.exports = lisanceRequestType;