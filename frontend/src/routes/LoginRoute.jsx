import { Navigate } from "react-router-dom";

export default function LoginRoute({ user, loading, children,}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  if (!user) {  return children; }
  return (
    <Navigate
      to={
        user.role === "admin"
          ? "/admin/dashboard"
          : "/home"
      }
      replace
    />
  );
}