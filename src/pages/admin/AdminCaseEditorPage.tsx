import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import GalleryUploadField from '../../components/admin/GalleryUploadField'
import ImageUploadField from '../../components/admin/ImageUploadField'
import { ArrowIcon } from '../../components/icons'
import { Button, buttonVariants } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { deleteAdminCase, fetchAdminCase, saveAdminCase } from '../../lib/api'
import { cn } from '../../lib/utils'
import type { AdminCasePayload } from '../../types/content'

const emptyForm: AdminCasePayload = {
  coverImageUrl: '',
  description: '',
  galleryImages: [],
  tag: '',
  title: '',
}

export default function AdminCaseEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNew = !id
  const [form, setForm] = useState<AdminCasePayload>(emptyForm)
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setForm(emptyForm)
      return
    }

    let isMounted = true
    setIsLoading(true)

    fetchAdminCase(id)
      .then((item) => {
        if (!isMounted) {
          return
        }

        setForm({
          coverImageUrl: item.coverImageUrl,
          description: item.description,
          galleryImages: item.galleryImages,
          tag: item.tag,
          title: item.title,
        })
      })
      .catch((reason: Error) => {
        if (!isMounted) {
          return
        }

        setError(reason.message)
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [id])

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <Link
            className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'h-auto gap-2 p-0 text-muted-foreground')}
            to="/admin/cases"
          >
            <ArrowIcon className="h-2 w-[35px] shrink-0" direction="left" />
            <span>К списку кейсов</span>
          </Link>
          <CardTitle>{isNew ? 'Новый кейс' : 'Редактирование кейса'}</CardTitle>
          <CardDescription>
            Заполните заголовок, описание, тег, обложку и галерею изображений.
          </CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? <p className="text-sm text-muted-foreground">Загружаем кейс...</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!isLoading ? (
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault()
            setIsSubmitting(true)
            setError(null)
            setSuccess(null)

            try {
              const savedItem = await saveAdminCase(id ?? null, form)
              setSuccess('Кейс сохранен.')

              if (isNew) {
                navigate(`/admin/cases/${savedItem.id}`, { replace: true })
              }
            } catch (reason) {
              setError(reason instanceof Error ? reason.message : 'Не удалось сохранить кейс.')
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
        <Card>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="case-title">Заголовок</Label>
                <Input
                  id="case-title"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="case-tag">Тег</Label>
                <Input
                  id="case-tag"
                  value={form.tag}
                  onChange={(event) => setForm((current) => ({ ...current, tag: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="case-description">Описание кейса</Label>
                <Textarea
                  id="case-description"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <ImageUploadField
            label="Обложка кейса"
            description="Это изображение используется в карточке кейса и в шапке страницы."
            value={form.coverImageUrl}
            onChange={(coverImageUrl) => setForm((current) => ({ ...current, coverImageUrl }))}
          />

          <GalleryUploadField
            images={form.galleryImages}
            onChange={(galleryImages) => setForm((current) => ({ ...current, galleryImages }))}
          />

          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Сохраняем...' : 'Сохранить'}
            </Button>

            {!isNew ? (
              <Button
                variant="outline"
                type="button"
                disabled={isSubmitting}
                onClick={async () => {
                  if (!id || !window.confirm('Удалить кейс?')) {
                    return
                  }

                  setIsSubmitting(true)
                  setError(null)

                  try {
                    await deleteAdminCase(id)
                    navigate('/admin/cases')
                  } catch (reason) {
                    setError(reason instanceof Error ? reason.message : 'Не удалось удалить кейс.')
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
              >
                Удалить
              </Button>
            ) : null}
          </div>
        </form>
      ) : null}
    </section>
  )
}
