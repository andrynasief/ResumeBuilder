const express = require( 'express' ),
      app     = express(),
      port    = 3000,
      { MongoClient } = require( 'mongodb' )

require( 'dotenv' ).config()

app.use( express.json() )

let db, resumesCollection

const client = new MongoClient( process.env.MONGO_URI )

const connectToDatabase = async function() {
  await client.connect()
  db = client.db( 'resumeBuilder' )
  resumesCollection = db.collection( 'resumes' )
  console.log( 'Connected to MongoDB' )
}

// Temporary: no login system yet
// Once accounts exist, this will be scoped to the logged-in user instead.
const DEMO_RESUME_ID = 'demo'

app.get( '/api/resume', async function( request, response ) {
  const resume = await resumesCollection.findOne({ _id: DEMO_RESUME_ID })
  response.json( resume || {} )
})

app.post( '/api/resume', async function( request, response ) {
  const data = request.body

  await resumesCollection.updateOne(
    { _id: DEMO_RESUME_ID },
    { $set: data },
    { upsert: true }
  )

  const resume = await resumesCollection.findOne({ _id: DEMO_RESUME_ID })
  response.json( resume )
})

app.use( express.static( 'client/dist' ) )

app.get( '/', function( request, response ) {
  response.sendFile( __dirname + '/client/dist/index.html' )
})

connectToDatabase().then( function() {
  app.listen( process.env.PORT || port )
})