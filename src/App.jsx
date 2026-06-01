import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import FeedPage from '@/pages/FeedPage';
import CreatePostPage from '@/pages/CreatePostPage';
import EditPostPage from '@/pages/EditPostPage';
import PostDetailPage from '@/pages/PostDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsProfilePage from '@/pages/SettingsProfilePage';
import SavedPostsPage from '@/pages/SavedPostsPage';
import SessionsPage from '@/pages/SessionsPage';
import RequestSongPage from '@/pages/RequestSongPage';
import AdminRequestsPage from '@/pages/AdminRequestsPage';
import AdminSolicitudesPage from '@/pages/AdminSolicitudesPage';
import AdminRequestDetailPage from '@/pages/AdminRequestDetailPage';
import MyRequestsPage from '@/pages/MyRequestsPage';
import MisPedidosPage from '@/pages/MisPedidosPage';
import BuzonPage from '@/pages/BuzonPage';
import NormasPage from '@/pages/NormasPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  useEffect(() => {
    // Redirect to HTTPS if on HTTP
    if (typeof window !== 'undefined' && window.location.protocol === 'http:' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      const httpsUrl = window.location.href.replace(/^http:/, 'https:');
      window.location.replace(httpsUrl);
    }
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>BeatStory — Historias que suenan.</title>
      </Helmet>
      <BrowserRouter>
        <SupabaseAuthProvider>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              <Route 
                path="feed" 
                element={
                  <ProtectedRoute>
                    <FeedPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="normas" 
                element={
                  <ProtectedRoute>
                    <NormasPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="create" 
                element={
                  <ProtectedRoute>
                    <CreatePostPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="post/:id/edit" 
                element={
                  <ProtectedRoute>
                    <EditPostPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public — anon puede ver y reproducir */}
              <Route path="post/:id" element={<PostDetailPage />} />
              
              {/* Public Profile View */}
              <Route path="u/:username" element={<ProfilePage />} />
              
              <Route 
                path="saved" 
                element={
                  <ProtectedRoute>
                    <SavedPostsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="sesiones" 
                element={
                  <ProtectedRoute>
                    <SessionsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="buzon" 
                element={
                  <ProtectedRoute>
                    <BuzonPage />
                  </ProtectedRoute>
                } 
              />

              {/* Requests Feature Routes — public, anon puede solicitar */}
              <Route path="solicitar" element={<RequestSongPage />} />
              <Route path="request-song" element={<RequestSongPage />} />
              
              <Route 
                path="mis-pedidos" 
                element={
                  <ProtectedRoute>
                    <MisPedidosPage />
                  </ProtectedRoute>
                } 
              />
              {/* Backwards compatibility for previous routes if any */}
              <Route 
                path="mis-solicitudes" 
                element={
                  <ProtectedRoute>
                    <MisPedidosPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="requests" 
                element={
                  <ProtectedRoute>
                    <MisPedidosPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="admin/solicitudes" 
                element={
                  <ProtectedRoute>
                    <AdminSolicitudesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/requests" 
                element={
                  <ProtectedRoute>
                    <AdminRequestsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/requests/:id" 
                element={
                  <ProtectedRoute>
                    <AdminRequestDetailPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <SettingsProfilePage /> 
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="settings/profile" 
                element={
                  <ProtectedRoute>
                    <SettingsProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </SupabaseAuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;