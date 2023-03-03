const mongoose = require("mongoose")
mongoose.set('strictQuery', true);


const connectToDataBase = ()=>{
    mongoose.connect(process.env.MONGODB_URI).then((data)=>{
        console.log(`Server is running on ${data.connection.host}`);
    
    })
}

module.exports = connectToDataBase