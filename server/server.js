const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
// we provide the type definitions and resolvers so they know what our api looks like and how it resolves requests
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // pass in the 'context' method that's set to return whatever you want available in the resolvers
  // see the incoming request and only see the headers, those headers would become the context parameter
  // context: ({ req }) => req.headers

  // this ensures that every request performs an authentication check, and the updated request object will be passed to the resolvers as 'context'
  context: authMiddleware
});

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
