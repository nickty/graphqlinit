const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {validateRegisterInput} = require('../../utils/validators.js')

const {UserInputError} = require('apollo-server')

const { SECRET_KEY } = require('../../config')

const User = require('../../models/User')

module.exports = {
    Mutation: {
        async register( 
            _, 
            {
                registerInput: {username, email, password, confirmPassword},
            }
                ) {

            //todo validate user data
            //todo make sure user dosent' alredy exist
            // hash the password before we store into database

            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword)

            if(!valid){
                throw new UserInputError('Errors', {errors})
            }

            const user = await User.findOne({username});
            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This is username is taken'
                    }
                })
            }

            password = await bcrypt.hash(password, 12); 

            const newUser = new User({
                email, 
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, {expiresIn: '1h'}); 

            return {
                ...res._doc, 
                id: res._id,
                token
            }

        }
    }
}