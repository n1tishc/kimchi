import { useEffect, useRef, useState } from 'react'

// Each photo is its own model call, so the batch is capped.
export const MAX_PHOTOS = 6

// Holds the photos chosen for one scan. In demo mode the bundled sample photo
// stands in until the user adds photos of their own.
export function useImageUpload({ demoMode, demoImage }) {
  const demoPhotos = demoMode ? [{ id: 'demo', url: demoImage, file: null }] : []
  const [photos, setPhotos] = useState(demoPhotos)
  const nextIdRef = useRef(0)
  const urlsRef = useRef(new Set())

  useEffect(() => {
    const urls = urlsRef.current
    return () => {
      for (const url of urls) URL.revokeObjectURL(url)
      urls.clear()
    }
  }, [])

  function release(url) {
    if (urlsRef.current.delete(url)) URL.revokeObjectURL(url)
  }

  // Returns how many of the offered files were taken and why the rest were not,
  // so the caller can tell the user.
  function add(fileList) {
    const offered = [...(fileList ?? [])]
    const images = offered.filter((file) => file.type.startsWith('image/'))
    const own = photos.filter((photo) => photo.file)
    const accepted = images.slice(0, Math.max(MAX_PHOTOS - own.length, 0))

    if (accepted.length > 0) {
      const added = accepted.map((file) => {
        const url = URL.createObjectURL(file)
        urlsRef.current.add(url)
        nextIdRef.current += 1
        return { id: `photo-${nextIdRef.current}`, url, file }
      })
      setPhotos([...own, ...added])
    }

    return {
      added: accepted.length,
      notImages: offered.length - images.length,
      overLimit: images.length - accepted.length,
    }
  }

  function remove(id) {
    const target = photos.find((photo) => photo.id === id)
    if (!target?.file) return
    release(target.url)
    const remaining = photos.filter((photo) => photo.id !== id)
    setPhotos(remaining.length > 0 ? remaining : demoPhotos)
  }

  function reset() {
    for (const photo of photos) if (photo.file) release(photo.url)
    setPhotos(demoPhotos)
  }

  const files = photos.filter((photo) => photo.file).map((photo) => photo.file)

  return { photos, files, add, remove, reset }
}
