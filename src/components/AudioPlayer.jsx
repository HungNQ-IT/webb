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

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          🎧 {title || 'IELTS Listening Audio'}
        </h3>
        {isLoading && (
          <p className="text-sm text-gray-600 mt-1">Đang tải audio...</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          disabled={isLoading}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Play/Pause and Skip */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => skipTime(-10)}
            disabled={isLoading}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-blue-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Lùi 10 giây"
          >
            ⏪
          </button>
          
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <button
            onClick={() => skipTime(10)}
            disabled={isLoading}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-blue-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Tua 10 giây"
          >
            ⏩
          </button>
        </div>

        {/* Playback Speed */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Tốc độ:</span>
          <div className="flex gap-1">
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => handlePlaybackRateChange(rate)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  playbackRate === rate
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <span className="text-lg" title="Âm lượng">
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            disabled={isLoading}
            className="w-20 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-600">
          💡 <strong>Lưu ý:</strong> Bạn sẽ nghe audio một lần. Hãy tập trung và ghi chú trong khi nghe.
        </p>
      </div>
    </div>
  )
}

export default AudioPlayer
