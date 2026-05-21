import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { DiscoverPage }   from '@/pages/DiscoverPage'
import { SearchPage }     from '@/pages/SearchPage'
import { BorrowingsPage } from '@/pages/BorrowingsPage'
import { LentOutPage }    from '@/pages/LentOutPage'
import { HistoryPage }    from '@/pages/HistoryPage'
import { ProfilePage }    from '@/pages/ProfilePage'
import { LoginPage }      from '@/pages/LoginPage'
import { RegisterPage }   from '@/pages/RegisterPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route index             element={<DiscoverPage />} />
            <Route path="search"     element={<SearchPage />} />
            <Route path="borrowings" element={<BorrowingsPage />} />
            <Route path="lent"       element={<LentOutPage />} />
            <Route path="history"    element={<HistoryPage />} />
            <Route path="profile"    element={<ProfilePage />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
