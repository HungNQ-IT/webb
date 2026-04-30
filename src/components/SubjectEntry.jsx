import { Navigate, useParams } from 'react-router-dom'
import CategoryList from './CategoryList'

function SubjectEntry({ quizzes = [], ieltsTests = [] }) {
  const { subject } = useParams()
  const decodedSubject = decodeURIComponent(subject || '')

  if (decodedSubject === 'IELTS') {
    return <CategoryList quizzes={quizzes} ieltsTests={ieltsTests} />
  }

  const hasSubjectContent = quizzes.some((quiz) => quiz.subject === decodedSubject)

  if (hasSubjectContent) {
    return <Navigate to={`/subject/${encodeURIComponent(decodedSubject)}/grades`} replace />
  }

  return <Navigate to="/subjects" replace />
}

export default SubjectEntry
