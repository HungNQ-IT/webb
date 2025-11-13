// Utility functions for localStorage

export const saveQuizResult = (quizId, result) => {
  const history = getQuizHistory();
  const existingIndex = history.findIndex(item => item.quizId === quizId);
  
  const newResult = {
    quizId,
    timestamp: result.submittedAt || new Date().toISOString(),
    score: result.score,
    total: result.total,
    questionCount: result.questionCount,
    answers: result.answers,
    questions: result.questions
  };

  if (existingIndex >= 0) {
    history[existingIndex] = newResult;
  } else {
    history.push(newResult);
  }

  localStorage.setItem('quizHistory', JSON.stringify(history));
};

export const getQuizHistory = () => {
  const history = localStorage.getItem('quizHistory');
  return history ? JSON.parse(history) : [];
};

export const getQuizResult = (quizId) => {
  const history = getQuizHistory();
  return history.find(item => item.quizId === quizId);
};

export const clearQuizHistory = () => {
  localStorage.removeItem('quizHistory');
};

