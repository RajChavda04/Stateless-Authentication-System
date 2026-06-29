import { useState, useContext, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Lock, Eye, EyeOff, LogOut,
  Pencil, Check, X, ShieldCheck, Monitor, Smartphone, Globe
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

// Parses userAgent string into a readable device label
function parseDevice(userAgent = "") {
  if (/mobile/i.test(userAgent)) return { label: "Mobile", icon: <Smartphone size={16} /> };
  if (/tablet|ipad/i.test(userAgent)) return { label: "Tablet", icon: <Smartphone size={16} /> };
  return { label: "Desktop", icon: <Monitor size={16} /> };
}

function parseBrowser(userAgent = "") {
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return "Chrome";
  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  if (/edge/i.test(userAgent)) return "Edge";
  return "Unknown Browser";
}

export default function ProfilePage() {
  const { user, logout, updateProfile, changePassword, authLoading,
    getSessions, logoutAnotherDevice, logoutAllDevices } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);

  // ── Profile fields ────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateProfile = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    else if (!/^[A-Za-z\s]+$/.test(form.name.trim())) errs.name = "Enter a valid name";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid 10-digit phone number";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    try {
      await updateProfile({
        fullname: form.name,
        phone: form.phone,
      });
      setEditing(false);
    } catch { }
  };

  const handleCancelEdit = () => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
    setFormErrors({});
    setEditing(false);
  };

  // ── Password fields ───────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPwErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const validatePassword = () => {
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = "Current password is required";
    if (!pwForm.newPassword) errs.newPassword = "New password is required";
    else if (!passwordRegex.test(pwForm.newPassword))
      errs.newPassword = "Min 8 chars, uppercase, lowercase, number & special character";
    if (!pwForm.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (pwForm.newPassword !== pwForm.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (pwForm.currentPassword === pwForm.newPassword && pwForm.newPassword)
      errs.newPassword = "New password must differ from current password";
    setPwErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword, pwForm.confirmPassword);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      //error from context
    }
  };

  // ── Sessions / Devices ────────────────────────────────────────
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await getSessions();
      setSessions(data);
    } finally {
      setSessionsLoading(false);
    }
  }, [getSessions]);

  useEffect(() => {
    if (tab === "devices") loadSessions();
  }, [tab, loadSessions]);

  const handlelogoutAnotherDevice = async (sessionId) => {
    setRevokingId(sessionId);
    try {
      await logoutAnotherDevice(sessionId);
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
    } finally {
      setRevokingId(null);
    }
  };

  const handleLogoutAllDevices = async () => {
    await logoutAllDevices();
    navigate("/login");
  };

  // ── Logout ────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // ── Shared styles ─────────────────────────────────────────────
  const card = `w-full max-w-3xl shadow-xl rounded-2xl p-4 sm:p-8 transition-colors duration-300 ${isDark ? "bg-gray-800" : "bg-white"
    }`;

  const labelCls = `block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? "text-gray-400" : "text-gray-500"
    }`;

  const inputCls = (hasError) =>
    `w-full px-3 py-2 rounded-lg border outline-none transition-colors duration-200 text-sm ${hasError
      ? "border-red-500 focus:ring-2 focus:ring-red-400"
      : isDark
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        : "bg-white border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-black"
    } ${!editing
      ? isDark
        ? "bg-gray-700/50 text-gray-300 cursor-default"
        : "bg-gray-50 text-gray-600 cursor-default"
      : ""
    }`;

  const disabledInputCls = `w-full px-3 py-2 rounded-lg border outline-none text-sm cursor-not-allowed ${isDark
      ? "bg-gray-700/50 border-gray-700 text-gray-500"
      : "bg-gray-50 border-gray-200 text-gray-400"
    }`;

  const pwInputWrap = `flex items-center border rounded-lg px-3 focus-within:ring-2 ${isDark
      ? "border-gray-600 bg-gray-700 focus-within:ring-blue-500"
      : "border-gray-300 bg-white focus-within:ring-black"
    }`;

  const pwInputCls = `w-full py-2 outline-none text-sm ${isDark ? "bg-gray-700 text-white placeholder-gray-500" : "bg-white text-black placeholder-gray-400"
    }`;

  const submitBtn = `w-full py-2.5 rounded-lg font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm ${isDark ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-black text-white hover:bg-gray-800"
    }`;

  const Spinner = ({ small } = {}) => (
    <span className="flex items-center justify-center gap-2">
      <span className={`animate-spin rounded-full border-2 border-white/30 border-t-white ${small ? "size-3" : "size-4"}`} />
    </span>
  );

  return (
    <>
      <Navbar />
      <div className={`min-h-screen p-4 sm:p-6 flex flex-col items-center transition-colors duration-300 ${isDark ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-100 to-gray-200"
        }`}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={card}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`size-12 rounded-full flex items-center justify-center font-bold text-lg ${isDark ? "bg-blue-600 text-white" : "bg-black text-white"
                }`}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>
                  {user?.name || "User"}
                </h2>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {user?.email || ""}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 cursor-pointer transition-colors"
            >
              <LogOut size={16} /> Log Out
            </motion.button>
          </div>

          {/* ── Tabs ── */}
          <div className={`flex rounded-xl p-1 mb-6 ${isDark ? "bg-gray-700/60" : "bg-gray-100"}`}>
            {[
              { key: "profile", label: "My Profile", icon: <User size={15} /> },
              { key: "password", label: "Reset Password", icon: <ShieldCheck size={15} /> },
              { key: "devices", label: "Devices", icon: <Monitor size={15} /> },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${tab === key
                    ? isDark
                      ? "bg-blue-600 text-white shadow"
                      : "bg-black text-white shadow"
                    : isDark
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-black"
                  }`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <AnimatePresence mode="wait">

            {/* ── Profile Tab ── */}
            {tab === "profile" && (
              <motion.div key="profile" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                      General Information
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      View and update your personal information
                    </p>
                  </div>
                  {!editing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setEditing(true)}
                      className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${isDark
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <Pencil size={14} /> Edit
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        onClick={handleCancelEdit}
                        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${isDark ? "border-gray-600 text-gray-400 hover:bg-gray-700" : "border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        <X size={14} /> Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        onClick={handleSaveProfile}
                        disabled={authLoading}
                        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 ${isDark ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-black text-white hover:bg-gray-800"
                          }`}
                      >
                        {authLoading ? <Spinner small /> : <><Check size={14} /> Save</>}
                      </motion.button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input name="name" value={form.name} onChange={handleFormChange}
                        disabled={!editing} placeholder="Your full name" className={inputCls(formErrors.name)} />
                      {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input name="phone" value={form.phone} onChange={handleFormChange}
                        disabled={!editing} placeholder="10-digit mobile number" className={inputCls(formErrors.phone)} />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div className={`border-t pt-4 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <h3 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-black"}`}>
                      Contact Details
                    </h3>
                    <p className={`text-xs mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Email cannot be changed
                    </p>
                    <div>
                      <label className={labelCls}>Email ID</label>
                      <input value={form.email} disabled className={disabledInputCls} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Password Tab ── */}
            {tab === "password" && (
              <motion.form
                key="password" variants={fadeUp} initial="hidden" animate="show" exit="exit"
                onSubmit={handleUpdatePassword} className="space-y-5"
              >
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-black"}`}>
                    Reset Password
                  </h3>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Update your account password
                  </p>
                </div>

                {[
                  { field: "currentPassword", label: "Current Password", key: "current", placeholder: "Enter current password" },
                  { field: "newPassword", label: "New Password", key: "new", placeholder: "Enter new password" },
                  { field: "confirmPassword", label: "Confirm Password", key: "confirm", placeholder: "Confirm new password" },
                ].map(({ field, label, key, placeholder }) => (
                  <div key={field}>
                    <label className={labelCls}>{label}</label>
                    <div className={`${pwInputWrap} ${pwErrors[field] ? "border-red-500" : ""}`}>
                      <Lock size={16} className={`${isDark ? "text-gray-500" : "text-gray-400"} mr-2`} />
                      <input
                        name={field}
                        type={showPw[key] ? "text" : "password"}
                        value={pwForm[field]}
                        onChange={handlePwChange}
                        placeholder={placeholder}
                        className={pwInputCls}
                      />
                      <button type="button"
                        onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))}
                        className={`cursor-pointer ml-1 ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-black"}`}>
                        {showPw[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors[field] && <p className="text-red-500 text-xs mt-1">{pwErrors[field]}</p>}
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  type="submit" disabled={authLoading} className={submitBtn}
                >
                  {authLoading ? <Spinner /> : "Update Password"}
                </motion.button>
              </motion.form>
            )}

            {/* ── Devices Tab ── */}
            {tab === "devices" && (
              
              <motion.div key="devices" variants={fadeUp} initial="hidden" animate="show" exit="exit">
                {sessions.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                      Active Sessions
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Devices currently logged into your account
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleLogoutAllDevices}
                    disabled={authLoading || sessionsLoading}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <LogOut size={13} /> Logout All
                  </motion.button>
                </div>
                )}
                {sessionsLoading ? (
                  <div className="flex justify-center py-10">
                    <span
                      className={`size-6 animate-spin rounded-full border-2 border-t-blue-500 ${isDark ? "border-gray-600" : "border-gray-300"
                        }`}
                    />
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-10">
                    <p
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      No other active devices
                    </p>

                    <p
                      className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                    >
                      You're only signed in on this device.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => {
                      const { label, icon } = parseDevice(session.userAgent);
                      const browser = parseBrowser(session.userAgent);
                      const loginTime = new Date(session.createdAt).toLocaleString();

                      return (
                        <div
                          key={session._id}
                          className={`flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border transition-colors ${isDark
                              ? "bg-gray-700/50 border-gray-600"
                              : "bg-gray-50 border-gray-200"
                            }`}
                        >
                          {/* Icon + Info */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-lg shrink-0 ${isDark ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-600"}`}>
                              {icon}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-black"}`}>
                                {label} · {browser}
                              </p>
                              <div className={`flex items-center gap-1 text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                <Globe size={11} />
                                <span className="truncate">{session.ip}</span>
                              </div>
                              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                Logged in {loginTime}
                              </p>
                            </div>
                          </div>

                          {/* Logout button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handlelogoutAnotherDevice(session._id)}
                            disabled={revokingId === session._id}
                            className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-400 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {revokingId === session._id
                              ? <span className="size-3 animate-spin rounded-full border-2 border-red-300 border-t-red-500" />
                              : <><LogOut size={12} /> Logout</>
                            }
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}