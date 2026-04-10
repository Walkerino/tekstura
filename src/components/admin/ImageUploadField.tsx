import { useState, type ChangeEvent } from 'react'
import { uploadImage } from '../../lib/api'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'

type ImageUploadFieldProps = {
  description?: string
  label: string
  onChange: (value: string) => void
  value: string
}

export default function ImageUploadField({
  description,
  label,
  onChange,
  value,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const uploadedUrl = await uploadImage(file)
      onChange(uploadedUrl)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось загрузить изображение.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent className="space-y-4">
        {value ? (
          <div className="overflow-hidden rounded-md border border-border bg-muted">
            <img className="max-h-60 w-full object-cover" src={value} alt={label} />
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border bg-muted px-4 py-6 text-sm text-muted-foreground">
            Изображение пока не загружено
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Input type="file" accept="image/*" onChange={handleFileChange} className="w-full max-w-sm" />
          {value ? (
            <Button variant="outline" size="sm" type="button" onClick={() => onChange('')}>
              Удалить
            </Button>
          ) : null}
        </div>

        {isUploading ? <p className="text-sm text-muted-foreground">Загрузка изображения...</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  )
}
