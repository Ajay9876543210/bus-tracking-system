import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageDrivers.css";

const API_URL = "https://bus-tracking-backend-n00g.onrender.com";

function ManageDrivers({
    admin,
    onLogout,
    onBack,
    onOpenBuses,
    onOpenDrivers,
    onOpenPassengers,
    onOpenRoutes,
    onOpenStops,
    onOpenRouteStops,
    onOpenTrips,
}) {
    const [drivers, setDrivers] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [driverLoading, setDriverLoading] = useState(false);
    const [driverSaving, setDriverSaving] = useState(false);

    const [driverError, setDriverError] = useState("");
    const [driverMessage, setDriverMessage] = useState("");

    const [deletingDriverId, setDeletingDriverId] = useState(null);

    const [resetDriver, setResetDriver] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [resettingPassword, setResettingPassword] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);

    const getAuthConfig = () => {
        const token = localStorage.getItem("adminToken");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const fetchDrivers = async () => {
        try {
            setDriverLoading(true);
            setDriverError("");

            const response = await axios.get(
                `${API_URL}/api/drivers`,
                getAuthConfig()
            );

            console.log("Drivers response:", response.data);

            const driverData = response.data.data || [];

            setDrivers(
                Array.isArray(driverData)
                    ? driverData
                    : []
            );
        } catch (err) {
            console.error("Fetch drivers error:", err);

            setDriverError(
                err.response?.data?.message ||
                "Failed to load drivers"
            );
        } finally {
            setDriverLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleAddDriver = async (e) => {
        e.preventDefault();

        if (
            !name.trim() ||
            !email.trim() ||
            !password.trim()
        ) {
            setDriverError(
                "Name, email and password are required"
            );
            return;
        }

        try {
            setDriverSaving(true);
            setDriverError("");
            setDriverMessage("");

            const response = await axios.post(
                `${API_URL}/api/drivers`,
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    phone: phone.trim(),
                },
                getAuthConfig()
            );

            console.log(
                "Add driver response:",
                response.data
            );

            setDriverMessage(
                "Driver created successfully!"
            );

            setName("");
            setEmail("");
            setPassword("");
            setPhone("");
            setShowPassword(false);

            await fetchDrivers();
        } catch (err) {
            console.error("Add driver error:", err);

            setDriverError(
                err.response?.data?.message ||
                "Failed to create driver"
            );
        } finally {
            setDriverSaving(false);
        }
    };

    const handleDeleteDriver = async (driver) => {
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete driver "${driver.name}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingDriverId(driver.id);
            setDriverError("");
            setDriverMessage("");

            const response = await axios.delete(
                `${API_URL}/api/drivers/${driver.id}`,
                getAuthConfig()
            );

            console.log(
                "Delete driver response:",
                response.data
            );

            setDriverMessage(
                "Driver deleted successfully!"
            );

            await fetchDrivers();
        } catch (err) {
            console.error(
                "Delete driver error:",
                err
            );

            setDriverError(
                err.response?.data?.message ||
                "Failed to delete driver"
            );
        } finally {
            setDeletingDriverId(null);
        }
    };

    const handleOpenResetPassword = (driver) => {
        setResetDriver(driver);
        setNewPassword("");
        setDriverError("");
        setDriverMessage("");
        setShowNewPassword(false);
    };

    const handleCloseResetPassword = () => {
        if (resettingPassword) {
            return;
        }

        setResetDriver(null);
        setNewPassword("");
        setShowNewPassword(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!resetDriver) {
            return;
        }

        if (newPassword.length < 8) {
            setDriverError(
                "New password must be at least 8 characters"
            );
            return;
        }

        try {
            setResettingPassword(true);
            setDriverError("");
            setDriverMessage("");

            const response = await axios.patch(
                `${API_URL}/api/drivers/${resetDriver.id}/reset-password`,
                {
                    newPassword,
                },
                getAuthConfig()
            );

            console.log(
                "Reset password response:",
                response.data
            );

            setDriverMessage(
                "Driver password reset successfully!"
            );

            setResetDriver(null);
            setNewPassword("");
            setShowNewPassword(false);
        } catch (err) {
            console.error(
                "Reset driver password error:",
                err
            );

            setDriverError(
                err.response?.data?.message ||
                "Failed to reset driver password"
            );
        } finally {
            setResettingPassword(false);
        }
    };

    const handleNavigation = (callback) => {
        setMenuOpen(false);

        if (callback) {
            callback();
        }
    };

    const activeNav = "drivers";

    return (
        <div className="manage-drivers-page">

            {menuOpen && (
                <div
                    className="manage-drivers-overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside
                className={`manage-drivers-sidebar ${
                    menuOpen
                        ? "manage-drivers-sidebar-open"
                        : ""
                }`}
            >
                <div className="manage-drivers-sidebar-brand">
                    <div className="manage-drivers-sidebar-logo">
                        🚌
                    </div>

                    <div>
                        <h2>SRIIT SmartBus</h2>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <nav className="manage-drivers-sidebar-nav">

                    <button
                        className={
                            activeNav === "dashboard"
                                ? "manage-drivers-nav-item active"
                                : "manage-drivers-nav-item"
                        }
                        onClick={() =>
                            handleNavigation(onBack)
                        }
                    >
                        <span>⌂</span>
                        <span>Dashboard</span>
                    </button>

                    <button
                        className={
                            activeNav === "buses"
                                ? "manage-drivers-nav-item active"
                                : "manage-drivers-nav-item"
                        }
                        onClick={() =>
                            handleNavigation(onOpenBuses)
                        }
                    >
                        <span>🚌</span>
                        <span>Buses</span>
                    </button>

                    <button
                        className={
                            activeNav === "drivers"
                                ? "manage-drivers-nav-item active"
                                : "manage-drivers-nav-item"
                        }
                        onClick={() =>
                            handleNavigation(onOpenDrivers)
                        }
                    >
                        <span>👨‍✈️</span>
                        <span>Drivers</span>
                    </button>

                    <button
                        className="manage-drivers-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenPassengers)
                        }
                    >
                        <span>👨‍🎓</span>
                        <span>Passengers</span>
                    </button>

                    <button
                        className="manage-drivers-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenRoutes)
                        }
                    >
                        <span>🛣️</span>
                        <span>Routes</span>
                    </button>

                    <button
                        className="manage-drivers-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenStops)
                        }
                    >
                        <span>📍</span>
                        <span>Stops</span>
                    </button>

                    <button
                        className="manage-drivers-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenRouteStops)
                        }
                    >
                        <span>🔗</span>
                        <span>Route Stops</span>
                    </button>

                    <button
                        className="manage-drivers-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenTrips)
                        }
                    >
                        <span>🚍</span>
                        <span>Trips</span>

                        <span className="manage-drivers-live-dot">
                            LIVE
                        </span>
                    </button>

                </nav>

                <div className="manage-drivers-sidebar-bottom">

                    <div className="manage-drivers-secure-box">
                        <span>🔒</span>

                        <div>
                            <strong>Secure Portal</strong>
                            <small>Admin access only</small>
                        </div>
                    </div>

                    <button
                        className="manage-drivers-sidebar-logout"
                        onClick={onLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>
            </aside>


            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <div className="manage-drivers-main">

                {/* TOP BAR */}

                <header className="manage-drivers-topbar">

                    <button
                        className="manage-drivers-menu-btn"
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                        aria-label="Open menu"
                    >
                        ☰
                    </button>

                    <div className="manage-drivers-mobile-brand">
                        <span>🚌</span>
                        <strong>SRIIT SmartBus</strong>
                    </div>

                    <div className="manage-drivers-topbar-right">

                        <div className="manage-drivers-admin-profile">

                            <div className="manage-drivers-avatar">
                                {(
                                    admin?.name ||
                                    admin?.email ||
                                    "A"
                                )
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="manage-drivers-admin-details">
                                <strong>
                                    {admin?.name || "Admin"}
                                </strong>

                                <span>
                                    Administrator
                                </span>
                            </div>

                        </div>

                        <button
                            className="manage-drivers-top-logout"
                            onClick={onLogout}
                        >
                            Logout
                        </button>

                    </div>

                </header>


                <main className="manage-drivers-content">

                    {/* PAGE HEADING */}

                    <div className="manage-drivers-page-heading">

                        <div>
                            <div className="manage-drivers-breadcrumb">
                                Administration
                                <span>/</span>
                                Drivers
                            </div>

                            <h1>
                                Driver Management
                            </h1>

                            <p>
                                Create, manage and secure driver accounts.
                            </p>
                        </div>

                        <div className="manage-drivers-status-badge">
                            <span />
                            System Ready
                        </div>

                    </div>


                    {/* ALERTS */}

                    {driverError && (
                        <div className="manage-drivers-alert manage-drivers-alert-error">
                            <span>⚠️</span>
                            <div>
                                <strong>Action failed</strong>
                                <p>{driverError}</p>
                            </div>
                        </div>
                    )}

                    {driverMessage && (
                        <div className="manage-drivers-alert manage-drivers-alert-success">
                            <span>✓</span>
                            <div>
                                <strong>Success</strong>
                                <p>{driverMessage}</p>
                            </div>
                        </div>
                    )}


                    {/* =====================================
                        STATS
                    ===================================== */}

                    <section className="manage-drivers-stats">

                        <div className="manage-drivers-stat-card">
                            <div className="manage-drivers-stat-icon">
                                👨‍✈️
                            </div>

                            <div>
                                <span>Total Drivers</span>
                                <strong>{drivers.length}</strong>
                            </div>
                        </div>

                        <div className="manage-drivers-stat-card">
                            <div className="manage-drivers-stat-icon">
                                🔐
                            </div>

                            <div>
                                <span>Admin Managed</span>
                                <strong>{drivers.length}</strong>
                            </div>
                        </div>

                        <div className="manage-drivers-stat-card">
                            <div className="manage-drivers-stat-icon">
                                📱
                            </div>

                            <div>
                                <span>Driver Accounts</span>
                                <strong>{drivers.length}</strong>
                            </div>
                        </div>

                        <div className="manage-drivers-stat-card">
                            <div className="manage-drivers-stat-icon">
                                🛡️
                            </div>

                            <div>
                                <span>Access Control</span>
                                <strong>Active</strong>
                            </div>
                        </div>

                    </section>


                    {/* =====================================
                        CREATE DRIVER
                    ===================================== */}

                    <section className="manage-drivers-create-card">

                        <div className="manage-drivers-section-heading">

                            <div className="manage-drivers-section-icon">
                                +
                            </div>

                            <div>
                                <h2>Create New Driver</h2>

                                <p>
                                    Add a driver account to the SmartBus system.
                                </p>
                            </div>

                        </div>


                        <form
                            onSubmit={handleAddDriver}
                            className="manage-drivers-form"
                        >

                            <div className="manage-drivers-field">

                                <label htmlFor="driver-name">
                                    Driver Name
                                </label>

                                <input
                                    id="driver-name"
                                    type="text"
                                    placeholder="Enter driver name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    autoComplete="name"
                                />

                            </div>


                            <div className="manage-drivers-field">

                                <label htmlFor="driver-email">
                                    Email Address
                                </label>

                                <input
                                    id="driver-email"
                                    type="email"
                                    placeholder="Enter driver email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                />

                            </div>


                            <div className="manage-drivers-field">

                                <label htmlFor="driver-password">
                                    Password
                                </label>

                                <div className="manage-drivers-password-wrapper">

                                    <input
                                        id="driver-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        className="manage-drivers-password-toggle"
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


                            <div className="manage-drivers-field">

                                <label htmlFor="driver-phone">
                                    Phone Number
                                </label>

                                <input
                                    id="driver-phone"
                                    type="text"
                                    placeholder="Enter phone number"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    autoComplete="tel"
                                />

                            </div>


                            <button
                                type="submit"
                                className="manage-drivers-create-btn"
                                disabled={driverSaving}
                            >
                                {driverSaving ? (
                                    <>
                                        <span className="manage-drivers-spinner" />
                                        Creating Driver...
                                    </>
                                ) : (
                                    <>
                                        <span>+</span>
                                        Create Driver
                                    </>
                                )}
                            </button>

                        </form>

                    </section>


                    {/* =====================================
                        DRIVER LIST
                    ===================================== */}

                    <section className="manage-drivers-list-card">

                        <div className="manage-drivers-list-header">

                            <div>
                                <h2>All Drivers</h2>

                                <p>
                                    Manage existing driver accounts and credentials.
                                </p>
                            </div>

                            <button
                                onClick={fetchDrivers}
                                disabled={driverLoading}
                                className="manage-drivers-refresh-btn"
                            >
                                {driverLoading ? (
                                    <>
                                        <span className="manage-drivers-small-spinner" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        ↻ Refresh
                                    </>
                                )}
                            </button>

                        </div>


                        {driverLoading ? (

                            <div className="manage-drivers-state">
                                <div className="manage-drivers-loading-icon">
                                    ⏳
                                </div>

                                <h3>Loading drivers...</h3>

                                <p>
                                    Please wait while driver data is loaded.
                                </p>
                            </div>

                        ) : drivers.length === 0 ? (

                            <div className="manage-drivers-state">
                                <div className="manage-drivers-empty-icon">
                                    👨‍✈️
                                </div>

                                <h3>No drivers found</h3>

                                <p>
                                    Create your first driver account using the form above.
                                </p>
                            </div>

                        ) : (

                            <div className="manage-drivers-table-wrapper">

                                <table className="manage-drivers-table">

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Driver</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {drivers.map((driver) => (

                                            <tr key={driver.id}>

                                                <td>
                                                    <span className="manage-drivers-id">
                                                        #{driver.id}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="manage-drivers-driver-cell">

                                                        <div className="manage-drivers-driver-avatar">
                                                            {(
                                                                driver.name ||
                                                                "D"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {driver.name}
                                                            </strong>

                                                            <span>
                                                                Driver Account
                                                            </span>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="manage-drivers-email">
                                                        {driver.email}
                                                    </span>
                                                </td>

                                                <td>
                                                    {driver.phone || (
                                                        <span className="manage-drivers-muted">
                                                            Not provided
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {driver.created_at
                                                        ? new Date(
                                                              driver.created_at
                                                          ).toLocaleDateString(
                                                              "en-IN",
                                                              {
                                                                  day: "2-digit",
                                                                  month: "short",
                                                                  year: "numeric",
                                                              }
                                                          )
                                                        : "-"}
                                                </td>

                                                <td>

                                                    <div className="manage-drivers-actions">

                                                        <button
                                                            type="button"
                                                            className="manage-drivers-reset-btn"
                                                            onClick={() =>
                                                                handleOpenResetPassword(
                                                                    driver
                                                                )
                                                            }
                                                            disabled={
                                                                deletingDriverId ===
                                                                driver.id
                                                            }
                                                        >
                                                            🔑 Reset
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="manage-drivers-delete-btn"
                                                            onClick={() =>
                                                                handleDeleteDriver(
                                                                    driver
                                                                )
                                                            }
                                                            disabled={
                                                                deletingDriverId ===
                                                                driver.id
                                                            }
                                                        >
                                                            {deletingDriverId ===
                                                            driver.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>


                    {/* =====================================
                        POLICY INFO
                    ===================================== */}

                    <section className="manage-drivers-policy">

                        <div className="manage-drivers-policy-icon">
                            🛡️
                        </div>

                        <div>
                            <h3>Driver Account Security</h3>

                            <p>
                                Driver accounts are created and managed by
                                authorized administrators. Passwords are
                                securely stored and are never displayed in
                                plaintext.
                            </p>
                        </div>

                    </section>

                </main>

            </div>


            {/* =====================================
                RESET PASSWORD MODAL
            ===================================== */}

            {resetDriver && (

                <div
                    className="manage-drivers-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCloseResetPassword();
                        }
                    }}
                >

                    <div
                        className="manage-drivers-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reset-driver-title"
                    >

                        <div className="manage-drivers-modal-header">

                            <div className="manage-drivers-modal-icon">
                                🔐
                            </div>

                            <div>
                                <h3 id="reset-driver-title">
                                    Reset Driver Password
                                </h3>

                                <p>
                                    Update the login password securely.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="manage-drivers-modal-close"
                                onClick={handleCloseResetPassword}
                                disabled={resettingPassword}
                                aria-label="Close"
                            >
                                ×
                            </button>

                        </div>


                        <div className="manage-drivers-driver-preview">

                            <div className="manage-drivers-preview-avatar">
                                {(
                                    resetDriver.name ||
                                    "D"
                                )
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <strong>
                                    {resetDriver.name}
                                </strong>

                                <span>
                                    {resetDriver.email}
                                </span>
                            </div>

                        </div>


                        <form onSubmit={handleResetPassword}>

                            <div className="manage-drivers-field">

                                <label htmlFor="new-driver-password">
                                    New Password
                                </label>

                                <div className="manage-drivers-password-wrapper">

                                    <input
                                        id="new-driver-password"
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
                                        autoFocus
                                        autoComplete="new-password"
                                    />

                                    <button
                                        type="button"
                                        className="manage-drivers-password-toggle"
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

                                <small>
                                    Password must contain at least 8 characters.
                                </small>

                            </div>


                            <div className="manage-drivers-modal-actions">

                                <button
                                    type="button"
                                    className="manage-drivers-cancel-btn"
                                    onClick={handleCloseResetPassword}
                                    disabled={resettingPassword}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="manage-drivers-reset-confirm-btn"
                                    disabled={resettingPassword}
                                >
                                    {resettingPassword ? (
                                        <>
                                            <span className="manage-drivers-spinner" />
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            🔐 Reset Password
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ManageDrivers;