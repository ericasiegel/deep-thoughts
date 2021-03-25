import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';

const Header = () => {
  // function to log the user out of the application
  const logout = event => {
    // with event.preventDefault() we are overriding the <a> elements default nature of having the browser load a different resource.
    event.preventDefault();
    // instead we execute the logout method which will remove the token from localStorage and then refresh the application by taking the user back to the homepage.
    Auth.logout();
  }
  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to='/'>
          <h1>Deep Thoughts</h1>
        </Link>
        <nav className="text-center">
          {Auth.loggedIn() ? (
            <>
              <Link to='/profile'>Me</Link>
              <a href='/' onClick={logout}>Logout</a>
            </>
          ) : (
            <>
              <Link to ='/login'>Login</Link>
              <Link to ='/signup'>Signup</Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Header;
