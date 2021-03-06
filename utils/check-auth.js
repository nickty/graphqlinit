const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')

const {AuthenticationError} = require('apollo-server')

module.exports = (context) => {
    //context = {...headers}
    const authHeader = context.req.headers.authorization; 
    if(authHeader){
        //Bearer
        const token = authHeader.split('Bearer')[1];

        console.log(token)
        console.log(SECRET_KEY)

        if(token){
            try {
                const user = jwt.verify(token, SECRET_KEY)
                console.log(SECRET_KEY)
                console.log(user)
                return user
            } catch (error) {
                throw new AuthenticationError('Invalid/Expire token'); 
            }
        }

        throw new Error('Authentication token must be Bearer[token] ')
    }

    throw new Error('Authorization header must be provided')
}