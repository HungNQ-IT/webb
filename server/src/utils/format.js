export function mapUser(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    grade: row.grade,
    role: row.role,
    createdAt: row.created_at
  }
}

export function mapSubmission(row) {
  if (!row) return null
  return {
    id: row.id,
    quizId: row.quizId,
    score: row.score,
    total: row.total,
    details: row.details ? JSON.parse(row.details) : null,
    createdAt: row.createdAt,
    user: row.userId
      ? {
          id: row.userId,
          email: row.email,
          name: row.name,
          grade: row.grade
        }
      : undefined
  }
}

