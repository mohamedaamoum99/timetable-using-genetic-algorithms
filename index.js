const express = require('express');
const evolveRoute = require('./routes/evolveRoute');

const app = express();
app.use(express.json());



app.use('/', evolveRoute);



const Port = 5000;
app.listen( Port, () => console.log(`listnen in Port : ${Port} `) );