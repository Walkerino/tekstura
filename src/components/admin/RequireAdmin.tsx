import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAdminSession } from '../../lib/api'

type RequireAdminProps = {
  children: ReactNode
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Проверяем доступ...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/admin/login" state={{ from: location }} />
  }

  return <>{children}</>
}
