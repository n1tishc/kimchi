import { useEffect, useRef, useState } from 'react'

export function useImageUpload({ demoMode, demoImage }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(demoMode ? demoImage : null)
  const previewUrlRef = useRef(null)

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  function revokePreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
  }

  function pick(nextFile) {
    if (!nextFile) return

    revokePreview()
    const previewUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = previewUrl
    setFile(nextFile)
    setPreview(previewUrl)
  }

  function reset() {
    revokePreview()
    setFile(null)
    setPreview(demoMode ? demoImage : null)
  }

  return { file, preview, pick, reset }
}
