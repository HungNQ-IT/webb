const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function buildHeaders(token, headers = {}) {
  const result = {
    'Content-Type': 'application/json',
    ...headers
  }
  if (token) {
    result.Authorization = `Bearer ${token}`
  }
  return result
}

export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: buildHeaders(token, headers),
      body: body ? JSON.stringify(body) : undefined
    })
  } catch (err) {
    throw Object.assign(new Error('Không thể kết nối tới máy chủ'), { cause: err })
  }

  const contentType = response.headers.get('content-type')
  const data = contentType && contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const error = typeof data === 'string' ? { message: data } : data
    throw Object.assign(new Error(error?.message || 'Request failed'), { status: response.status, data: error })
  }

  return data
}

export { API_BASE }

