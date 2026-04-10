import { LayoutGrid, MessageSquareQuote, Newspaper, Rocket } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logoutAdmin } from '../../lib/api'
import { Button, buttonVariants } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { cn } from '../../lib/utils'

const navigationItems = [
  { icon: LayoutGrid, label: 'Обзор', to: '/admin' },
  { icon: Rocket, label: 'Кейсы', to: '/admin/cases' },
  { icon: Newspaper, label: 'Новости', to: '/admin/news' },
  { icon: MessageSquareQuote, label: 'Отзывы', to: '/admin/reviews' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="min-h-screen bg-[#f1dfcf] px-4 py-5 sm:px-6">
      <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tekstura</p>
            <CardTitle className="text-2xl">Админка</CardTitle>
            <p className="text-sm text-muted-foreground">
              Управление кейсами, новостями и отзывами без лишних экранов.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <nav aria-label="Навигация админки" className="grid gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      cn(
                        buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'sm' }),
                        'justify-start gap-2',
                      )
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className="space-y-3">
              <Button
                className="w-full"
                variant="outline"
                type="button"
                disabled={isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true)
                  setError(null)

                  try {
                    await logoutAdmin()
                    navigate('/admin/login', { replace: true })
                  } catch (reason) {
                    setError(reason instanceof Error ? reason.message : 'Не удалось выйти.')
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
              >
                Выйти
              </Button>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <header className="rounded-xl border border-border bg-card px-6 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Панель управления</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Контент сайта</h2>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
