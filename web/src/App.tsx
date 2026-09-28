import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ActivityDetailPage } from './pages/ActivityDetailPage';
import { CreateActivityPage } from './pages/CreateActivityPage';
import { ManageRequestsPage } from './pages/ManageRequestsPage';
import { MapPage } from './pages/MapPage';
import { SpontaneousPage } from './pages/SpontaneousPage';
import { PartnersPage } from './pages/PartnersPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { MessagingPage } from './pages/MessagingPage';
import { MyActivitiesPage } from './pages/MyActivitiesPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CommunityRulesPage } from './pages/CommunityRulesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { TravelProjectsPage } from './pages/TravelProjectsPage';
import { CreateTravelProjectPage } from './pages/CreateTravelProjectPage';
import { TravelProjectDetailPage } from './pages/TravelProjectDetailPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<PrivacyPage />} />
              <Route path="/community-rules" element={<CommunityRulesPage />} />
              <Route path="/help" element={<HowItWorksPage />} />

              {/* Protected Member Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/activities" element={<ProtectedRoute><ActivitiesPage /></ProtectedRoute>} />
              <Route path="/activities/create" element={<ProtectedRoute><CreateActivityPage /></ProtectedRoute>} />
              <Route path="/activity/:id" element={<ProtectedRoute><ActivityDetailPage /></ProtectedRoute>} />
              <Route path="/requests" element={<ProtectedRoute><ManageRequestsPage /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
              <Route path="/spontaneous" element={<ProtectedRoute><SpontaneousPage /></ProtectedRoute>} />
              <Route path="/partners" element={<ProtectedRoute><PartnersPage /></ProtectedRoute>} />
              <Route path="/communities" element={<ProtectedRoute><CommunitiesPage /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
              <Route path="/my-activities" element={<ProtectedRoute><MyActivitiesPage /></ProtectedRoute>} />
              <Route path="/user/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

              {/* Section VOYAGER & PVT */}
              <Route path="/travel" element={<ProtectedRoute><TravelProjectsPage /></ProtectedRoute>} />
              <Route path="/travel/create" element={<ProtectedRoute><CreateTravelProjectPage /></ProtectedRoute>} />
              <Route path="/travel/:id" element={<ProtectedRoute><TravelProjectDetailPage /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

              {/* Catch-all 404 Route */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
