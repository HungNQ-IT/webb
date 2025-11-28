import katex from 'katex'

function renderLatex(latex) {
  try {
    return { __html: katex.renderToString(latex, { throwOnError: false }) }
  } catch (e) {
    return { __html: latex }
  }
}

function resolveImageSrc(image) {
  if (!image) return null
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  const baseUrl = import.meta.env.BASE_URL || '/'
  // Allow both 'images/foo.png' or '/images/foo.png'
  const normalized = image.startsWith('/') ? image.slice(1) : image
  return `${baseUrl}${normalized}`
}

export default function RichContent({ text, eq, image, className }) {
  const imgSrc = resolveImageSrc(image)
  return (
    <div className={className || ''}>
      {text && (
        <p className="whitespace-pre-line text-gray-800 dark:text-gray-100">{text}</p>
      )}
      {eq && (
        <div className="mt-2 text-gray-900 dark:text-gray-100" dangerouslySetInnerHTML={renderLatex(eq)} />
      )}
      {imgSrc && (
        <div className="mt-3">
          <img src={imgSrc} alt="illustration" className="max-w-full rounded-lg border" />
        </div>
      )}
    </div>
  )
}
