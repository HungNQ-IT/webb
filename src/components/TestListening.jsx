import { useEffect, useState } from 'react'

function TestListening() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}ielts.json`)
      .then(res => {
        console.log('Response status:', res.status)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log('All IELTS data:', data)
        const listeningTests = data.filter(test => test.type === 'ielts-listening')
        console.log('Listening tests:', listeningTests)
        setData(listeningTests)
      })
      .catch(err => {
        console.error('Error loading data:', err)
        setError(err.message)
      })
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Listening Data</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Found {data.length} listening test(s)</h2>
          {data.map(test => (
            <div key={test.id} className="mb-6 p-4 border border-gray-200 rounded">
              <h3 className="font-bold text-lg">ID: {test.id}</h3>
              <p className="text-gray-600">Title: {test.title}</p>
              <p className="text-gray-600">Type: {test.type}</p>
              <p className="text-gray-600">Sections: {test.sections?.length || 0}</p>
              {test.sections && (
                <div className="mt-2 ml-4">
                  {test.sections.map((section, idx) => (
                    <div key={idx} className="text-sm text-gray-500">
                      - {section.title} ({section.questions?.length || 0} questions)
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestListening
