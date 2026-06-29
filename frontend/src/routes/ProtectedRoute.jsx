import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, loading, children,}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}