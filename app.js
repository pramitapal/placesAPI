const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
var cors = require('cors')
const app = express();
app.use(cors());

const graphqlSchema = require('./graphQL/schema');
const graphqlResolver = require('./graphQL/resolvers')

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://cnt:cnt@cluster0.ioaiq.mongodb.net/directoryDB?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Database Connected at port 8080")
        app.listen(8080);
    })
    .catch((err) => {
        console.log(err);
    }); 
