const mongoose =require('mongoose');

exports.connectMongoose = ()=>{
    mongoose.connect('mongodb+srv://grewalpalak:tournify@tournify.qkdzgbi.mongodb.net/?retryWrites=true&w=majority&appName=Tournify',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        socketTimeoutMS: 30000,
    }).then((e)=> console.log(`connected to mongoDB : ${e.connection.host}`)).catch((e)=> console.log(e));
}

const userSchema = new mongoose.Schema({
    name:String,
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:String
})

exports.User = mongoose.model("User",userSchema);