const graphql = require('graphql');
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Config = require('../config');
const User = require('../models/user');

const { GraphQLObjectType, GraphQLString, 
       GraphQLID, GraphQLNonNull, GraphQLSchema, GraphQLList } = graphql;


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLString },
        email: { type: GraphQLString }, 
        name: { type: GraphQLString },
        password: { type: GraphQLString },
        token: { type: GraphQLString }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },
        user: {
            type: UserType,
            args: { _id: { type: GraphQLID }},
            resolve(parent, args){
                return User.findById(args._id);
            }
        },
        me: {
            type: UserType,
            args: { token: { type: GraphQLString }},
            resolve(parent, args){
                return User.findOne({ token: args.token });
            }
        },
        login: {
            type: UserType,
            args: { 
                    name: { type: GraphQLString },
                    password: { type: GraphQLString}
                },
            async resolve(parent, args){
                let user = await User.findOne({ name: args.name });
                if(!user){
                    return null;
                }
                let passwordIsValid =  bcrypt.compareSync(args.password, user.password);

                if(!passwordIsValid){
                    return { error: "Invalid Password!" };
                }

                return user;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: { 
        register: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }                
            },
            resolve(parent, args){

                const token = jwt.sign({ name: args.name }, Config.secret, {
                    expiresIn: 86400 // 24 hours
                  });
                const now = Date.now();

                const salt = bcrypt.genSaltSync(10);

                let user = new User({
                    email: args.email,
                    name: args.name,
                    password: bcrypt.hashSync(args.password, salt),
                    token: token,
                    createdAt: now,
                    updatedAt: now
                });
                return user.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});