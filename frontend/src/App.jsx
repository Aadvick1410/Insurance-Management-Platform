import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import CustomerListPage from './pages/customers/CustomerListPage'
import CustomerFormPage from './pages/customers/CustomerFormPage'
import CustomerDetailPage from './pages/customers/CustomerDetailPage'
import PolicyListPage from './pages/policies/PolicyListPage'
import PolicyFormPage from './pages/policies/PolicyFormPage'
import PolicyDetailPage from './pages/policies/PolicyDetailPage'
import PaymentListPage from './pages/payments/PaymentListPage'
import PaymentFormPage from './pages/payments/PaymentFormPage'
import PaymentHistoryPage from './pages/payments/PaymentHistoryPage'
import ClaimListPage from './pages/claims/ClaimListPage'
import ClaimFormPage from './pages/claims/ClaimFormPage'
import ClaimDetailPage from './pages/claims/ClaimDetailPage'
import DocumentListPage from './pages/documents/DocumentListPage'
import DocumentUploadPage from './pages/documents/DocumentUploadPage'
import ReportsDashboard from './pages/dashboard/ReportsDashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<ReportsDashboard />} />
            <Route path="customers" element={<CustomerListPage />} />
            <Route path="customers/new" element={<CustomerFormPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="customers/:id/edit" element={<CustomerFormPage />} />
            <Route path="policies" element={<PolicyListPage />} />
            <Route path="policies/new" element={<PolicyFormPage />} />
            <Route path="policies/:id" element={<PolicyDetailPage />} />
            <Route path="policies/:id/edit" element={<PolicyFormPage />} />
            <Route path="payments" element={<PaymentListPage />} />
            <Route path="payments/new" element={<PaymentFormPage />} />
            <Route path="payments/history/:policyId" element={<PaymentHistoryPage />} />
            <Route path="claims" element={<ClaimListPage />} />
            <Route path="claims/new" element={<ClaimFormPage />} />
            <Route path="claims/:id" element={<ClaimDetailPage />} />
            <Route path="claims/:id/edit" element={<ClaimFormPage />} />
            <Route path="documents" element={<DocumentListPage />} />
            <Route path="documents/upload" element={<DocumentUploadPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
