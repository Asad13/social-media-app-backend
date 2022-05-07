const express = require('express');
const cors = require('cors');
const compression = require('compression');
const app = express();
const postRouter = require('./routers/post');
const userRouter = require('./routers/user');

app.use(compression());
app.use(cors());
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({limit: '30mb', extended: true}));

app.use('/auth',userRouter);
app.use('/posts',postRouter);

module.exports = app;