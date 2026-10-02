const express = require( 'express' ),
      app     = express(),
      port    = 3000,
      session = require( 'express-session' ),
      bcrypt  = require( 'bcryptjs' ),
      { MongoClient, ObjectId } = require( 'mongodb' )

require( 'dotenv' ).config()
const resumeRoutes = require('./resume-routes')

app.use( express.json() )
app.use( session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // stays logged in for 1 week
}))

let db, usersCollection, resumesCollection

const client = new MongoClient( process.env.MONGO_URI )

const connectToDatabase = async function() {
  await client.connect()
  db = client.db( 'resumeBuilder' )
  usersCollection = db.collection( 'users' )
  resumesCollection = db.collection( 'resumes' )
  app.use('/api/resumes', requireLogin, resumeRoutes(db.collection('resumeVersions')))
  console.log( 'Connected to MongoDB' )
}

// --- Auth routes ---

app.post( '/api/register', async function( request, response ) {
  const { email, password } = request.body

  if ( !email || !password ) {
    return response.status( 400 ).json({ error: 'Email and password are required.' })
  }

  const existing = await usersCollection.findOne({ email })
  if ( existing ) {
    return response.status( 409 ).json({ error: 'An account with that email already exists.' })
  }

  const passwordHash = await bcrypt.hash( password, 10 )
  const result = await usersCollection.insertOne({ email, passwordHash })

  request.session.userId = result.insertedId.toString()
  response.json({ email })
})

app.post( '/api/login', async function( request, response ) {
  const { email, password } = request.body

  const user = await usersCollection.findOne({ email })
  if ( !user ) {
    return response.status( 401 ).json({ error: 'Invalid email or password.' })
  }

  const matches = await bcrypt.compare( password, user.passwordHash )
  if ( !matches ) {
    return response.status( 401 ).json({ error: 'Invalid email or password.' })
  }

  request.session.userId = user._id.toString()
  response.json({ email: user.email })
})

app.post( '/api/logout', function( request, response ) {
  request.session.destroy( function() {
    response.json({ ok: true })
  })
})

app.get( '/api/me', async function( request, response ) {
  if ( !request.session.userId ) {
    return response.status( 401 ).json({ error: 'Not logged in.' })
  }

  const user = await usersCollection.findOne({ _id: new ObjectId( request.session.userId ) })
  if ( !user ) {
    return response.status( 401 ).json({ error: 'Not logged in.' })
  }

  response.json({ email: user.email })
})

// Blocks a route unless someone is logged in
const requireLogin = function( request, response, next ) {
  if ( !request.session.userId ) {
    return response.status( 401 ).json({ error: 'Not logged in.' })
  }
  next()
}

// --- Resume routes (now scoped to the logged-in user) ---

app.get( '/api/resume', requireLogin, async function( request, response ) {
  const resume = await resumesCollection.findOne({ userId: request.session.userId })
  response.json( resume || {} )
})

app.post( '/api/resume', requireLogin, async function( request, response ) {
  const fields = ['personalInfo', 'professionalSummary', 'education', 'workExperience', 'projects', 'activities', 'skills', 'accomplishments']
  const data = Object.fromEntries(fields.filter(key => request.body?.[key] !== undefined).map(key => [key, request.body[key]]))

  await resumesCollection.updateOne(
    { userId: request.session.userId },
    { $set: data },
    { upsert: true }
  )

  const resume = await resumesCollection.findOne({ userId: request.session.userId })
  response.json( resume )
})

app.use( express.static( 'client/dist' ) )

app.get( ['/', '/account', '/resume'], function( request, response ) {
  response.sendFile( __dirname + '/client/dist/index.html' )
})

connectToDatabase().then( function() {
  app.listen( process.env.PORT || port )
})