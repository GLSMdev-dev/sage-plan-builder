import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardGestor from "./pages/DashboardGestor";
import DashboardProfessor from "./pages/DashboardProfessor";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import PlanoForm from "./pages/PlanoForm";
import PlanoView from "./pages/PlanoView";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children, requireRole }: { children: React.ReactNode, requireRole?: 'professor' | 'gestor' }) => {
  const { isAuthenticated, isLoading, usuario } = useAuth();
  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><span className="text-muted-foreground">Carregando...</span></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireRole && usuario?.perfil !== requireRole) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><span className="text-muted-foreground">Carregando...</span></div>;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

const LoginRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><span className="text-muted-foreground">Carregando...</span></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Login />;
};

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { usuario } = useAuth();
  if (usuario?.perfil === 'gestor') return <DashboardGestor />;
  return <DashboardProfessor />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            <Route path="/planos/novo" element={<ProtectedRoute><PlanoForm /></ProtectedRoute>} />
            <Route path="/planos/:id" element={<ProtectedRoute><PlanoView /></ProtectedRoute>} />
            <Route path="/planos/:id/editar" element={<ProtectedRoute><PlanoForm /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute requireRole="gestor"><Configuracoes /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
