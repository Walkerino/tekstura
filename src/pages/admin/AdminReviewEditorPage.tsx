import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ImageUploadField from '../../components/admin/ImageUploadField'
import { Button, buttonVariants } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Input } from '../../components/ui/input'
import { deleteAdminReview, fetchAdminReview, saveAdminReview } from '../../lib/api'
import { cn } from '../../lib/utils'
import type { AdminReviewPayload } from '../../types/content'

const emptyForm: AdminReviewPayload = {
  companyName: '',
  logoUrl: '',
  quote: '',
}

export default function AdminReviewEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNew = !id
  const [form, setForm] = useState<AdminReviewPayload>(emptyForm)
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

    fetchAdminReview(id)
      .then((item) => {
        if (!isMounted) {
          return
        }

        setForm({
          companyName: item.companyName,
          logoUrl: item.logoUrl,
          quote: item.quote,
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
          <Link className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'h-auto p-0 text-muted-foreground')} to="/admin/reviews">
            ← К списку отзывов
          </Link>
          <CardTitle>{isNew ? 'Новый отзыв' : 'Редактирование отзыва'}</CardTitle>
          <CardDescription>Логотип и текст — основной сценарий для редактирования блока отзывов.</CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? <p className="text-sm text-muted-foreground">Загружаем отзыв...</p> : null}
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
              const savedItem = await saveAdminReview(id ?? null, form)
              setSuccess('Отзыв сохранен.')

              if (isNew) {
                navigate(`/admin/reviews/${savedItem.id}`, { replace: true })
              }
            } catch (reason) {
              setError(reason instanceof Error ? reason.message : 'Не удалось сохранить отзыв.')
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          <Card>
            <CardContent className="space-y-2 p-6">
              <Label htmlFor="review-company">Название компании</Label>
              <Input
                id="review-company"
                value={form.companyName}
                onChange={(event) =>
                  setForm((current) => ({ ...current, companyName: event.target.value }))
                }
                required
              />
            </CardContent>
          </Card>

          <ImageUploadField
            label="Логотип"
            value={form.logoUrl}
            onChange={(logoUrl) => setForm((current) => ({ ...current, logoUrl }))}
          />

          <Card>
            <CardContent className="space-y-2 p-6">
              <Label htmlFor="review-quote">Текст отзыва</Label>
              <Textarea
                id="review-quote"
                rows={8}
                value={form.quote}
                onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))}
                required
              />
            </CardContent>
          </Card>

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
                  if (!id || !window.confirm('Удалить отзыв?')) {
                    return
                  }

                  setIsSubmitting(true)
                  setError(null)

                  try {
                    await deleteAdminReview(id)
                    navigate('/admin/reviews')
                  } catch (reason) {
                    setError(reason instanceof Error ? reason.message : 'Не удалось удалить отзыв.')
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
