import express, { json } from 'express'
import StudentDB from './students.js'
import { connectdb } from './mongoconnect.js'
import MentorsDB from './Mentors.js'
import { db } from './mongoconnect.js'



const main = express()

await connectdb()

main.get('/',(request,response)=>{
    response.send('main.js sucessfully connected')
})
main.use(express.json())
main.use('/studentsDB',StudentDB)
main.use("/MentorsDB",MentorsDB)


const Port = 3000

main.listen(Port,()=>{
    console.log('main.js connected on port 3000')
})