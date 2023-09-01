const mongoose =  require('mongoose')
const dotenv = require('dotenv') ;
dotenv.config() 

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB")
    } catch (error) {
        console.log(`Error : ${error.message}`)
    }
}

module.exports = connectDB ;