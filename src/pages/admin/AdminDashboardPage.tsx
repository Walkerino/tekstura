import { BarChart3, MessageSquareQuote, Newspaper, Rocket, Send, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminOverview } from '../../lib/api'
import { cn } from '../../lib/utils'
import { Badge } from '../../components/ui/badge'
import { buttonVariants } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import type { AdminCounts } from '../../types/content'

const emptyCounts: AdminCounts = {
  auditRequests: 0,
  cases: 0,
  contactRequests: 0,
  news: 0,
  reviews: 0,
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<AdminCounts>(emptyCounts)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    fetchAdminOverview()
      .then((response) => {
        if (!isMounted) {
          return
        }

        setCounts(response)
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
        <CardHeader>
          <CardTitle>Обзор контента</CardTitle>
          <CardDescription>Быстрый вход в разделы и текущие счетчики.</CardDescription>
        </CardHeader>
      </Card>

      {status === 'loading' ? <p className="text-sm text-muted-foreground">Загружаем статистику...</p> : null}
      {status === 'error' ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <Badge variant="secondary" className="w-fit gap-1">
              <Rocket size={12} /> Кейсы
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold">{counts.cases}</p>
            <Link className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'w-full')} to="/admin/cases">
              Открыть
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Badge variant="secondary" className="w-fit gap-1">
              <Newspaper size={12} /> Новости
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold">{counts.news}</p>
            <Link className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'w-full')} to="/admin/news">
              Открыть
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Badge variant="secondary" className="w-fit gap-1">
              <MessageSquareQuote size={12} /> Отзывы
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-semibold">{counts.reviews}</p>
            <Link className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'w-full')} to="/admin/reviews">
              Открыть
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Badge variant="outline" className="w-fit gap-1">
              <BarChart3 size={12} /> Аудит
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold">{counts.auditRequests}</p>
            <p className="text-sm text-muted-foreground">Сохраняются в БД</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Badge variant="outline" className="w-fit gap-1">
              <Send size={12} /> Контакты
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-semibold">{counts.contactRequests}</p>
            <p className="text-sm text-muted-foreground">Сохраняются в БД</p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <Badge variant="outline" className="w-fit gap-1">
              <Sparkles size={12} /> Статус
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Панель синхронизирована с API и готова к редактированию.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
