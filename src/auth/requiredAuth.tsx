import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext"; // ajuste o caminho se necessário
import { useContext } from "react";

export function RequireAuth() {
  const { user, isLoading } = useContext(AuthContext)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">Carregando...</h2>
          <p className="mt-2">Por favor, aguarde um momento</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
