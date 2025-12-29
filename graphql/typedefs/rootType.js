const { gql } = require("apollo-server");

const root = `
type Query {
    root: String
}
type Mutation {
    root: String
}`;

module.exports = root;
