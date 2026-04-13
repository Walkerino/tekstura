import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowIcon } from '../../components/icons'
import { getAdminSession, loginAdmin } from '../../lib/api'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('admin@tekstura.local')
  const [password, setPassword] = useState('ChangeMe123!')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    getAdminSession()
      .then((session) => {
        if (!isMounted) {
          return
        }

        setIsAuthenticated(session.authenticated)
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setIsAuthenticated(false)
      })
      .finally(() => {
        if (isMounted) {
          setIsChecking(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Проверяем сессию...
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate replace to="/admin" />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1dfcf] p-4">
      <Card className="w-full max-w-md border-border/80 shadow-lg">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tekstura Admin</p>
          <CardTitle className="text-2xl">Вход в админку</CardTitle>
          <CardDescription>
            После входа откроется управление кейсами, новостями и отзывами. Логин и пароль можно
            поменять в `.env`.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault()
              setIsSubmitting(true)
              setError(null)

              try {
                await loginAdmin(email, password)
                const nextPath =
                  typeof location.state === 'object' &&
                  location.state &&
                  'from' in location.state &&
                  typeof location.state.from === 'object' &&
                  location.state.from &&
                  'pathname' in location.state.from
                    ? String(location.state.from.pathname)
                    : '/admin'

                navigate(nextPath, { replace: true })
              } catch (reason) {
                setError(reason instanceof Error ? reason.message : 'Не удалось войти.')
              } finally {
                setIsSubmitting(false)
              }
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="admin-email">E-mail</Label>
              <Input
                id="admin-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Пароль</Label>
              <Input
                id="admin-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                required
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Входим...' : 'Войти'}
            </Button>
          </form>

          <Link className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground" to="/">
            <ArrowIcon className="arrow-icon" direction="left" />
            <span>Вернуться на сайт</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
