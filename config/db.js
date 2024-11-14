const mongoose = require('mongoose')

const connectDB = async () => {    
    try {
        // console.log("mongiURI: ", process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI)
        console.log("server is connecteed to the mdb cloud")
    } catch (error) {
        console.log("Error connecting to mdb cloud: ", error)
    }
};

module.exports = connectDB