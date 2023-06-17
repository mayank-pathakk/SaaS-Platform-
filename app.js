//config files and packages
require('express-async-errors');
require('dotenv').config();

//basic module imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

//Handling uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(err.message);
    console.log(`Server is shutting down due to uncaught exception`);
    process.exit(1);
  });
  

//basic middleware imports
app.use(express.json());
app.use(cookieParser());

//custom middleware imports
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");

//handling mongoose deprecations
mongoose.set("strictQuery", true);

//db import
const connectDB = require('./db/connect');

//route imports
const userRouter = require('./routes/userRouter');
const communityRouter = require('./routes/communityRouter');
const roleRouter = require('./routes/roleRouter');

//routing the paths to route imports
app.use('/v1/auth', userRouter);
app.use('/v1/role', roleRouter);
app.use('/v1/community', communityRouter);
app.use(errorHandlerMiddleware);
app.use(notFound);

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

//Handling unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(err.message);
    console.log(`Server is shutting down due to unhandled promise rejection`);
    server.close(() => {
      process.exit(1);
    });
});