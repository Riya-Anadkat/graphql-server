let express = require('express');
let { graphqlHTTP } = require("express-graphql");
let { buildSchema } = require('graphql');
const cors = require('cors');

let schema = buildSchema(`
    type Query {
        getComment(id: ID!): Comment
        getComments: [Comment]
    }
    type Mutation {
        createComment(commentInput: Input): Comment
        deleteComment(id: ID!): Boolean
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
    getComments: () => {
        return Object.keys(database).map((id) => {
            const { comment, author } = database[id] || "";
            return {id, comment, author}
        });
    },
    createComment: ({commentInput}) => {
        const { comment, author } = commentInput || "";
        id++;
        database[id] = commentInput;
        return {id, comment, author};
    },
    deleteComment: ({id}) => {
        delete database[id]; 
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