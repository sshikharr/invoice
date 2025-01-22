const mongoose = require('mongoose');
require('dotenv').config();            // Needed to add this to load environment variable correctly 

const url = process.env.MONGODB_URI


const open = async (uri = url) => {

    try {
        const mongoConnection = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
        if (mongoConnection)
            console.log('connected to db!');
    } catch (e) {
        console.log(e);
        throw e;
    }
}


const close = () => mongoose.disconnect()

module.exports = { open, close }