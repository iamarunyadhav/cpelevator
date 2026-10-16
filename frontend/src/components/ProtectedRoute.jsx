import { Navigate } from "react-router-dom";
import { useLoad } from "@/hooks/useLoad";
import { PageLoader } from "@/components/site/PageLoader";
import { adminService } from "@/services/adminService";

// Only lets signed-in admins through; everyone else is sent to /auth.
export default function ProtectedRoute({ children }) {
  const { data: allowed, loading } = useLoad(() => adminService.isAdmin());
  if (loading) return <PageLoader />;
  return allowed ? children : <Navigate to="/auth" replace />;
}
