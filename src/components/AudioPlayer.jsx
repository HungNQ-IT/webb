import { useState, useRef, useEffect } from 'react'

function AudioPlayer({ audioUrl, title }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Check if Google Drive link
  const isGoogleDrive = audioUrl && (
    audioUrl.includes('drive.google.com') || 
    audioUrl.includes('docs.google.com')
  )
  
  // Convert Google Drive link to embed
  const getEmbedUrl = (url) => {
    if (!url) return null
    
    // Extract file ID from various Google Drive URL formats
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`
      }
    }
    
    return url
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = (e) => {
      console.error('Audio error:', e)
      setError('Không thể tải audio. Vui lòng kiểm tra link.')
      setIsLoading(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    if (!audio) return

    const seekTime = parseFloat(e.target.value)
    audio.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const handleVolumeChange = (e) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
  }

  const handlePlaybackRateChange = (rate) => {
    const audio = audioRef.current
    if (!audio) return

    audio.playbackRate = rate
    setPlaybackRate(rate)
  }

  const skipTime = (seconds) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds))
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">⚠️ {error}</p>
        <p className="text-red-600 text-xs mt-2">Link: {audioUrl}</p>
      </div>
    )
  }

  // Nếu là Google Drive, dùng iframe embed
  if (isGoogleDrive) {
    const embedUrl = getEmbedUrl(audioUrl)
    
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">
                {title || 'IELTS Listening Audio'}
              </h3>
              <p className="text-blue-100 text-sm">
                Google Drive Audio Player
              </p>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-gray-50 p-4">
          <div className="bg-white rounded-lg shadow-inner overflow-hidden border border-gray-200">
            <iframe
              src={embedUrl}
              width="100%"
              height="180"
              allow="autoplay"
              style={{ border: 'none', display: 'block' }}
              title="Google Drive Audio Player"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-blue-700">Hướng dẫn:</strong> Click nút ▶️ trong player để phát audio. 
                Bạn có thể tua, điều chỉnh âm lượng và tốc độ phát trực tiếp trong player.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Nếu không phải Google Drive, dùng audio tag thông thường
  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 overflow-hidden">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">
              {title || 'IELTS Listening Audio'}
            </h3>
            {isLoading ? (
              <p className="text-blue-100 text-sm">⏳ Đang tải audio...</p>
            ) : (
              <p className="text-blue-100 text-sm">
                {isPlaying ? '🔊 Đang phát...' : '⏸️ Sẵn sàng'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Player Body */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              disabled={isLoading}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-700 mt-2">
            <span className="bg-white px-2 py-1 rounded shadow-sm">{formatTime(currentTime)}</span>
            <span className="bg-white px-2 py-1 rounded shadow-sm">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {/* Lùi 10s */}
          <button
            onClick={() => skipTime(-10)}
            disabled={isLoading}
            className="group w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-blue-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:scale-105"
            title="Lùi 10 giây"
          >
            <svg className="w-6 h-6 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
            </svg>
          </button>
          
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="group w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-110"
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
          
          {/* Tua 10s */}
          <button
            onClick={() => skipTime(10)}
            disabled={isLoading}
            className="group w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-blue-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:scale-105"
            title="Tua 10 giây"
          >
            <svg className="w-6 h-6 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
            </svg>
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between gap-4 bg-white rounded-lg p-4 shadow-sm">
          {/* Playback Speed */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <div className="flex gap-1">
              {[0.75, 1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handlePlaybackRateChange(rate)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    playbackRate === rate
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-2xl hover:scale-110 transition-transform">
              {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              disabled={isLoading}
              className="w-24 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-blue-700">Lưu ý:</strong> Bạn sẽ nghe audio một lần. Hãy tập trung và ghi chú trong khi nghe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
