import gql from 'graphql-tag';

// here we will wrap the enitre query in a tagged template literal using the imported gql function
// we have saved it as QUERY_THOUGHTS and exported it using the ES6 export syntax
export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;