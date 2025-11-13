import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

