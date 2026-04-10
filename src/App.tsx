import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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
import CaseDetailPage from './pages/CaseDetailPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFound'
import PrivacyPolicyPage from './pages/PrivacyPolicy'
import PublicOfferPage from './pages/PublicOffer'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
