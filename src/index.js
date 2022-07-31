//import myCurrentLocation, {message,name, getGreeting} from "./myModule";
//import myAddFunction, {mathSubtract} from "./math";

import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

//Demo user data
const users = [{
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
const comments = [{
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
const posts = [{
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
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]  
        comments: [Comment!]
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
            const emailTaken = users.some(user => user.email === args.email);

            if (emailTaken) {
                throw new Error('Email taken');
            }
       const user = {
            id: uuidv4(),
            name: args.name,
            email: args.email,
            age: args.age
        }
        users.push(user)
        return user
        },

        createPost(parent, args, context, info) {
            const userExists = users.some((user) => user.id === args.author)

            if (!userExists) {
                throw new Error('User Not Found')
            }

            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
            }

            posts.push(post)

            return post
        },

        createComment(parent, args, context, info) {
            const userExists = users.some((user) => user.id === args.author)
            const postExists = posts.some((post) => {
                return post.id === args.post && post.published === true
            })

            if (!userExists ) {
                throw new Error("User Not Found")
            };

            if (!postExists) {
                throw new Error("Post Not Found")
            }

            const comment = {
                id: uuidv4(),
                text: args.text,
                author: args.author,
                post: args.post
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