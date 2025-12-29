const { gql } = require("apollo-server");

const portalUserType = gql`
  type PortalUser {
    id: ID!
    portalUserName: String!
    portalUserPass: String!
    portalUserRole: String!
    portalUserStatus: String!
  }
  type PortalUserList {
    id: ID!
    portalUserName: String!
    portalUserRole: String!
    portalUserStatus: String!
  }
  input PortalUserInput {
    id: ID
    portalUserName: String!
    portalUserPass: String!
    portalUserRole: String!
    portalUserStatus: String!
  }
  type PortalUserControl {
    id: ID!
    portalUserName: String!
    portalUserRole: String!
    portalUserStatus: String!
  }
  type LoginResult {
    success: Boolean!
    message: String!
    token: String!
  }

  union PortalUserControlResult = PortalUserControl | LoginResult
  
  extend type Query {
    portalUserList: [PortalUserList]
    login(username: String!, userpass: String!): PortalUserControlResult!
    logdedUser: PortalUserControlResult!
    logOutUser: LoginResult!
  }
  extend type Mutation {
    addPortalUser(portalUserInput: PortalUserInput!): ResponseAll!
    updatePortalUser(id: ID!, portalUserInput: PortalUserInput!): ResponseAll!
    deletePortalUser(id: ID!): ResponseAll!
  }
`;
module.exports = portalUserType;
