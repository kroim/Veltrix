const graphql = require('graphql');
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const nodemailer  = require("nodemailer");
const Config = require('../config');
const { User, Team, Member, Association, ProjectAttribute } = require('../models/index');

const { GraphQLObjectType, GraphQLString, 
       GraphQLID, GraphQLNonNull, GraphQLSchema, GraphQLList, GraphQLBoolean } = graphql;

// Setting Mailer
var transport = {
    host: Config.mailer_host,
    port: Config.mailer_port,
    secure: true,
    auth: {
        user: Config.mailer_user,
        pass: Config.mailer_pass
    }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
if (error) {
    console.log(error);
} else {
    console.log('Setting Mailer Success!');
}
});

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

const ProjectAttributeType = new GraphQLObjectType({
    name: 'ProjectAttribute',
    fields: () => ({
        _id: { type: GraphQLString },
        attribute_name: { type: GraphQLString }, 
        tag_name: { type: GraphQLString },
        handle: { type: GraphQLString }
    })
});

const TeamType = new GraphQLObjectType({
    name: 'Team',
    fields: () => ({
        _id: { type: GraphQLString },
        name: { type: GraphQLString }, 
        abrv: { type: GraphQLString },
        handle: { type: GraphQLString },
        planning: { type: GraphQLString }
    })
});

const MemberType = new GraphQLObjectType({
    name: 'Member',
    fields: () => ({
        _id: { type: GraphQLString },
        first_name: { type: GraphQLString }, 
        last_name: { type: GraphQLString }, 
        abrv: { type: GraphQLString },
        handle: { type: GraphQLString },
        email: { type: GraphQLString },
        is_registered: { type: GraphQLBoolean }
    })
});

const AssociationType = new GraphQLObjectType({
    name: 'Association',
    fields: () => ({
        _id: { type: GraphQLString },
        team_id: { type: GraphQLString }, 
        member_id: { type: GraphQLString },
        role: { type: GraphQLString },
        team: {
            type: TeamType,
            resolve(parent, args){
                return Team.findById(parent.team_id);
            }
        },
        member: {
            type: MemberType,
            resolve(parent, args){
                return Member.findById(parent.member_id);
            }
        }
    })
});

const SendMailType = new GraphQLObjectType({
    name: 'SendMail',
    fields: () => ({
        result: { type: GraphQLString },
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
            async resolve(parent, args){
                let user = await User.findOne({ token: args.token });
                if(user){
                    let token = jwt.sign({ name: user.name }, Config.secret, {
                        expiresIn: 86400 // 24 hours
                      });
                    let now = Date.now();
                    user = {
                        _id: user._id,
                        email: user.email,
                        name: user.name, 
                        token: token, 
                        createdAt: user.createdAt,
                        updatedAt: now
                    };
                    User.findById(user._id, function(err, doc){
                        doc.token = token;
                        doc.updatedAt = now;
                        doc.save();
                    });
                    return user;
                }
                return null;
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
        },
        project_attributes: {
            type: new GraphQLList(ProjectAttributeType),
            args:{ attribute_name: { type: GraphQLString}},
            async resolve(parent, args){
                return ProjectAttribute.find({"attribute_name": args.attribute_name});
            }
        },
        all_project_attributes: {
            type: new GraphQLList(ProjectAttributeType),
            async resolve(parent, args){
                return ProjectAttribute.find({});
            }
        },
        teams: {
            type: new GraphQLList(TeamType),
            async resolve(parent, args){
                return Team.find({});
            }
        },
        members: {
            type: new GraphQLList(MemberType),
            async resolve(parent, args){
                return Member.find({});
            }
        },
        member: {
            type: MemberType,
            args: { id: { type: GraphQLString }},
            async resolve(parent, args){
                return Member.findById(args.id);
            }
        },
        associations: {
            type: new GraphQLList(AssociationType),
            async resolve(parent, args){
                return Association.find({});
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
        },
        registerFromMember: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },           
                member_id: { type: new GraphQLNonNull(GraphQLString) }          
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
                Member.findById(args.member_id, function(err, doc){
                    doc.is_registered = true;
                    doc.save();
                });
                return user.save();
            }
        },
        add_project_attribute: { 
            type: ProjectAttributeType,
            args: {
                attribute_name: { type: GraphQLString },
                tag_name: { type: GraphQLString },
                handle: { type: GraphQLString }
            },
            resolve(parent, args){
                let attribute = new ProjectAttribute({
                    attribute_name: args.attribute_name,
                    tag_name: args.tag_name,
                    handle: args.handle
                });
                return attribute.save();
            }
        },
        add_team: {
            type: TeamType,
            args: {
                name: { type: GraphQLString },
                abrv: { type: GraphQLString },
                handle: { type: GraphQLString },
                planning: { type: GraphQLString }
            },
            resolve(parent, args){
                let team = new Team({
                    name: args.name,
                    abrv: args.abrv,
                    handle: args.handle,
                    planning: args.planning
                })
                return team.save();
            }
        },
        add_member: {
            type: MemberType,
            args: {
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
                abrv: { type: GraphQLString },
                handle: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve(parent, args){
                let member = new Member({
                    first_name: args.first_name,
                    last_name: args.last_name,
                    abrv: args.abrv,
                    handle: args.handle,
                    email: args.email,
                    is_registered: false,
                })
                return member.save();
            }
        },
        add_association: {
            type: AssociationType,
            args: {
                team_id: { type: GraphQLString },
                member_id: { type: GraphQLString },
                role: { type: GraphQLString }
            },
            resolve(parent, args){
                let association = new Association({
                    team_id: args.team_id,
                    member_id: args.member_id,
                    role: args.role
                })
                return association.save();
            }
        },
        send_mail:{
            type: SendMailType,
            args: {
                member_id: { type: GraphQLString },
                email: { type: GraphQLString },
            },
            resolve(parent, args){
                let member_id = args.member_id;
                let data = {
                    from: Config.mailer_user,
                    to: args.email,
                    subject: "Veltrix Require Password",
                    text: `Please Create Password in ${Config.server_base_url}/create-password?id=${member_id}`,
                    html: `<span>Please Create Password in <a href="${Config.server_base_url}/create-password?id=${member_id}">here</a></span>`
                };

                transporter.sendMail(data, function(err, info){
                    if(err){
                        console.log('Send Mail Failed: ', err);
                    } else {
                        console.log('Sned Mail Success: ', info);
                    }
                });

                return { result: "success"};
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});