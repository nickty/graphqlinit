const postsResolves = require('./posts')
const userResolvers = require('./users')

module.exports = {
    Query: {
        ...postsResolves.Query
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...postsResolves.Mutation
    }
}