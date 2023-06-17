//config files and packages
require('express-async-errors');
require('dotenv').config();

//basic module imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');

//basic middleware imports
app.use(express.json());

//handling mongoose deprecations
mongoose.set("strictQuery", true);

//db import
const connectDB = require('./db/connect');

//route imports
const userRouter = require('./routes/userRouter');

//routing the paths to route imports
app.use('/v1/auth', userRouter);

//initializing server port 
const port = process.env.PORT || 3000;

//starting the server and connecting to db
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
          });
    } catch (err) {
        console.log(err);
    }
}

//Start the server
start();