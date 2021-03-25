import React from 'react';
// the Redirect component allows us to redirect the user to another route within the application
import { Redirect, useParams } from 'react-router-dom';
import Auth from '../utils/auth';

import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';
import { ADD_FRIEND } from '../utils/mutations';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import FriendList from '../components/FriendList';

const Profile = () => {
  // destructure the mutation from ADD_FRIEND so we can use it in a click function
  const [addFriend] = useMutation(ADD_FRIEND);
  // the useParams hook retrieves the username from the URL, which is then passed to the useQuery Hook
  const { username: userParam } = useParams();
  // check the value of our parameter and conditionally run a query based on the result
  // if there is a value in userParam that we got from the URL bar, we'll use that value to run the QUERY_USER query. 
  // if there is no value in userParam it will execute QUERY_ME instead
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  // when we run QUERY_ME, the response will return with our data in the me property; 
  // but if it runs QUERY_USER instead, the response will return with our data in the user property
  // if there is no data in either, it will return empty objects
  const user = data?.me || data?.user || {};

  // redirect to personal profile page if username is the logged-in user's
  if (
    Auth.loggedIn() &&
    Auth.getProfile().data.username === userParam
  ) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page, Use the navigation links above to sign up or log in!
      </h4>
    )
  }

  // function to utilize the addFriend() mutation function
  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
        {userParam && (
          <button className='btn ml-auto' onClick={handleClick}>Add Friend</button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>
        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className='mb-3'>{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
