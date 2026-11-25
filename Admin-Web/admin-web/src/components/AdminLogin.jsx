import { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";

const API_URL = "https://bus-tracking-backend-n00g.onrender.com";

function AdminLogin({ onLoginSuccess }) {
    // =====================================
    // Login State
    // =====================================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    // =====================================
    // Forgot Password State
    // =====================================

    const [showForgotPassword, setShowForgotPassword] =
        useState(false);

    const [masterName, setMasterName] = useState("");
    const [masterEmail, setMasterEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState("");
    const [resetError, setResetError] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    // =====================================
    // Admin Login
    // =====================================

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await axios.post(
                `${API_URL}/api/auth/admin/login`,
                {
                    email: email.trim(),
                    password: password,
                }
            );

            console.log(
                "Admin login response:",
                response.data
            );

            const token =
                response.data.data?.token ||
                response.data.token;

            const loggedInAdmin =
                response.data.data?.user ||
                response.data.user ||
                {
                    id: response.data.data?.id,
                    email:
                        response.data.data?.email ||
                        email.trim(),
                    name:
                        response.data.data?.name ||
                        "Admin",
                    role: "admin",
                };

            if (!token) {
                throw new Error(
                    "Login successful but token was not received"
                );
            }

            localStorage.setItem(
                "adminToken",
                token
            );

            localStorage.setItem(
                "admin",
                JSON.stringify(loggedInAdmin)
            );

            setEmail("");
            setPassword("");

            onLoginSuccess(loggedInAdmin);
        } catch (err) {
            console.error(
                "Admin login error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Admin login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // Master Admin Password Reset
    // =====================================

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        setResetMessage("");
        setResetError("");

        if (newPassword !== confirmPassword) {
            setResetError(
                "New password and confirm password do not match"
            );
            return;
        }

        if (newPassword.length < 8) {
            setResetError(
                "New password must be at least 8 characters"
            );
            return;
        }

        try {
            setResetLoading(true);

            const response = await axios.post(
                `${API_URL}/api/auth/admin/forgot-password`,
                {
                    name: masterName.trim(),
                    email: masterEmail.trim(),
                    date_of_birth: dateOfBirth,
                    new_password: newPassword,
                }
            );

            setResetMessage(
                response.data.message ||
                "Master Admin password reset successfully"
            );

            setMasterName("");
            setMasterEmail("");
            setDateOfBirth("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error(
                "Master Admin password reset error:",
                err
            );

            setResetError(
                err.response?.data?.message ||
                "Password reset failed"
            );
        } finally {
            setResetLoading(false);
        }
    };

    // =====================================
    // Show Forgot Password Page
    // =====================================

    const openForgotPassword = () => {
        setShowForgotPassword(true);

        setError("");
        setResetMessage("");
        setResetError("");
    };

    // =====================================
    // Back To Login
    // =====================================

    const backToLogin = () => {
        setShowForgotPassword(false);

        setResetMessage("");
        setResetError("");

        setMasterName("");
        setMasterEmail("");
        setDateOfBirth("");
        setNewPassword("");
        setConfirmPassword("");

        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    // =====================================
    // UI
    // =====================================

    return (
        <div className="admin-login-page">

            <div className="admin-login-layout">

                {/* =================================
                    LEFT BRANDING PANEL
                ================================= */}

                <section className="admin-login-brand-panel">

                    <div className="admin-brand-content">

                        <div className="admin-brand-logo">
                            🚌
                        </div>

                        <h1>
                            SRIIT SmartBus
                        </h1>

                        <p className="admin-brand-tagline">
                            Your journey, our responsibility.
                        </p>

                        <div className="admin-brand-divider" />

                        <h2>
                            SmartBus Administration
                        </h2>

                        <p className="admin-brand-description">
                            Manage buses, drivers, passengers,
                            routes and trips from one secure
                            administration portal.
                        </p>

                        <div className="admin-feature-list">

                            <div className="admin-feature-item">
                                <span>🚌</span>
                                <div>
                                    <strong>Fleet Management</strong>
                                    <small>
                                        Manage buses and their status
                                    </small>
                                </div>
                            </div>

                            <div className="admin-feature-item">
                                <span>👨‍✈️</span>
                                <div>
                                    <strong>Driver Management</strong>
                                    <small>
                                        Manage authorized drivers
                                    </small>
                                </div>
                            </div>

                            <div className="admin-feature-item">
                                <span>📍</span>
                                <div>
                                    <strong>Live Tracking</strong>
                                    <small>
                                        Monitor active bus trips
                                    </small>
                                </div>
                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================
                    RIGHT LOGIN PANEL
                ================================= */}

                <main className="admin-login-panel">

                    <div className="admin-login-card">

                        <div className="admin-mobile-brand">
                            <div className="admin-mobile-logo">
                                🚌
                            </div>

                            <div>
                                <h1>
                                    SRIIT SmartBus
                                </h1>

                                <p>
                                    Your journey, our responsibility.
                                </p>
                            </div>
                        </div>


                        {!showForgotPassword ? (

                            <>
                                <div className="admin-login-heading">

                                    <div className="admin-heading-icon">
                                        🔐
                                    </div>

                                    <div>
                                        <h2>
                                            Admin Login
                                        </h2>

                                        <p>
                                            Welcome back! Sign in to
                                            manage SmartBus.
                                        </p>
                                    </div>

                                </div>


                                {error && (
                                    <div
                                        className="admin-alert admin-alert-error"
                                        role="alert"
                                    >
                                        <span className="admin-alert-icon">
                                            ⚠️
                                        </span>

                                        <span>
                                            {error}
                                        </span>
                                    </div>
                                )}


                                <form
                                    className="admin-login-form"
                                    onSubmit={handleLogin}
                                >

                                    <div className="admin-field">

                                        <label htmlFor="admin-email">
                                            Admin Email
                                        </label>

                                        <div className="admin-input-wrapper">

                                            <span className="admin-input-icon">
                                                ✉️
                                            </span>

                                            <input
                                                id="admin-email"
                                                type="email"
                                                placeholder="Enter admin email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="email"
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div className="admin-field">

                                        <label htmlFor="admin-password">
                                            Password
                                        </label>

                                        <div className="admin-input-wrapper">

                                            <span className="admin-input-icon">
                                                🔒
                                            </span>

                                            <input
                                                id="admin-password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="current-password"
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="admin-password-toggle"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showPassword
                                                    ? "🙈"
                                                    : "👁️"}
                                            </button>

                                        </div>

                                    </div>


                                    <button
                                        type="submit"
                                        className="admin-login-button"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="admin-spinner" />
                                                Logging in...
                                            </>
                                        ) : (
                                            <>
                                                Login to Dashboard
                                                <span>→</span>
                                            </>
                                        )}
                                    </button>

                                </form>


                                <button
                                    type="button"
                                    className="admin-forgot-button"
                                    onClick={openForgotPassword}
                                >
                                    Forgot Master Admin Password?
                                </button>


                                <div className="admin-security-note">

                                    <span>🔒</span>

                                    <div>
                                        <strong>
                                            Authorized Admin Access
                                        </strong>

                                        <small>
                                            This portal is restricted
                                            to authorized administrators.
                                        </small>
                                    </div>

                                </div>

                            </>

                        ) : (

                            <>
                                <div className="admin-login-heading">

                                    <div className="admin-heading-icon recovery-icon">
                                        🛡️
                                    </div>

                                    <div>
                                        <h2>
                                            Master Admin Recovery
                                        </h2>

                                        <p>
                                            Verify your identity to
                                            reset your password.
                                        </p>
                                    </div>

                                </div>


                                <div className="admin-recovery-info">
                                    <span>🔐</span>

                                    <p>
                                        Enter the registered Master Admin
                                        details exactly as stored in the
                                        system.
                                    </p>
                                </div>


                                {resetMessage && (
                                    <div
                                        className="admin-alert admin-alert-success"
                                        role="status"
                                    >
                                        <span className="admin-alert-icon">
                                            ✅
                                        </span>

                                        <span>
                                            {resetMessage}
                                        </span>
                                    </div>
                                )}


                                {resetError && (
                                    <div
                                        className="admin-alert admin-alert-error"
                                        role="alert"
                                    >
                                        <span className="admin-alert-icon">
                                            ⚠️
                                        </span>

                                        <span>
                                            {resetError}
                                        </span>
                                    </div>
                                )}


                                <form
                                    className="admin-login-form"
                                    onSubmit={handleForgotPassword}
                                >

                                    <div className="admin-field">

                                        <label htmlFor="master-name">
                                            Full Name
                                        </label>

                                        <div className="admin-input-wrapper">

                                            <span className="admin-input-icon">
                                                👤
                                            </span>

                                            <input
                                                id="master-name"
                                                type="text"
                                                placeholder="Enter Master Admin name"
                                                value={masterName}
                                                onChange={(e) =>
                                                    setMasterName(
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="name"
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div className="admin-field">

                                        <label htmlFor="master-email">
                                            Email
                                        </label>

                                        <div className="admin-input-wrapper">

                                            <span className="admin-input-icon">
                                                ✉️
                                            </span>

                                            <input
                                                id="master-email"
                                                type="email"
                                                placeholder="Enter Master Admin email"
                                                value={masterEmail}
                                                onChange={(e) =>
                                                    setMasterEmail(
                                                        e.target.value
                                                    )
                                                }
                                                autoComplete="email"
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div className="admin-field">

                                        <label htmlFor="master-dob">
                                            Date of Birth
                                        </label>

                                        <div className="admin-input-wrapper">

                                            <span className="admin-input-icon">
                                                📅
                                            </span>

                                            <input
                                                id="master-dob"
                                                type="date"
                                                value={dateOfBirth}
                                                onChange={(e) =>
                                                    setDateOfBirth(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div className="admin-field">

                                        <label htmlFor="new-password">
                                            New Password
                                        </label>

                                        <div className="admin-input-wrapper">

                                            <span className="admin-input-icon">
                                                🔒
                                            </span>

                                            <input
                                                id="new-password"
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) =>
                                                    setNewPassword(
                                                        e.target.value
                                                    )
                                                }
                                                minLength={8}
                                                autoComplete="new-password"
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="admin-password-toggle"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword
                                                    )
                                                }
                                                aria-label={
                                                    showNewPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showNewPassword
                                                    ? "🙈"
                                                    : "👁️"}
                                            </button>

                                        </div>

                                        <small className="admin-field-hint">
                                            Minimum 8 characters
                                        </small>

                                    </div>


                                    <div className="admin-field">

                                        <label htmlFor="confirm-password">
                                            Confirm New Password
                                        </label>

                                        <div className="admin-input-wrapper">

                                            <span className="admin-input-icon">
                                                🔒
                                            </span>

                                            <input
                                                id="confirm-password"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value
                                                    )
                                                }
                                                minLength={8}
                                                autoComplete="new-password"
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="admin-password-toggle"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showConfirmPassword
                                                    ? "🙈"
                                                    : "👁️"}
                                            </button>

                                        </div>

                                    </div>


                                    <button
                                        type="submit"
                                        className="admin-login-button"
                                        disabled={resetLoading}
                                    >
                                        {resetLoading ? (
                                            <>
                                                <span className="admin-spinner" />
                                                Resetting Password...
                                            </>
                                        ) : (
                                            <>
                                                Reset Master Admin Password
                                                <span>→</span>
                                            </>
                                        )}
                                    </button>

                                </form>


                                <button
                                    type="button"
                                    className="admin-back-button"
                                    onClick={backToLogin}
                                >
                                    <span>←</span>
                                    Back to Admin Login
                                </button>

                            </>

                        )}


                        <div className="admin-login-footer">
                            <span>
                                SRIIT SmartBus
                            </span>

                            <span>•</span>

                            <span>
                                Secure Administration Portal
                            </span>
                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default AdminLogin;