const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const app = require('./app');

//iRN4iW21NxHjfB7P
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGODB_SERVER)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}...`)))
    .catch((error) => console.log(error.message));