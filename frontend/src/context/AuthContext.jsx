import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AuthContext = createContext(undefined);

function normalizeUser(user) {
  return {
    id: user._id ?? user.id ?? "",
    name: user.fullname ?? user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    avatarUrl: user.profileImage?.url ?? "",
    role: user.role ?? "user",
    gender: user.gender ?? "",
    dateOfBirth: user.dateOfBirth ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const handleError = (error, fallback) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      fallback;

    toast.error(message);
    throw error;
  };

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/getme");
      const profile = data?.user || data?.data?.user || data;
      const normalizedUser = normalizeUser(profile);

      setUser(normalizedUser);

      return normalizedUser;
    } catch (error) {
      setUser(null);
      if (error?.response?.status !== 401) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await fetchProfile();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [fetchProfile]);

  const login = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      try {
        // await api.post("/api/auth/login", { email, password, role: "user" });
        await api.post("/api/auth/login", { email, password });
        const profile = await fetchProfile();
        toast.success("Login Successful");
        return profile;
      } catch (error) {
        handleError(error, "Unable to login");
      } finally {
        setAuthLoading(false);
      }
    },
    [fetchProfile]
  );

  const register = useCallback(
    async (input) => {
      setAuthLoading(true);
      try {
        await api.post("/api/auth/register", {
          fullname: input.name,
          email: input.email,
          phone: input.phone,
          password: input.password,
        });
        toast.success("Registration Successful");
      } catch (error) {
        handleError(error, "Unable to register");
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setAuthLoading(true);
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setAuthLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(
    async (email) => {
      setAuthLoading(true);
      try {
        await api.post("/api/auth/forgot-password", { email });
        toast.success("Reset OTP sent. Check your email.");
      } catch (error) {
        handleError(error, "Unable to send reset OTP");
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (email, password, confirmPassword) => {
      setAuthLoading(true);
      try {
        await api.post("/api/auth/reset-password", { email, password, confirmPassword });
        toast.success("Password reset successful. You can now login.");
      } catch (error) {
        handleError(error, "Unable to reset password");
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const sendOtp = useCallback(
    async (name, email) => {
      setAuthLoading(true);
      try {
        await api.post("/api/auth/sendotp", { fullname: name, email });
        toast.success("OTP sent. Check your email.");
      } catch (error) {
        handleError(error, "Unable to send OTP");
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const verifyOtp = useCallback(
    async (email, otp) => {
      setAuthLoading(true);
      try {
        await api.post("/api/auth/verifyotp", { email, otp });
        toast.success("Email verified successfully.");
      } catch (error) {
        handleError(error, "Unable to verify OTP");
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const resendOtp = useCallback(
    async (email) => {
      setAuthLoading(true);
      try {
        await api.post("/api/auth/resendotp", { email });
        toast.success("OTP resent. Check your email.");
      } catch (error) {
        handleError(error, "Unable to resend OTP");
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const changePassword = useCallback(
    async (currentPassword, newPassword, confirmPassword) => {
      setAuthLoading(true);
      try {
        const { data } = await api.put("/api/auth/change-password", {
          currentPassword,
          newPassword,
          confirmPassword,
        });
        toast.success(data?.message || "Password changed successfully");
        return data;
      } catch (error) {
        handleError(error, "Unable to change password");
        throw error;
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const updateProfile = useCallback(
    async (profileData) => {
      try {
        const { data } = await api.put("/api/users/profile", profileData);
        const updatedUser = data?.user || data?.data?.user;
        if (updatedUser) setUser(normalizeUser(updatedUser));
        toast.success("Profile updated successfully");
        return data;
      } catch (error) {
        handleError(error, "Failed to update profile");
      }
    },
    []
  );

  const getSessions = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/sessions");
      return data?.sessions || [];
    } catch (error) {
      handleError(error, "Unable to fetch sessions");
      return [];
    }
  }, []);

  const logoutAnotherDevice = useCallback(async (sessionId) => {
    setAuthLoading(true);
    try {
      await api.delete(`/api/auth/sessions/${sessionId}`);
      toast.success("Device logged out successfully");
    } catch (error) {
      handleError(error, "Unable to logout device");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logoutAllDevices = useCallback(async () => {
    setAuthLoading(true);
    try {
      await api.post("/api/auth/logout-all-devices");
      toast.success("Logged out from all other devices");
    } catch (error) {
      handleError(error, "Unable to logout all other devices");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        authLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        sendOtp,
        verifyOtp,
        resendOtp,
        fetchProfile,
        changePassword,
        updateProfile,
        getSessions,
        logoutAnotherDevice,
        logoutAllDevices
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}