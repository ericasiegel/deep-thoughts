import React from 'react';

// add two Apollo libraries
// A special type of React component that we'll use to provide data to all of the other componenets
import { ApolloProvider } from '@apollo/react-hooks';
// A React component we will use to get that data from the above when we're ready to use it
import ApolloClient from 'apollo-boost';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

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
      {/* wrap the div elements in a Router component  which makes all of the child components on the page aware of the client side routing */}
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile/:username?" component={Profile} />
              <Route exact path="/thought/:id" component={SingleThought} />

              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
