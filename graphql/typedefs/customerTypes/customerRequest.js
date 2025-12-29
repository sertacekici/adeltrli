/* {

burda customerRequest için gerekli olan type'lar tanımlanır.
type'lar tanımlandıktan sonra bunları kullanabilmek için Query ve Mutation'lar tanımlanır.

CsRestoranAdi - CsYetkiliAdi - CsYetkiliTelefon - CsRestoranAdresi - CsTicariUnvan - CsVergiDairesi - CsVergiNumarasi - CsResmiAdres - CsYetkiliEmail
gibi alanlar tanımlanır ve bu alanlar customerRequest için gerekli olan alanlardır.

} */

const { gql } = require("apollo-server");

const CustomerRequestType = gql`

    type CustomerRequest {
        id: ID!
        CsRestoranAdi: String!
        CsYetkiliAdi: String!
        CsYetkiliTelefon: String!
        CsRestoranAdresi: String!
        CsTicariUnvan: String!
        CsVergiDairesi: String!
        CsVergiNumarasi: String!
        CsResmiAdres: String!
        CsYetkiliEmail: String!
    }

    input CustomerRequestInput {
        CsRestoranAdi: String!
        CsYetkiliAdi: String!
        CsYetkiliTelefon: String!
        CsRestoranAdresi: String!
        CsTicariUnvan: String!
        CsVergiDairesi: String!
        CsVergiNumarasi: String!
        CsResmiAdres: String!
        CsYetkiliEmail: String!
    }

    type ResponseAll {
        success: Boolean!
        message: String!
    }

    extend type Query {
        getCustomerRequests: [CustomerRequest!]!
    }

    extend type Mutation {
        addCustomerRequest(customerRequestInput: CustomerRequestInput!): ResponseAll!
        deleteCustomerRequest(id: ID!): ResponseAll!
    }

`;

module.exports = CustomerRequestType;