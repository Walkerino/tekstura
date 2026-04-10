import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { cn } from '../../lib/utils'
import { fetchAdminReviews } from '../../lib/api'
import { formatAdminDate } from '../../lib/format'
import type { AdminReview } from '../../types/content'

export default function AdminReviewsPage() {
  const [items, setItems] = useState<AdminReview[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    fetchAdminReviews()
      .then((response) => {
        if (!isMounted) {
          return
        }

        setItems(response)
        setStatus('ready')
      })
      .catch((reason: Error) => {
        if (!isMounted) {
          return
        }

        setError(reason.message)
        setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Отзывы</CardTitle>
            <CardDescription>Название компании, логотип и текст отзыва.</CardDescription>
          </div>

          <Link className={cn(buttonVariants({ size: 'sm' }))} to="/admin/reviews/new">
            Добавить отзыв
          </Link>
        </CardHeader>
      </Card>

      {status === 'loading' ? <p className="text-sm text-muted-foreground">Загружаем отзывы...</p> : null}
      {status === 'error' ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="grid gap-4 p-4 sm:grid-cols-[100px_minmax(0,1fr)_auto] sm:items-center">
              <div className="flex h-16 items-center justify-center overflow-hidden rounded-md border border-border bg-muted px-2">
                <img className="max-h-full object-contain" src={item.logoUrl} alt={item.companyName || 'Логотип компании'} />
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-semibold">{item.companyName || 'Без названия компании'}</h4>
                <p className="text-sm text-muted-foreground">{item.quote}</p>
                <p className="text-sm text-muted-foreground">Обновлен: {formatAdminDate(item.updatedAt)}</p>
              </div>

              <Link className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} to={`/admin/reviews/${item.id}`}>
                Редактировать
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {status === 'ready' && items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Отзывов пока нет. Добавьте первый отзыв.</p>
      ) : null}
    </section>
  )
}
