// import the gql tagged template function
// tagged templates are an advanced use of template literals
const { gql } = require('apollo-server-express');

// create our typeDefs
// graphQl has built-in data types knowns as scalars.
// scalars work similarly to how we defined data in Mongoose using JavaScript's built-in types
// ! after the query parameter indicates that for that query to be carried out the data must exist.
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
  }
`;

module.exports = typeDefs;


// type Auth {
//     token: ID!
//     user: User
// }
    // means that Auth type must return a token and can optionally include any other user data.

// 'me' query is used in the http header to gather all of the user information