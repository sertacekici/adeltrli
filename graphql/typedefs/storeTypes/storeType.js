const { gql } = require("apollo-server");

const storeType = gql`
  type Store {
    id: ID!
    companyID: String!
    storeName: String!
    storeSlogan: String!
    storeAddress: String!
    storeLatitude: String!
    storeLongitude: String!
    storeCity: String!
    storeState: String!
    storeCurrency: String!
    storeZip: String!
    storePhone: String!
    storeEmail: String!
    storeWebsite: String!
    storeLogoURL: String!
    storeBackgroudURL: String!
    storeHours: [StoreHours!]!
    storeMenuID: String!
    storeMenu: Menu!
    storeActive: String!
  }
  type StoreHours {
    id: ID
    dayOfWeek: String!
    openTime: String!
    closeTime: String!
    fullClose: String!
  }
  input StoreInput {
    id: ID
    companyID: String!
    storeName: String!
    storeSlogan: String!
    storeAddress: String!
    storeLatitude: String!
    storeLongitude: String!
    storeCity: String!
    storeState: String!
    storeCurrency: String!
    storeZip: String!
    storePhone: String!
    storeWebsite: String!
    storeEmail: String!
    storeLogoURL: String!
    storeBackgroudURL: String!
    storeHours: [StoreHoursInput!]!
    storeMenuID: String!
    storeMenu: MenuInput!
    storeActive: String!
  }
  input StoreHoursInput {
    id: ID
    dayOfWeek: String!
    openTime: String!
    closeTime: String!
    fullClose: String!
  }
  extend type Query {
    getStoresByCompanyID(companyID: ID!): [Store]
    getStoreByStoreID(storeID: ID!): Store
  }
  extend type Mutation {
    addStore(storeInput: StoreInput!): ResponseAll!
    updateStore(id: ID!, storeInput: StoreInput!): ResponseAll!
    deleteStore(id: ID!): ResponseAll!
  }
`;

module.exports = storeType;
