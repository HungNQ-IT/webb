import express from 'express'
import cors from 'cors'
import { PORT } from './config.js'
import { initDb } from './db.js'
import authRouter from './routes/auth.js'
import submissionsRouter from './routes/submissions.js'

const app = express()
initDb()

const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173').split(',').map(o => o.trim()).filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use(express.json())

app.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

app.use('/auth', authRouter)
app.use('/submissions', submissionsRouter)

app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS error' })
  }
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Internal server error' })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

