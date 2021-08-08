let express = require('express');
let { graphqlHTTP } = require("express-graphql");
let { buildSchema } = require('graphql');
const cors = require('cors');

let schema = buildSchema(`
    type Query {
        getComment(id: ID!): Comment
    }
    type Mutation {
        createComment(commentInput: Input): Comment
    }
    type Comment {
        id: ID!
        comment: String
        author: String
    }
    input Input {
        comment: String
        author: String
    }



    type User {
        id : ID!
        userName : String!
    }
    type Thread {
        id: ID!
        user: User!
        topic: String!
        caption : String
        comments: [Comment]
    }
    type Query {
        getUser(id: ID): User!
        getThread(user_id: ID, thread_id: ID) : Thread!
        getThreads() : [Thread]
    }
    type Mutation {
        createUser(userName: String): User
        createThread(user_id: ID, topic: String): Thread
        createComment(thread_id: ID, user_id: ID, comment: String): Comment
    }
    type Comment {
        id: ID!
        comment: String
        author: User
    }
`);

let database = {};
let id = 0;

let root = {
    getComment: ({id}) => {
        if (!database[id]) {
          throw new Error('no message exists with id ' + id);
        }
        const { comment, author } = database[id] || "";
        return {id, comment, author};
    },
    createComment: ({commentInput}) => {
        const { comment, author } = commentInput || "";
        id++;
        database[id] = commentInput;
        return {id, comment, author};
    }
};

let app = express();
app.use(cors("*"))
app.use('/graphql', graphqlHTTP ({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(5001, () => console.log('running'));