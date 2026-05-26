const { gql } = require("apollo-server");

const lisanceType = gql`
  type Lisance {
    id: ID!
    lisanceFinishDate: String!
    lisanceStatus: String!
    lisanceNote: String!
    lisanceProduct: Product
    lisanceCustomer: Customer
    swusername: String!
    swuserpass: String!
    lisancePrice: String!
    creatorUser: String!
    createdAt: String
    updatedAt: String
  }
  input LisanceInput {
    id: ID
    lisanceFinishDate: String!
    lisanceStatus: String!
    lisanceNote: String!
    lisanceProduct: ID
    lisanceCustomer: ID
    swusername: String
    swuserpass: String
    lisancePrice: String!
    creatorUser: String!
    createdAt: String
    updatedAt: String
    customerName: String!
    productName: String!
  }
  type LisanceControl {
    lisanceStatus: String!
    lisanceRemainDays: Int!
  }
  input LisanceUserUpdateInput {
    swusername: String!
    swuserpass: String!
  }

  type YemekSepetiList {
    id: ID
    lisanceCustomerName: String
    lisanceCustomerCategoryName: String
    lisanceID: String
    lisanceCustomer: Customer!
  }

  type GetirList{
    id: ID
    lisanceCustomerName: String
    lisanceRestaurantID: String
    lisanceCustomer: Customer!
    lisanceID:String
    lisanceInfo:Lisance!
  }


  union LisanceControlResult = LisanceControl | ResponseAll

  extend type Query {
    getLisances: [Lisance!]!
    getLisanceDeletedCustomers: [Lisance!]!
    getLisancesNearEnd: [Lisance!]!
    getLisance(id: ID!): [Lisance]
    getLisancesByLisanceCode(
      id: ID!
      username: String!
      userpass: String!
    ): LisanceControlResult!

    getLisancesYemekSepeti: [YemekSepetiList]
    getLisanceByProductCode(productCode: String!): [Lisance]
    getLisanceByCustomerCode(customerCode: String!): [Lisance]
    getLisancesGetir: [GetirList] 
    getLisanceByCustomerPhone(customerPhone: String!): [Lisance]
  }

  
  extend type Mutation {
    addLisance(lisanceInput: LisanceInput!): ResponseAll!
    updateLisance(id: ID!, lisanceInput: LisanceInput!): ResponseAll!
    deleteLisance(id: ID!, customerID: ID!): ResponseAll!
    updateLisanceUser(
      id: ID!
      lisanceUserUpdateInput: LisanceUserUpdateInput!
    ): ResponseAll!
    updateLisanceByCustomerCode(
      customerID: ID!
      newLisanceDate: String!
    ): ResponseAll!
    bulkDeleteLisances(ids: [ID!]!): ResponseAll!
    bulkUpdateLisanceStatus(ids: [ID!]!, status: String!): ResponseAll!
  }
`;

module.exports = lisanceType;
