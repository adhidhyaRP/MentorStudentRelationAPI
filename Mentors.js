import express from 'express'
import { db } from './mongoconnect.js' 

const MentorsDB = express.Router()

MentorsDB.get('/',async(req,res)=>{
    try {
        
        const collection = db.collection('mentorsdata')
        const data = await collection.find({}).toArray()

        res.send(data)
} catch (error) {
        res.send(error)
}

MentorsDB.post("/",async(req,res)=>{
    try {
        const {body} = req
        const collection = db.collection('mentorsdata')
       await collection.insertOne({...body,students:[],id:Date.now().toString(),})
        res.send({msg:"mentor data inserted"})

    } catch (error) {
        res.send({msg:"error"})
    }
})
    
})

MentorsDB.get("/Allstudents/:mentorsid",async(req,res)=>{
    try {
        
   
    const {mentorsid} = req.params
    const collection = db.collection('mentorsdata')
   const data = await collection.findOne({id:mentorsid})

   res.send({students : data.students})
} catch (error) {
    res.send(error)    
}
})






export default MentorsDB