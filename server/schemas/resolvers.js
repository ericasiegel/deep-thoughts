// import the Thought and User model
const { User, Thought } = require('../models');
// import the authenticationError from apollo-server-express
const { AuthenticationError } = require('apollo-server-express');
// import signToken from auth.js
const { signToken } = require('../utils/auth');

// these methods get the same name of the query or mutation they are resolvers for
// parent is passed as a placeholder parameter
// parent wont be used but we need it in the first spot so we can access the 'username' arguement from the second parameter
const resolvers = {
    Query: {
        //method to use tokens
        me: async (parent, args, context) =>{
            // check for the existence of 'context.user'. if no 'context.user' property exists then we know that the user isn't authenticated and we can throw an AuthenticationError
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
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
    },
    Mutation: {
        addUser: async (parent, args) => {
            // user data is passed in as args
            const user = await User.create(args);
            // combine the user data with the token
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
        addThought: async (parent, args, context) => {
            // only logged in users should be able to use this mutation so we check for the existance context.user._id first
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(

                    { _id: context.user._id },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );

                return thought;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    // reactions are stored as arrays on the Thought model, so you'll use the Mongo $push operator
                    { $push: { reactions: { reactionBody, username: context.user.username } } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // a user can't be friends twice with the same person
                    // $addToSet prevents duplicate entries
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;