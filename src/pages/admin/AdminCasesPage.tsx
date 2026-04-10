import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/badge'
import { buttonVariants } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { cn } from '../../lib/utils'
import { fetchAdminCases } from '../../lib/api'
import { formatAdminDate } from '../../lib/format'
import type { AdminCase } from '../../types/content'

export default function AdminCasesPage() {
  const [items, setItems] = useState<AdminCase[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    fetchAdminCases()
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
            <CardTitle>Кейсы</CardTitle>
            <CardDescription>Обложка, тег и галерея изображений для страницы кейса.</CardDescription>
          </div>

          <Link className={cn(buttonVariants({ size: 'sm' }))} to="/admin/cases/new">
            Добавить кейс
          </Link>
        </CardHeader>
      </Card>

      {status === 'loading' ? <p className="text-sm text-muted-foreground">Загружаем кейсы...</p> : null}
      {status === 'error' ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="grid gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center">
              <div className="h-20 overflow-hidden rounded-md border border-border bg-muted">
                <img className="h-full w-full object-cover" src={item.coverImageUrl} alt={item.title} />
              </div>

              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">{item.tag}</Badge>
                <h4 className="text-base font-semibold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">Обновлен: {formatAdminDate(item.updatedAt)}</p>
              </div>

              <Link className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))} to={`/admin/cases/${item.id}`}>
                Редактировать
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {status === 'ready' && items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Кейсов пока нет. Добавьте первый из этой страницы.</p>
      ) : null}
    </section>
  )
}
