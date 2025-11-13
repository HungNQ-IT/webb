import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'
import { db } from '../db.js'

export function authenticate(required = true) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      if (required) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      req.user = null
      return next()
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET)
      const user = db.prepare('SELECT id, email, name, grade, role, created_at FROM users WHERE id = ?').get(payload.sub)
      if (!user) {
        if (required) {
          return res.status(401).json({ message: 'Unauthorized' })
        }
        req.user = null
        return next()
      }
      req.user = user
      next()
    } catch (err) {
      console.error('JWT error:', err)
      if (required) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      req.user = null
      next()
    }
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}

