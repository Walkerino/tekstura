import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import './content-pages.css'
import AdminLayout from './components/admin/AdminLayout'
import RequireAdmin from './components/admin/RequireAdmin'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminCaseEditorPage from './pages/admin/AdminCaseEditorPage'
import AdminCasesPage from './pages/admin/AdminCasesPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminNewsEditorPage from './pages/admin/AdminNewsEditorPage'
import AdminNewsPage from './pages/admin/AdminNewsPage'
import AdminReviewEditorPage from './pages/admin/AdminReviewEditorPage'
import AdminReviewsPage from './pages/admin/AdminReviewsPage'
import CasesPage from './pages/CasesPage'
import CaseDetailPage from './pages/CaseDetailPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFound'
import PrivacyPolicyPage from './pages/PrivacyPolicy'
import PublicOfferPage from './pages/PublicOffer'

const siteName = 'Текстура'

function resolvePageTitle(pathname: string) {
  if (pathname === '/') {
    return `Главная | ${siteName}`
  }

  if (pathname === '/cases') {
    return `Кейсы | ${siteName}`
  }

  if (pathname.startsWith('/cases/')) {
    return `Кейс | ${siteName}`
  }

  if (pathname === '/privacy-policy') {
    return `Политика конфиденциальности | ${siteName}`
  }

  if (pathname === '/public-offer') {
    return `Публичная оферта | ${siteName}`
  }

  if (pathname === '/admin/login') {
    return `Вход в админку | ${siteName}`
  }

  if (pathname === '/admin') {
    return `Админка: Обзор | ${siteName}`
  }

  if (pathname === '/admin/cases') {
    return `Админка: Кейсы | ${siteName}`
  }

  if (pathname === '/admin/cases/new') {
    return `Админка: Новый кейс | ${siteName}`
  }

  if (pathname.startsWith('/admin/cases/')) {
    return `Админка: Редактирование кейса | ${siteName}`
  }

  if (pathname === '/admin/news') {
    return `Админка: Новости | ${siteName}`
  }

  if (pathname === '/admin/news/new') {
    return `Админка: Новая новость | ${siteName}`
  }

  if (pathname.startsWith('/admin/news/')) {
    return `Админка: Редактирование новости | ${siteName}`
  }

  if (pathname === '/admin/reviews') {
    return `Админка: Отзывы | ${siteName}`
  }

  if (pathname === '/admin/reviews/new') {
    return `Админка: Новый отзыв | ${siteName}`
  }

  if (pathname.startsWith('/admin/reviews/')) {
    return `Админка: Редактирование отзыва | ${siteName}`
  }

  return `Страница не найдена | ${siteName}`
}

function PageTitleManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = resolvePageTitle(pathname)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTitleManager />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/:slug" element={<CaseDetailPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/public-offer" element={<PublicOfferPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="cases" element={<AdminCasesPage />} />
          <Route path="cases/new" element={<AdminCaseEditorPage />} />
          <Route path="cases/:id" element={<AdminCaseEditorPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="news/new" element={<AdminNewsEditorPage />} />
          <Route path="news/:id" element={<AdminNewsEditorPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="reviews/new" element={<AdminReviewEditorPage />} />
          <Route path="reviews/:id" element={<AdminReviewEditorPage />} />
          <Route path="*" element={<Navigate replace to="/admin" />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
