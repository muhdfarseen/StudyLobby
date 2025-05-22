const express=require('express')
const { register, login, addSubject, addSession, editSession, updateSession, deleteSession, updateStatus, getSessions, updateSubject, deleteSubject, getSubjects } = require('../controller/userCtrl')
const authorizeRequest = require('../middleware/tokenAuth')

const userRouter=express.Router()

userRouter.route('/register').post(register)
userRouter.route('/login').post(login)
userRouter.route('/addsubject').post(authorizeRequest,addSubject)
userRouter.route('/updatesubject').put(authorizeRequest,updateSubject)
userRouter.route('/deletesubject').delete(authorizeRequest,deleteSubject)
userRouter.route('/getsubjects').get(authorizeRequest,getSubjects)
userRouter.route('/addsession').post(authorizeRequest,addSession)
userRouter.route('/editsession').get(authorizeRequest,editSession)
userRouter.route('/updatesession').put(authorizeRequest,updateSession)
userRouter.route('/deletesession').delete(authorizeRequest,deleteSession)
userRouter.route('/updatestatus').patch(authorizeRequest,updateStatus)
userRouter.route('/getsessions').get(authorizeRequest,getSessions)

module.exports=userRouter

