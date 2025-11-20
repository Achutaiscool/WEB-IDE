const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const { MongoMemoryServer } = require('mongodb-memory-server')
const authRoutes = require('./routes/auth')
const projectRoutes = require('./routes/projects')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

const PORT = process.env.PORT || 4000

async function startServer() {
  try {
    // Use MongoDB Atlas URI if provided, otherwise use in-memory MongoDB for development
    let mongoUri = process.env.MONGO_URI
    
    if (!mongoUri || mongoUri === 'mongodb://localhost:27017/mini_project_db') {
      console.log('Starting MongoDB Memory Server for local development...')
      const mongoServer = await MongoMemoryServer.create()
      mongoUri = mongoServer.getUri()
      console.log('MongoDB Memory Server started')
    }

    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log('Server listening on port', PORT))
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
