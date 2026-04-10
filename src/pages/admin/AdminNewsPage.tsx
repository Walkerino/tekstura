import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/badge'
import { buttonVariants } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { cn } from '../../lib/utils'
import { fetchAdminNews } from '../../lib/api'
import { formatAdminDate, formatNewsDate } from '../../lib/format'
import type { AdminNews } from '../../types/content'

export default function AdminNewsPage() {
  const [items, setItems] = useState<AdminNews[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    fetchAdminNews()
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
            <CardTitle>Новости</CardTitle>
            <CardDescription>Дата публикации, заголовок и текст новости.</CardDescription>
          </div>

          <Link className={cn(buttonVariants({ size: 'sm' }))} to="/admin/news/new">
            Добавить новость
          </Link>
        </CardHeader>
      </Card>

      {status === 'loading' ? <p className="text-sm text-muted-foreground">Загружаем новости...</p> : null}
      {status === 'error' ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">{formatNewsDate(item.publishedAt)}</Badge>
                <h4 className="text-base font-semibold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                <p className="text-sm text-muted-foreground">Обновлена: {formatAdminDate(item.updatedAt)}</p>
              </div>

              <Link className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} to={`/admin/news/${item.id}`}>
                Редактировать
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {status === 'ready' && items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Новостей пока нет. Добавьте первую публикацию.</p>
      ) : null}
    </section>
  )
}
