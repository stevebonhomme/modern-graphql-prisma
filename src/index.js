//import myCurrentLocation, {message,name, getGreeting} from "./myModule";
//import myAddFunction, {mathSubtract} from "./math";

import { GraphQLServer, PubSub } from 'graphql-yoga';
import  db  from './db';
import  Query from './resolvers/Query';
import  Mutation  from './resolvers/Mutation';
import  Post  from './resolvers/Post';
import  User  from './resolvers/User';
import  Comment  from './resolvers/Comment';
import Subscription from './resolvers/Subscription';



//console.log(message, name, myCurrentLocation, getGreeting('Dick Tracy'));
//console.log(myAddFunction(1, 2), mathSubtract(4, 2)); 
              
const pubsub = new PubSub();
        

    const server = new GraphQLServer({
         typeDefs: `./src/schema.graphql`,
         resolvers: {
            Query,
            Mutation,
            Post,
            User,
            Comment,
            Subscription
        },
        context: { db, pubsub }
     });

    server.start(() => console.log('Server is running on localhost:4000'));