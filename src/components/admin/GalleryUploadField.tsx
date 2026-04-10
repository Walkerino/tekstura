import { useState, type ChangeEvent } from 'react'
import { uploadImage } from '../../lib/api'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'

type GalleryUploadFieldProps = {
  images: string[]
  onChange: (nextImages: string[]) => void
}

export default function GalleryUploadField({
  images,
  onChange,
}: GalleryUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) {
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        uploadedUrls.push(await uploadImage(file))
      }

      onChange([...images, ...uploadedUrls])
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось загрузить изображения.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Галерея кейса</CardTitle>
        <CardDescription>
          Можно загрузить несколько изображений сразу. Порядок на странице кейса соответствует
          порядку в списке ниже.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input type="file" accept="image/*" multiple onChange={handleFilesChange} className="w-full max-w-sm" />

        {images.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className="space-y-3 rounded-md border border-border p-3">
                <img className="h-40 w-full rounded-md object-cover" src={image} alt={`Изображение ${index + 1}`} />

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={index === 0}
                    onClick={() => {
                      const nextImages = [...images]
                      const previous = nextImages[index - 1]
                      nextImages[index - 1] = nextImages[index]
                      nextImages[index] = previous
                      onChange(nextImages)
                    }}
                  >
                    Выше
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => {
                      const nextImages = [...images]
                      const next = nextImages[index + 1]
                      nextImages[index + 1] = nextImages[index]
                      nextImages[index] = next
                      onChange(nextImages)
                    }}
                  >
                    Ниже
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => onChange(images.filter((_, currentIndex) => currentIndex !== index))}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border bg-muted px-4 py-6 text-sm text-muted-foreground">
            Галерея пока пустая
          </div>
        )}

        {isUploading ? <p className="text-sm text-muted-foreground">Загрузка изображений...</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  )
}
