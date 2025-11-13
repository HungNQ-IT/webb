import { Router } from 'express'
import { db } from '../db.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { mapSubmission } from '../utils/format.js'

const router = Router()

router.post('/', authenticate(true), (req, res) => {
  const { quizId, score, total, details } = req.body || {}

  if (typeof quizId !== 'number' || typeof score !== 'number' || typeof total !== 'number') {
    return res.status(400).json({ message: 'quizId, score, total must be numbers' })
  }

  const info = db.prepare(`
    INSERT INTO submissions (user_id, quiz_id, score, total, details)
    VALUES (@user_id, @quiz_id, @score, @total, @details)
  `).run({
    user_id: req.user.id,
    quiz_id: quizId,
    score,
    total,
    details: details ? JSON.stringify(details) : null
  })

  const row = db.prepare(`
    SELECT s.id, s.quiz_id AS quizId, s.score, s.total, s.details, s.created_at AS createdAt
    FROM submissions s
    WHERE s.id = ?
  `).get(info.lastInsertRowid)

  res.status(201).json({ submission: mapSubmission(row) })
})

router.get('/mine', authenticate(true), (req, res) => {

  const rows = db.prepare(`
    SELECT s.id, s.quiz_id AS quizId, s.score, s.total, s.details, s.created_at AS createdAt
    FROM submissions s
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC
  `).all(req.user.id)

  res.json({ submissions: rows.map(mapSubmission) })
})

router.get('/admin', authenticate(true), requireAdmin, (req, res) => {

  const rows = db.prepare(`
    SELECT s.id, s.quiz_id AS quizId, s.score, s.total, s.details, s.created_at AS createdAt,
           u.id AS userId, u.email, u.name, u.grade
    FROM submissions s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
  `).all()

  res.json({ submissions: rows.map(mapSubmission) })
})

export default router

