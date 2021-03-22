// import the Thought and User model
const { User, Thought } = require('../models');

// these methods get the same name of the query or mutation they are resolvers for
// parent is passed as a placeholder parameter
// parent wont be used but we need it in the first spot so we can access the 'username' arguement from the second parameter
const resolvers = {
    Query: {
        thoughts: async (parent, { username }) => {
            // check to seee if username exists. if it does then set it to an object with a username key set to that value.
            // if it doesn't return an empty object.
            const params = username ? { username } : {}
            // pass the object, with or without data, to our .find() method
            // if there is data, it'll perform a lookup by specific uername
            // if there is no data it will return every thought
            return Thought.find(params).sort({ createdAt: -1 });
        },
        // destructure the _id and place into .findOne() to find thought by id
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id });
        },
        // get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        }
    }
};

module.exports = resolvers;