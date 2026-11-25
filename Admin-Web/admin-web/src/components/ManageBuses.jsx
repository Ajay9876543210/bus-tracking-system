import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageBuses.css";

const API_URL = "https://bus-tracking-backend-n00g.onrender.com";

function ManageBuses({
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
    const [buses, setBuses] = useState([]);
    const [busNumber, setBusNumber] = useState("");

    const [busLoading, setBusLoading] = useState(false);
    const [busSaving, setBusSaving] = useState(false);
    const [deletingBusId, setDeletingBusId] = useState(null);

    const [busError, setBusError] = useState("");
    const [busMessage, setBusMessage] = useState("");

    const [menuOpen, setMenuOpen] = useState(false);

    const getAuthConfig = () => {
        const token = localStorage.getItem("adminToken");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const fetchBuses = async () => {
        try {
            setBusLoading(true);
            setBusError("");

            const response = await axios.get(
                `${API_URL}/api/buses`,
                getAuthConfig()
            );

            console.log("Buses response:", response.data);

            const busData = response.data.data || [];

            setBuses(
                Array.isArray(busData)
                    ? busData
                    : []
            );
        } catch (err) {
            console.error("Fetch buses error:", err);

            setBusError(
                err.response?.data?.message ||
                "Failed to load buses"
            );
        } finally {
            setBusLoading(false);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, []);

    const handleAddBus = async (e) => {
        e.preventDefault();

        if (!busNumber.trim()) {
            setBusError("Bus number is required");
            return;
        }

        try {
            setBusSaving(true);
            setBusError("");
            setBusMessage("");

            const response = await axios.post(
                `${API_URL}/api/buses`,
                {
                    bus_number: busNumber.trim(),
                },
                getAuthConfig()
            );

            console.log(
                "Add bus response:",
                response.data
            );

            setBusMessage(
                "Bus added successfully!"
            );

            setBusNumber("");

            await fetchBuses();
        } catch (err) {
            console.error(
                "Add bus error:",
                err
            );

            setBusError(
                err.response?.data?.message ||
                "Failed to add bus"
            );
        } finally {
            setBusSaving(false);
        }
    };

    const handleBusStatus = async (
        busId,
        currentStatus
    ) => {
        const newStatus =
            currentStatus === "active"
                ? "inactive"
                : "active";

        try {
            setBusError("");
            setBusMessage("");

            await axios.patch(
                `${API_URL}/api/buses/${busId}/status`,
                {
                    status: newStatus,
                },
                getAuthConfig()
            );

            setBusMessage(
                `Bus status changed to ${newStatus}.`
            );

            await fetchBuses();
        } catch (err) {
            console.error(
                "Bus status error:",
                err
            );

            setBusError(
                err.response?.data?.message ||
                "Failed to update bus status"
            );
        }
    };

    const handleDeleteBus = async (bus) => {
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete bus "${bus.bus_number}"?\n\n` +
            `Delete this bus only if it has been permanently removed from the organization.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingBusId(bus.id);
            setBusError("");
            setBusMessage("");

            const response = await axios.delete(
                `${API_URL}/api/buses/${bus.id}`,
                getAuthConfig()
            );

            setBusMessage(
                response.data?.message ||
                "Bus deleted successfully."
            );

            await fetchBuses();
        } catch (err) {
            console.error(
                "Delete bus error:",
                err
            );

            setBusError(
                err.response?.data?.message ||
                "Failed to delete bus"
            );
        } finally {
            setDeletingBusId(null);
        }
    };

    const handleNavigation = (callback) => {
        setMenuOpen(false);

        if (callback) {
            callback();
        }
    };

    const activeBuses = buses.filter(
        (bus) => (bus.status || "inactive") === "active"
    );

    const inactiveBuses = buses.filter(
        (bus) => (bus.status || "inactive") !== "active"
    );

    const adminInitial =
        admin?.name?.charAt(0)?.toUpperCase() ||
        admin?.email?.charAt(0)?.toUpperCase() ||
        "A";

    return (
        <div className="manage-buses-page">

            {/* MOBILE OVERLAY */}

            {menuOpen && (
                <div
                    className="manage-buses-overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* SIDEBAR */}

            <aside
                className={`manage-buses-sidebar ${
                    menuOpen
                        ? "manage-buses-sidebar-open"
                        : ""
                }`}
            >

                <div className="manage-buses-sidebar-brand">

                    <div className="manage-buses-brand-icon">
                        🚌
                    </div>

                    <div>
                        <h2>SRIIT SmartBus</h2>
                        <p>Admin Portal</p>
                    </div>

                </div>

                <nav className="manage-buses-navigation">

                    <button
                        onClick={() =>
                            handleNavigation(onBack)
                        }
                        className="manage-buses-nav-item"
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        onClick={() =>
                            handleNavigation(onOpenBuses)
                        }
                        className="manage-buses-nav-item active"
                    >
                        <span>🚌</span>
                        Buses
                    </button>

                    <button
                        onClick={() =>
                            handleNavigation(onOpenDrivers)
                        }
                        className="manage-buses-nav-item"
                    >
                        <span>👨‍✈️</span>
                        Drivers
                    </button>

                    <button
                        onClick={() =>
                            handleNavigation(onOpenPassengers)
                        }
                        className="manage-buses-nav-item"
                    >
                        <span>👥</span>
                        Passengers
                    </button>

                    <button
                        onClick={() =>
                            handleNavigation(onOpenRoutes)
                        }
                        className="manage-buses-nav-item"
                    >
                        <span>🛣️</span>
                        Routes
                    </button>

                    <button
                        onClick={() =>
                            handleNavigation(onOpenStops)
                        }
                        className="manage-buses-nav-item"
                    >
                        <span>📍</span>
                        Stops
                    </button>

                    <button
                        onClick={() =>
                            handleNavigation(onOpenRouteStops)
                        }
                        className="manage-buses-nav-item"
                    >
                        <span>🔗</span>
                        Route Stops
                    </button>

                    <button
                        onClick={() =>
                            handleNavigation(onOpenTrips)
                        }
                        className="manage-buses-nav-item"
                    >
                        <span>🚍</span>
                        Trips
                    </button>

                </nav>

                <div className="manage-buses-sidebar-footer">

                    <div className="manage-buses-secure">
                        <span>🔒</span>
                        <div>
                            <strong>Secure Portal</strong>
                            <small>Admin access only</small>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="manage-buses-sidebar-logout"
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>

            {/* MAIN AREA */}

            <div className="manage-buses-main">

                {/* TOP HEADER */}

                <header className="manage-buses-topbar">

                    <button
                        className="manage-buses-menu-btn"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open navigation"
                    >
                        ☰
                    </button>

                    <div className="manage-buses-mobile-brand">
                        <span>🚌</span>
                        <strong>SRIIT SmartBus</strong>
                    </div>

                    <div className="manage-buses-topbar-right">

                        <div className="manage-buses-admin-profile">

                            <div className="manage-buses-avatar">
                                {adminInitial}
                            </div>

                            <div className="manage-buses-admin-text">
                                <strong>
                                    {admin?.name || "Admin"}
                                </strong>
                                <span>
                                    Administrator
                                </span>
                            </div>

                        </div>

                        <button
                            onClick={onLogout}
                            className="manage-buses-top-logout"
                        >
                            Logout
                        </button>

                    </div>

                </header>

                {/* CONTENT */}

                <main className="manage-buses-content">

                    <div className="manage-buses-page-heading">

                        <div>

                            <div className="manage-buses-breadcrumb">
                                Administration
                                <span>/</span>
                                Buses
                            </div>

                            <h1>
                                Manage Buses
                            </h1>

                            <p>
                                Add, monitor and manage your
                                organization's bus fleet.
                            </p>

                        </div>

                        <button
                            className="manage-buses-back-btn"
                            onClick={onBack}
                        >
                            ← Back to Dashboard
                        </button>

                    </div>

                    {/* ALERTS */}

                    {busError && (
                        <div className="manage-buses-alert manage-buses-alert-error">
                            <span>⚠️</span>
                            <div>
                                <strong>Action failed</strong>
                                <p>{busError}</p>
                            </div>
                        </div>
                    )}

                    {busMessage && (
                        <div className="manage-buses-alert manage-buses-alert-success">
                            <span>✓</span>
                            <div>
                                <strong>Success</strong>
                                <p>{busMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* STAT CARDS */}

                    <section className="manage-buses-stats">

                        <div className="manage-buses-stat-card">

                            <div className="manage-buses-stat-icon">
                                🚌
                            </div>

                            <div>
                                <span>Total Fleet</span>
                                <strong>{buses.length}</strong>
                            </div>

                        </div>

                        <div className="manage-buses-stat-card">

                            <div className="manage-buses-stat-icon active">
                                ✓
                            </div>

                            <div>
                                <span>Active Buses</span>
                                <strong>{activeBuses.length}</strong>
                            </div>

                        </div>

                        <div className="manage-buses-stat-card">

                            <div className="manage-buses-stat-icon inactive">
                                ◷
                            </div>

                            <div>
                                <span>Inactive Buses</span>
                                <strong>{inactiveBuses.length}</strong>
                            </div>

                        </div>

                    </section>

                    {/* ADD BUS */}

                    <section className="manage-buses-form-card">

                        <div className="manage-buses-section-heading">

                            <div className="manage-buses-section-icon">
                                +
                            </div>

                            <div>
                                <h2>Add New Bus</h2>
                                <p>
                                    Register a new bus in your
                                    SmartBus fleet.
                                </p>
                            </div>

                        </div>

                        <form
                            onSubmit={handleAddBus}
                            className="manage-buses-form"
                        >

                            <div className="manage-buses-input-group">

                                <label htmlFor="bus-number">
                                    Bus Number
                                </label>

                                <input
                                    id="bus-number"
                                    type="text"
                                    placeholder="e.g. BUS-001"
                                    value={busNumber}
                                    onChange={(e) =>
                                        setBusNumber(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                disabled={busSaving}
                                className="manage-buses-add-btn"
                            >
                                {busSaving ? (
                                    <>
                                        <span className="manage-buses-spinner" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <span>+</span>
                                        Add Bus
                                    </>
                                )}
                            </button>

                        </form>

                    </section>

                    {/* BUS LIST */}

                    <section className="manage-buses-list-card">

                        <div className="manage-buses-list-header">

                            <div>
                                <h2>All Buses</h2>
                                <p>
                                    View and manage all registered
                                    buses.
                                </p>
                            </div>

                            <button
                                onClick={fetchBuses}
                                disabled={busLoading}
                                className="manage-buses-refresh-btn"
                            >
                                {busLoading ? (
                                    <>
                                        <span className="manage-buses-spinner dark" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        ↻ Refresh
                                    </>
                                )}
                            </button>

                        </div>

                        {busLoading ? (

                            <div className="manage-buses-state">
                                <div className="manage-buses-loading-icon">
                                    🚌
                                </div>
                                <strong>
                                    Loading buses...
                                </strong>
                                <p>
                                    Please wait while we fetch
                                    the latest fleet data.
                                </p>
                            </div>

                        ) : buses.length === 0 ? (

                            <div className="manage-buses-state">
                                <div className="manage-buses-empty-icon">
                                    🚌
                                </div>
                                <strong>
                                    No buses found
                                </strong>
                                <p>
                                    Add your first bus using
                                    the form above.
                                </p>
                            </div>

                        ) : (

                            <div className="manage-buses-table-wrapper">

                                <table className="manage-buses-table">

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Bus</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {buses.map((bus) => {

                                            const status =
                                                bus.status ||
                                                "inactive";

                                            const isDeleting =
                                                deletingBusId ===
                                                bus.id;

                                            return (
                                                <tr
                                                    key={bus.id}
                                                >

                                                    <td>
                                                        <span className="manage-buses-id">
                                                            #{bus.id}
                                                        </span>
                                                    </td>

                                                    <td>

                                                        <div className="manage-buses-number">

                                                            <div className="manage-buses-row-icon">
                                                                🚌
                                                            </div>

                                                            <div>
                                                                <strong>
                                                                    {
                                                                        bus.bus_number
                                                                    }
                                                                </strong>
                                                                <span>
                                                                    SmartBus
                                                                </span>
                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                status ===
                                                                "active"
                                                                    ? "manage-buses-status-active"
                                                                    : "manage-buses-status-inactive"
                                                            }
                                                        >
                                                            <span className="manage-buses-status-dot" />
                                                            {status ===
                                                            "active"
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="manage-buses-actions">

                                                            <button
                                                                className="manage-buses-status-btn"
                                                                onClick={() =>
                                                                    handleBusStatus(
                                                                        bus.id,
                                                                        status
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDeleting
                                                                }
                                                            >
                                                                {status ===
                                                                "active"
                                                                    ? "Set Inactive"
                                                                    : "Set Active"}
                                                            </button>

                                                            <button
                                                                className="manage-buses-delete-btn"
                                                                onClick={() =>
                                                                    handleDeleteBus(
                                                                        bus
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDeleting
                                                                }
                                                            >
                                                                {isDeleting
                                                                    ? "Deleting..."
                                                                    : "Delete"}
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                    {/* INFORMATION */}

                    <div className="manage-buses-info-box">

                        <div className="manage-buses-info-icon">
                            ℹ️
                        </div>

                        <div>
                            <strong>
                                Bus management policy
                            </strong>

                            <p>
                                Use <b>Inactive</b> status for
                                buses that are temporarily not
                                in service or under maintenance.
                                Permanently delete a bus only
                                when it has been permanently
                                removed from the organization.
                            </p>
                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default ManageBuses;