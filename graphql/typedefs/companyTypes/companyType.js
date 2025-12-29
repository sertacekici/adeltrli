const { gql } = require("apollo-server");
const companyType = gql`
  type Company {
    id: ID!
    companyName: String!
    companyAddress: String!
    companyPhone: String!
    companyStatus: String!
    companyCity: String!
    companyCounty: String!
    companyTypeOfBusiness: String!
    companyNote: String!
    companyEmail: String!
    companyPassword: String
    companyActivation: String!
    companyPostalCode: String!
    companyWebSite: String!
    companyManagerName: String!
    companyMenuList: [Menu!]!
    companyUserType: String!
    companyMainCompany: ID
    companyOrderArea: ID
  }
  input CompanyInput {
    id: ID
    companyName: String!
    companyAddress: String
    companyPhone: String
    companyStatus: String
    companyCity: String
    companyCounty: String
    companyTypeOfBusiness: String
    companyNote: String
    companyEmail: String
    companyPassword: String
    companyActivation: String
    companyPostalCode: String
    companyWebSite: String
    companyManagerName: String
    companyUserType: String
    companyMainCompany: ID
    companyOrderArea: ID
  }
  input CompanyPasswordUpdateInput {
    id: ID!
    companyPasswordNew: String!
    companyPasswordOld: String!
  }
  input CompanyForgetPasswordInput {
    companyEmail: String
  }

  type CompanyLoginControl {
    id: ID!
    companyEmail: String!
    companyActivation: String!
    companyName: String!
    companyManagerName: String!
    companyUserType: String!
  }

  type CompanyLoginControlResult {
    success: Boolean!
    message: String!
    token: String!
  }

  union CompanyLoginResult = CompanyLoginControl | CompanyLoginControlResult

  extend type Query {
    getCompanies: [Company]!
    getCompany(id: ID!): Company!
    companyLogin(
      companyEmail: String!
      companyPassword: String!
    ): CompanyLoginResult
    logdedCompany: CompanyLoginResult!
    logoutCompany: CompanyLoginControlResult!
    getCompanyByMainCompany(id: ID!): [Company]!
  }

  extend type Mutation {
    addCompany(companyInput: CompanyInput!): ResponseAll!
    updateCompany(id: ID!, companyInput: CompanyInput!): ResponseAll!
    deleteCompany(id: ID!): ResponseAll!
    updateCompanyPassword(
      companyPasswordUpdateInput: CompanyPasswordUpdateInput!
    ): ResponseAll
    forgetCompanyPassword(
      CompanyForgetPasswordInput: CompanyForgetPasswordInput!
    ): ResponseAll
  }
`;
module.exports = companyType;
