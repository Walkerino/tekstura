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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
            После входа откроется управление кейсами, новостями и отзывами. Используйте учетные
            данные администратора.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            autoComplete="off"
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
            <input
              type="text"
              name="fake-username"
              autoComplete="username"
              tabIndex={-1}
              className="hidden"
              aria-hidden="true"
            />
            <input
              type="password"
              name="fake-password"
              autoComplete="new-password"
              tabIndex={-1}
              className="hidden"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <Label htmlFor="admin-email">E-mail</Label>
              <Input
                id="admin-email"
                name="admin-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Пароль</Label>
              <Input
                id="admin-password"
                name="admin-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="new-password"
                data-1p-ignore="true"
                data-lpignore="true"
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
