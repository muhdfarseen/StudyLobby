const mongoose=require('mongoose')

//user table

const userSchema=new mongoose.Schema({
    username:{type:String},
    email:{type:String},
    password:{type:String},
    role:{type:String}
},{timestamps:true})

const userModel=new mongoose.model('user_tbl',userSchema)

//subject table

const subjectSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user_tbl'},
    subName:{type:String},
    subColor:{type:String}
},{timestamps:true})

const subjectModel=new mongoose.model('subject_tbl',subjectSchema)

//session management table

const sessionManageSchema=new mongoose.Schema({
    subjectId:{type:mongoose.Schema.Types.ObjectId,ref:'subject_tbl'},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user_tbl'},
    topic:{type:String},
    fromTime:{type:String},
    endTime:{type:String},
    status:{type:String}
},{timestamps:true})

const sessionManageModel=new mongoose.model('sessionManage_tbl',sessionManageSchema)

module.exports={userModel,subjectModel,sessionManageModel}