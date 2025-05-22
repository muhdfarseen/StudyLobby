const mongoose=require('mongoose')
require('dotenv').config()
const url=process.env.mongo_url

const dbconnect=async()=>{
    try {
        await mongoose.connect(url)
        console.log("Database connected")
    } catch (error) {
        console.log(error,"error connecting database")
    }
}

module.exports=dbconnect