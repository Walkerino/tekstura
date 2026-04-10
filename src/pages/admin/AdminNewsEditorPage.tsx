import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, buttonVariants } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { deleteAdminNews, fetchAdminNewsItem, saveAdminNews } from '../../lib/api'
import { toDateInputValue } from '../../lib/format'
import { cn } from '../../lib/utils'
import type { AdminNewsPayload } from '../../types/content'

type NewsFormState = AdminNewsPayload & {
  publishedAt: string
}

const emptyForm: NewsFormState = {
  content: '',
  publishedAt: '',
  title: '',
}

export default function AdminNewsEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNew = !id
  const [form, setForm] = useState<NewsFormState>(emptyForm)
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

    fetchAdminNewsItem(id)
      .then((item) => {
        if (!isMounted) {
          return
        }

        setForm({
          content: item.content,
          publishedAt: toDateInputValue(item.publishedAt),
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
          <Link className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'h-auto p-0 text-muted-foreground')} to="/admin/news">
            ← К списку новостей
          </Link>
          <CardTitle>{isNew ? 'Новая новость' : 'Редактирование новости'}</CardTitle>
          <CardDescription>Дата публикации хранится как дата, а на сайте выводится в русском формате.</CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? <p className="text-sm text-muted-foreground">Загружаем новость...</p> : null}
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
              const savedItem = await saveAdminNews(id ?? null, {
                ...form,
                publishedAt: `${form.publishedAt}T00:00:00.000Z`,
              })
              setSuccess('Новость сохранена.')

              if (isNew) {
                navigate(`/admin/news/${savedItem.id}`, { replace: true })
              }
            } catch (reason) {
              setError(reason instanceof Error ? reason.message : 'Не удалось сохранить новость.')
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          <Card>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="news-date">Дата публикации</Label>
                <Input
                  id="news-date"
                  type="date"
                  value={form.publishedAt}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, publishedAt: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="news-title">Заголовок</Label>
                <Input
                  id="news-title"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 p-6">
              <Label htmlFor="news-content">Текст новости</Label>
              <Textarea
                id="news-content"
                rows={12}
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({ ...current, content: event.target.value }))
                }
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
                  if (!id || !window.confirm('Удалить новость?')) {
                    return
                  }

                  setIsSubmitting(true)
                  setError(null)

                  try {
                    await deleteAdminNews(id)
                    navigate('/admin/news')
                  } catch (reason) {
                    setError(reason instanceof Error ? reason.message : 'Не удалось удалить новость.')
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
