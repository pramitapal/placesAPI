// BuildSchema is a function that takes a javascript template literal string to define our schema
const { buildSchema } = require("graphql"); // will genetate graphql schema

module.exports = buildSchema(`
    type Login {
        _id: ID!
        token: String!
        email: String!
        status: Boolean!
        auth_role: String!
    }

    type Validate {
        _id: ID!
        email: String!
        exp: String!
        auth_role: String!
        scope:[String!]!
    }

    input LoginInput {
        cn_token: String!
        pay_ent_pass: String!
    }

    input ValidateInput {
        token: String!
    }

    input ApplicationInput {
        user: String
        profile_name: String
        company_name: String
        category: String
        profession: String
        email: String
        website: String
        willing_to_travel: Boolean
        profile_tagline: String
        bio: String
        image_sl: String
        phone_number: String
        social_media_profile: String
    }
    enum Role{
        user
        admin
    }
  
    type User{
        id:ID!
        uuid: String!
        auth_role: Role!
        email: String!
        scope: [String!]
    }
  
     type Coordinate{
      type: String!
      coordinates: [String!]
     }
  
     type Address{
      city: String!
      state: String!
      country: String!
      streetName: String!
      addressLine_line1: String
      addressLine_line2: String
      zip_code: String
      location: Coordinate!
     }
  
     enum StatusType{
      under_review
      need_user_input
      approved
      rejected
     }

     type ApplicationStatus{
        status_type: StatusType
        commment: String
     }
  
     type Application{
        _id: ID
      user: String
      cop_id: String
      profile_name: String
      company_name: String
      email: String
      profile_heroImage: String
      category: String
      profession: String
      phone_number: String
      social_media_profile: String
      website: String
      willing_to_travel: Boolean
      remote_location: [String]
      profile_tagline: String
      bio: String
      image_sl: [String]
      company_address: Address
      application_status: ApplicationStatus
     }

     type Applications{
         user:User
         application: Application
     }
  

    type RootQuery {
        validate(validateInput: ValidateInput): Validate!
        fetchApplication(id:ID!):Application
        fetchAllApplications:[Applications]
    }

    type RootMutation {
        login(loginInput: LoginInput): Login
        createApplication(applicationInput: ApplicationInput): Application
    }


    schema { 
        query: RootQuery 
        mutation: RootMutation
    }
`);
