import React from 'react';

// add the import statements for Apollo React-hooks
// this will allow us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> componenet in App.js
import { useQuery } from '@apollo/react-hooks';
// import QUERY_THOUGHTS from queries.js
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import Auth from '../utils/auth';
import FriendList from '../components/FriendList';

// import the ThoughtList
import ThoughtList from '../components/ThoughtList';

const Home = () => {
  // use useQuery hook to make query request
  // Apollo's react-hooks library provides a loading property to indicate that the request isn't done just yet. 
  // When it's finished and we have data returned from the server, that information is stored in the destructured data property
  // with the loading property, we'll be able to conditionally render data based on whether or not there is data to even display
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // use object destructuring to extract 'data' from the 'useQuery hook's response and rename it 'userData' to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  // this is called 'optional chaining'- negates the need to check if an object even exists before accessign its properties. in this case, no data will exist until the query to the server is finished.
  // what this is saying is: If data exists, store it in the 'thoughts' constant we just created.
  // if 'data' is underfined, then save an empty array to the 'thoughts' componenet.
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  // if you are logged in the loggedIn variable will be true
  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className='flex-row justify-space-between'>
        {/* conditionally render the logged in status to modify the page layout */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* use a ternary operator to conditionally render the <ThoughtList> conponent */}
          {loading ? (
            // if the query hasn't completed and loading is still defined, display the Loading... message
            <div>Loading...</div>
          ) : (
            // once the query is complete, and loding is undefined, pas the thoughts array and custom title to the <ThoughtsList> componenet as props
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
        {loggedIn && userData ? (
          <div className='col-12 col-lg-3 mb-3'>
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
