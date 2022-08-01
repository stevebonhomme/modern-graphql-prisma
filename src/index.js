//import myCurrentLocation, {message,name, getGreeting} from "./myModule";
//import myAddFunction, {mathSubtract} from "./math";

import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

//Demo user data
let users = [{
    id: '1',
    name: 'John Doe',
    email: 'steve@hotmail.com',
    age: 27
},
{   id: '2',
    name: 'Jane Doe',
    email: 'jane@hotmail.com',
    age: 25
},
{   id: '3',
    name: 'Steve Doe',
    email: 'fake@email.com',
    age: 30

}];

//Demp comments data
let comments = [{
    id: '6',
    text: 'This is a comment',
    author: '1',
    post: '1'
},
{   id: '7',
    text: 'This is another comment',
    author: '1',
    post: '1'
},
{   id: '8',
    text: 'This is a third comment',
    author: '2',
    post: '2'
},
{   id: '9',
    text: 'This is a fourth comment',
    author: '3',
    post: '3'

}];

//Demo posts data
let posts = [{
    id: '1',
    title: 'My first post',
    body: 'This is my first post',
    published: true,
    author: "1"
},
{   id: '2',
    title: 'My second post',
    body: 'This is my second post',
    published: false,
    author: "1"

},  {   id: '3',
    title: 'My third post',
    body: 'This is my third post',
    published: true,
    author: "2"

}];



//console.log(message, name, myCurrentLocation, getGreeting('Dick Tracy'));
//console.log(myAddFunction(1, 2), mathSubtract(4, 2));

//Type definitions define the "shape" of your data and specify (schema)
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(numbers: [Float]): Float
        me: User!
        post: Post
        grades: [Int!]!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]

    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
        deleteUser(id: ID!): User!
        deletePost(id: ID!): Post!
        deleteComment(id: ID!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]  
        comments: [Comment!]
    } 

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput{
        text: String!
        author: ID!
        post: ID!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!  
        comments: [Comment!]     

    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
    `


//Resolvers
const resolvers = {

    Mutation: {
        createUser(parent, args, context, info) {
            const emailTaken = users.some(user => user.email === args.data.email);

            if (emailTaken) {
                throw new Error('Email taken');
            }

            //Using spread operator to pass all of the properties in args
       const user = {
            id: uuidv4(),
           ...args.data
        }
        users.push(user)
        return user
        },

        deleteUser(parent, args, context, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if (!userIndex === -1){
                throw new Error('User Not Found')
            }
            
            const deleteUsers =  users.splice(userIndex, 1)

            posts = posts.filter((post) => {
                const match = post.author === args.id

                if (match) {
                    comments = comments.filter((comment) => comment.post !== post.id)
                }
                return !match
            })
            comments = comments.filter((comment) => comment.author !== args.id)
            return deleteUsers[0]

        },

        deletePost(parent, args, context, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id)

            if (!postIndex === -1){
                throw new Error('Post Not Found')
            }
            
            const deletedPosts =  posts.splice(postIndex, 1)

           
            comments = comments.filter((comment) => comment.post !== args.id)

            return deletedPosts[0]

        },

        deleteComment(parent, args, context, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id)

            if (!commentIndex === -1){
                throw new Error('Comment Not Found')
            }
            
            const deletedComments =  comments.splice(commentIndex, 1)                     

            return deletedComments[0]

        },

        createPost(parent, args, context, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if (!userExists) {
                throw new Error('User Not Found')
            }

            const post = {
                id: uuidv4(),
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: args.data.author
            }

            posts.push(post)

            return post
        },

        createComment(parent, args, context, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            const postExists = posts.some((post) => post.id === args.data.post && post.published)

            if (!userExists || !postExists ) {
                throw new Error("Unable to find user and post")
            }

            const comment = {
                id: uuidv4(),
                text: args.data.text,
                author: args.data.author,
                post: args.data.post
            }

            comments.push(comment)

            return comment
        }

    },
    
    
    Query: {
        me() {
            return {
                id: '1234',
                name: 'Mike',
                email: 'mike@hotmail.com',
                age: 30
            }
        },

        post() {
            return {
                id: '1234',
                title: 'My first post',
                body: 'This is my first post',
                published: true
            }
        },        

        add(parent, args) {
            if(args.numbers.length === 0) {
                return 0;
            }
            return args.numbers.reduce((acc, curr) => acc + curr);
        },

        grades(parent, args, context, info) {
            return [1, 2, 3, 4, 5]
        },

        users(parent, args, context, info) {
            if(!args.query) {
                return users;
            }
            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
        },

        posts(parent, args, context, info) {
            if(!args.query) {
                return posts;
            }
            return posts.filter(post => post.title.toLowerCase().includes(args.query.toLowerCase()) && post.body.toLowerCase().includes(args.query.toLowerCase()));
          
        },

        comments(parent, args, context, info) {
            return comments;
        },

        greeting(parent, args, context, info) {
            if(args.name && args.position) {
            return `'Hello!' ${args.name} This is my favorite ${args.position}`;
        } else {
            return 'Hello!';
        }
    }
},
   
        Post: {
            author(parent, args, context, info) {
                return users.find(user => user.id === parent.author);
            },
            comments(parent, args, context, info) {
                return comments.filter(comment => comment.post === parent.id);
            }
        },

        User: {
            posts(parent, args, context, info) {
                return posts.filter(post => post.author === parent.id);
            },
            comments(parent, args, context, info) {
                return comments.filter(comment => comment.author === parent.id);
            }
        },

        Comment: {
            author(parent, args, context, info) {
                return users.find(user => user.id === parent.author);
            },
            post(parent, args, context, info) {
                return posts.find(post => post.id === parent.post);
            }
        },
    }



    const server = new GraphQLServer({ typeDefs, resolvers });

    server.start(() => console.log('Server is running on localhost:4000'));