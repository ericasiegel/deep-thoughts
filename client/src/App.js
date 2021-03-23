import React from 'react';

// add two Apollo libraries
// A special type of React component that we'll use to provide data to all of the other componenets
import { ApolloProvider } from '@apollo/react-hooks';
// A React component we will use to get that data from the above when we're ready to use it
import ApolloClient from 'apollo-boost';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

// establish the connection to the back-end server's /graphql endpoint
// establish a new connection to the GraphQL server using Apollo
const client = new ApolloClient({
  // absolute path to the back end server
  // uri: 'http://localhost:3001/graphql'
  uri: '/graphql'
});

function App() {
  return (
    // put the two imported libraries to use in the App component
    // we wrap the entire JSX code with <ApolloProvider> because we're passing the client variable in as the value for the client prop in the provider
    // everything between the JSX tags will eventually have access to the server's API data through the client we set up
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
