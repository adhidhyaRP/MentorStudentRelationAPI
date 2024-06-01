import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

// const dbcluster = "localhost:27017"
// const localuri = `mongodb://${dbcluster}/${dbname}`
const dbname = process.env.DB_NAME

const cloudname = process.env.DB_CLOUDNAME
const cloudpassword = process.env.DB_CLOUDPASSWORD
const dbclustername = process.env.DB_CLUSTER

const cloudUri = `mongodb+srv://${cloudname}:${cloudpassword}@${dbclustername}/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient(cloudUri)
const db = client.db(dbname)

const connectdb = async()=>{
    try {
       await client.connect()
       console.log(`DB connected successfully ${dbname} `)
    } catch (error) {
        console.log(error)
    }
}

export {connectdb,db}