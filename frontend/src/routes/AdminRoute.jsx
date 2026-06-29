import { Navigate } from "react-router-dom";

export default function AdminRoute({ user,  loading, children,}) {
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
  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }
  return children;
}