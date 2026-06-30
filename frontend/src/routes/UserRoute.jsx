import { Navigate } from "react-router-dom";

export default function UserRoute({ user, loading, children }) {
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

  // Only normal users can access these pages
  if (user.role !== "user") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}