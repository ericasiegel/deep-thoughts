const jwt = require('jsonwebtoken');

// the secret has nothing to do with the encoding.
// The secret merely enables the server to verify whether it recognizes this token
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    // signToken expects a user object and will add that user's username, email, id to the token.
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
    authMiddleware: function({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // seperate "Bearer" from "<tokencalue>"
        if (req.headers.authorization) {
            token = token
                .split (' ')
                .pop()
                .trim();
        }

        // if no token, return request object as is
        if (!token) {
            return req;
        }
        // we want people to be able to view all thoughts so we wrapped in a try...catch statement tomute the error
        try {
            // decode and attach user data to request object
            // this is where the secret becomes important
            // if the secret on jwt.verify() doesnt match the secret that was used tiwh jwt.sign() the object won't be decoded
            // when JWT verification fails an error is thrown
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('invalid token');
        }

        // return updated request object
        return req;
    }
}

// Another solution for authentication is a JSON Web Token, or JWT, which is a JSON object that's been encoded into a tokenized string.
// JSON Web Tokens are especially useful because they do the following things:
    // Contain all the data you need encoded into a single string.
    // Eliminate the need to save a session ID on the back end or in the database.
    // Decrease the amount of server-side resources needed to maintain authentication.
    // Can be generated anywhere and aren't tied to a single domain like cookies.

// to generate the JWT on the back end in the 'server' folder run npm install jsonwebtoken
// then create the auth.js in the 'utils' folder