import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import DashboardProfessor from "./pages/DashboardProfessor";
import DashboardGestor from "./pages/DashboardGestor";
import PlanoForm from "./pages/PlanoForm";
import PlanoView from "./pages/PlanoView";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

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
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            <Route path="/planos/novo" element={<ProtectedRoute><PlanoForm /></ProtectedRoute>} />
            <Route path="/planos/:id" element={<ProtectedRoute><PlanoView /></ProtectedRoute>} />
            <Route path="/planos/:id/editar" element={<ProtectedRoute><PlanoForm /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
