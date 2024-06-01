import express from 'express'
import { db } from './mongoconnect.js'
import MentorsDB from './Mentors.js'
const StudentDB = express.Router()

StudentDB.get("/",async(req,res)=>{
    try {
        
        const collections =  db.collection('studentsdata')
        const data = await collections.find({}).toArray()
        res.send(data)

    } catch (error) {
        res.send(error)
    }
   
})

StudentDB.post("/",(req,res)=>{
    const {body} = req
    const collections =  db.collection('studentsdata')
    try {
        collections.insertOne({id:Date.now().toString(),...body,CurrentMentor:null,
            PreviousMentor:null
        })
        res.send({msg:"Value Inserted Sucessfully"})
    } catch (error) {
        res.send({msg:"error"})
    }


})



StudentDB.delete("/:studentid",async(req,res)=>{
    const {studentid} = req.params
    const collections =  db.collection('studentsdata')
    try {
       await collections.deleteOne({id:studentid})
       res.send({msg:"Value Deleted Sucessfully"})
    } catch (error) {
        res.send({msg:"error"})
    }

})


StudentDB.put("/assignMentor/:studentid",async(req,res)=>{
    const { studentid } = req.params
    const { CurrentMentorID } = req.body

    const studentcollections =  db.collection('studentsdata')
    const mentorcollection = db.collection('mentorsdata')

  const studobj = await studentcollections.findOne({id:studentid})
  if(!studobj){
    res.send("invalid student id")
  }
  const Mentorobj = await mentorcollection.findOne({id:CurrentMentorID})

  if(!Mentorobj){
    res.send("invalid mentor id")
  }
     await studentcollections.updateOne({id : studentid},{$set : {
        PreviousMentor : studobj.CurrentMentor,
        CurrentMentor : CurrentMentorID
    } })
    
    await mentorcollection.updateOne({id:CurrentMentorID},{$push : {students : studentid}})
    res.send("mentor assigned sucessfully")


})

StudentDB.put("/changementor/:studentid",async(req,res)=>{

   
        
    
    const {studentid} = req.params
    const {ChangedMentorID} = req.body

   const studentcollections = db.collection('studentsdata')
   const mentorcollection = db.collection('mentorsdata')
   try {
  const studobj = await studentcollections.findOne({id:studentid})
  if(!studobj){
    res.send("invalid student id")
  }

  const Mentorobj = await mentorcollection.findOne({id:ChangedMentorID})
  if(!Mentorobj){
    res.send("invalid mentor id")
  }

 const oldmentor = studobj.CurrentMentor

  await mentorcollection.updateOne({id:oldmentor},{
    $pull : {students : studentid}
  })

  await studentcollections.updateOne({id:studentid},{$set:{
    PreviousMentor:studobj.CurrentMentor,
    CurrentMentor:ChangedMentorID
  }
  })

  await mentorcollection.updateOne({id:ChangedMentorID},{
    $addToSet : {students : studentid }
  })
  res.send({ msg: "Mentor changed successfully" });
} catch (error) {
    res.send({ msg: "Error changing mentor" });
}
})

StudentDB.get("/PreviousMentor/:Studid",async(req,res)=>{
    const {Studid} = req.params
    const studentcollections = db.collection('studentsdata')

   const studobj = await studentcollections.findOne({id:Studid})
//    res.send({PreviousMentor :  studobj.PreviousMentor})
const nameid = studobj.PreviousMentor
const mentorcollection = db.collection('mentorsdata')
 const obj = await mentorcollection.findOne({id:nameid})
 res.send({PreviousMentor : obj.name})

})


export default StudentDB