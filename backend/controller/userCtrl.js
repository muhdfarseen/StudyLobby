const { default: mongoose } = require("mongoose");
const {
  userModel,
  subjectModel,
  sessionManageModel,
} = require("../model/allModels");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  const { username, email, password } = req.body;
  let user = await userModel.findOne({ email: email });

  try {
    if (user) {
      res.json("user already exist");
    } else {
      user = new userModel({
        username,
        email,
        password,
        role: "user",
      });
      user.save();
      res.status(200).json("registered");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("unable to regsiter");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });
  try {
    if (user) {
      if (user.password === password) {
        const token = jwt.sign({ data: user }, process.env.JWT_pass, {
          expiresIn: "4h",
        });
        res.json({ msg: "login succesfull", status: 200, data: token });
      } else {
        res.json({ msg: "login failed", status: 500 });
      }
    } else {
      res.json({ msg: "user not found", status: 404 });
      console.log("user not found");
    }
  } catch (error) {
    console.log(error);
    res.json({ msg: "error logging in", status: 500 });
  }
};

// cehck if sub exist or add a new subject
const addSubject = async (req, res) => {
  const { userId, subName, subColor } = req.body;
  let subject = await subjectModel.findOne({ subName: subName });
  // console.log('came')
  try {
    if (subject) {
      res.json("subject exist");
    } else {
      subject = new subjectModel({
        userId,
        subName,
        subColor,
      });
      subject.save();
      res.status(200).json("subject added");
    }
  } catch (error) {
    console.log(error);
    res.json("error adding subject");
  }
};

//update session content with new data (put)
const updateSubject = async (req, res) => {
  try {
    const { subId, userId, subName, subColor } = req.body;
    console.log("hi", subId);
    await subjectModel.updateOne({ _id: subId }, { userId, subName, subColor });
    res.status(200).json("subject updated");
  } catch (error) {
    console.log(error);
    res.status(500).json("error updating sub");
  }
};

// delete subject and related sessions
const deleteSubject = async (req, res) => {
  try {
    const subId = req.headers.subid;
    await subjectModel.deleteOne({ _id: subId });
    // await sessionManageModel.deleteOne({subjectId:subId})
    res.status(200).json("subject has been deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json("error in deleting subject");
  }
};

//get subject data based on count of status
const getSubjects = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const subjects = await subjectModel.find({ userId });
  
      const subjectsWithCounts = await Promise.all(
        subjects.map(async (subject) => {
          const completedCount = await sessionManageModel.countDocuments({
            userId,
            subjectId: subject._id,
            status: "completed",
          });
  
          const pendingCount = await sessionManageModel.countDocuments({
            userId,
            subjectId: subject._id,
            status: "pending",
          });
  
          return {
            ...subject.toObject(), 
            completedCount,
            pendingCount,
          };
        })
      );
  
      res.json({ status: 200, data: subjectsWithCounts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "error getting subjects" });
    }
  };
  

// getSubCount=async(req,res)=>{
// try {
//      const completeCount=await sessionManageModel.find({userId:userId,subjectId:subId,status:'completed'}).count()
//     const pendingCount=await sessionManageModel.find({userId:userId,subjectId:subId,status:'pending'}).count()
//     const subInfo={Subname:subject.subName,Subcolor:subject.subColor,completeCount:completeCount,
//         pendingCount:pendingCount}
//     res.status(200).json({msg:"subject recieived",data:subInfo})
// } catch (error) {
//     console.log(error)
//     res.status(500).josn({msg:"error getting subject "})
// }
// }

//add a new session (no session exist check)
const addSession = async (req, res) => {
  const { userId, topic, subjectName, fromTime, endTime } = req.body;
  const subject = await subjectModel.findOne({ subName: subjectName });
  try {
    const session = new sessionManageModel({
      subjectId: subject._id,
      userId,
      topic,
      fromTime,
      endTime,
      status: "pending",
    });
    session.save();
    res.status(200).json("session added succesfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("error adding session");
  }
};

// edit session content (get)
const editSession = async (req, res) => {
  try {
    const sessionId = req.headers.sessionid;
    const session = await sessionManageModel.findOne({ _id: sessionId });
    res.json(session);
  } catch (error) {
    console.log(error);
  }
};

//update session content with new data (put)
const updateSession = async (req, res) => {
  try {
    const { sessionId, userId, subjectName, topic, fromTime, endTime } =
      req.body;
    const subject = await subjectModel.findOne({ subName: subjectName });
    let session = await sessionManageModel.findOne({ _id: sessionId });
    await sessionManageModel.updateOne(
      { _id: sessionId },
      { subjectId: subject._id, userId, topic, fromTime, endTime }
    );
    res.json("session updated");
  } catch (error) {
    console.log(error);
    res.status(500).json("error updating");
  }
};

// delete a session
const deleteSession = async (req, res) => {
  try {
    const sessionId = req.headers.sessionid;
    await sessionManageModel.deleteOne({ _id: sessionId });
    res.status(200).json("session deleted");
  } catch (error) {
    console.log(error);
    res.status(200).json("error deleting");
  }
};

//update the status of a session (patch)
//status= true/false (coming from frontend)
const updateStatus = async (req, res) => {
  try {
    let { sessionId, oldStatus } = req.body;
    oldStatus == "pending"
      ? (oldStatus = "completed")
      : (oldStatus = "pending");
    await sessionManageModel.updateOne(
      { _id: sessionId },
      { status: oldStatus }
    );
    console.log(oldStatus);
    res.status(200).json("status updated");
  } catch (error) {
    console.log(error);
    res.status(500).json("error updating status");
  }
};

//get all the session of a specific user to see all previos(status=completed) and upcoming (status=pending) and session per subject
const getSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const sessions = await sessionManageModel
      .find({ userId: userId })
      .populate("subjectId");
    console.log(sessions);
    res.json({ status: 200, data: sessions });
  } catch (error) {
    console.log(error);
    res.status(500).json("error getting session");
  }
};



module.exports = {
  register,
  login,
  addSubject,
  updateSubject,
  deleteSubject,
  getSubjects,
  addSession,
  editSession,
  updateSession,
  deleteSession,
  updateStatus,
  getSessions,
  
};
