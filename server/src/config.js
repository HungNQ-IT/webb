import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: process.env.NODE_ENV === 'test'
    ? path.resolve(__dirname, '../.env.test')
    : path.resolve(__dirname, '../.env')
})

export const PORT = process.env.PORT || 5000
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
export const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../data/app.db')
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean)

