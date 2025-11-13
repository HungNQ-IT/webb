import { Router } from 'express'
import bcrypt from 'bcrypt'
import { db } from '../db.js'
import { ADMIN_EMAILS } from '../config.js'
import { generateToken } from '../utils/token.js'
import { authenticate } from '../middleware/auth.js'
import { mapUser } from '../utils/format.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password, name, grade } = req.body || {}

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Email is required' })
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase())
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  try {
    const hash = await bcrypt.hash(password, 10)
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'student'
    const info = db.prepare(`
      INSERT INTO users (email, password, name, grade, role)
      VALUES (@email, @password, @name, @grade, @role)
    `).run({
      email: email.toLowerCase(),
      password: hash,
      name: name || null,
      grade: grade || null,
      role
    })
    const userRow = db.prepare('SELECT id, email, name, grade, role, created_at FROM users WHERE id = ?').get(info.lastInsertRowid)
    const user = mapUser(userRow)
    const token = generateToken(user)
    res.status(201).json({ user, token })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const userRow = db.prepare('SELECT id, email, password, name, grade, role, created_at FROM users WHERE email = ?').get(email.toLowerCase())
  if (!userRow) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const match = await bcrypt.compare(password, userRow.password)
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const safeUser = mapUser(userRow)
  const token = generateToken(safeUser)
  res.json({ user: safeUser, token })
})

router.get('/me', authenticate(true), (req, res) => {
  res.json({ user: mapUser(req.user) })
})

export default router

