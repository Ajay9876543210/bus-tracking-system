import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageRoutes.css";

const API_URL = "https://bus-tracking-backend-n00g.onrender.com";

function ManageRoutes({
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
    const [routes, setRoutes] = useState([]);

    const [routeName, setRouteName] = useState("");
    const [description, setDescription] = useState("");

    const [routeLoading, setRouteLoading] = useState(false);
    const [routeSaving, setRouteSaving] = useState(false);
    const [routeDeleting, setRouteDeleting] = useState(false);

    const [routeError, setRouteError] = useState("");
    const [routeMessage, setRouteMessage] = useState("");

    const getAuthConfig = () => {
        const token = localStorage.getItem("adminToken");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const handleNavigation = (callback) => {
        if (typeof callback === "function") {
            callback();
        }
    };

    const fetchRoutes = async () => {
        try {
            setRouteLoading(true);
            setRouteError("");

            const response = await axios.get(
                `${API_URL}/api/routes`,
                getAuthConfig()
            );

            const routeData = response.data.data || [];

            setRoutes(
                Array.isArray(routeData)
                    ? routeData
                    : []
            );
        } catch (err) {
            console.error(
                "Fetch routes error:",
                err
            );

            setRouteError(
                err.response?.data?.message ||
                "Failed to load routes"
            );
        } finally {
            setRouteLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const handleAddRoute = async (e) => {
        e.preventDefault();

        if (!routeName.trim()) {
            setRouteError(
                "Route name is required"
            );
            setRouteMessage("");
            return;
        }

        try {
            setRouteSaving(true);
            setRouteError("");
            setRouteMessage("");

            await axios.post(
                `${API_URL}/api/routes`,
                {
                    name: routeName.trim(),
                    description:
                        description.trim(),
                },
                getAuthConfig()
            );

            setRouteMessage(
                "Route created successfully!"
            );

            setRouteName("");
            setDescription("");

            await fetchRoutes();
        } catch (err) {
            console.error(
                "Add route error:",
                err
            );

            setRouteError(
                err.response?.data?.message ||
                "Failed to create route"
            );
        } finally {
            setRouteSaving(false);
        }
    };

    // =====================================
    // DELETE ROUTE
    // =====================================

    const handleDeleteRoute = async (route) => {
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete route "${route.name}"?\n\n` +
            `Route history must be cleared automatically after the retention period before this route can be deleted.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setRouteDeleting(true);
            setRouteError("");
            setRouteMessage("");

            const response = await axios.delete(
                `${API_URL}/api/routes/${route.id}`,
                getAuthConfig()
            );

            setRouteMessage(
                response.data.message ||
                "Route deleted successfully!"
            );

            await fetchRoutes();
        } catch (err) {
            console.error(
                "Delete route error:",
                err
            );

            const message =
                err.response?.data?.message ||
                "Failed to delete route";

            const tripCount =
                err.response?.data?.data?.trip_count;

            if (tripCount) {
                setRouteError(
                    `${message} Trip history: ${tripCount}`
                );
            } else {
                setRouteError(message);
            }
        } finally {
            setRouteDeleting(false);
        }
    };

    return (
        <div className="manage-routes-page">

            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="manage-routes-sidebar">

                <div className="manage-routes-sidebar-brand">

                    <div className="manage-routes-brand-icon">
                        🚌
                    </div>

                    <div>
                        <h1>SRIIT SmartBus</h1>
                        <p>Admin Portal</p>
                    </div>

                </div>

                <nav className="manage-routes-sidebar-nav">

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onBack)
                        }
                        className="manage-routes-nav-item"
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenBuses)
                        }
                        className="manage-routes-nav-item"
                    >
                        <span>🚌</span>
                        Buses
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenDrivers)
                        }
                        className="manage-routes-nav-item"
                    >
                        <span>👨‍✈️</span>
                        Drivers
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(
                                onOpenPassengers
                            )
                        }
                        className="manage-routes-nav-item"
                    >
                        <span>👥</span>
                        Passengers
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenRoutes)
                        }
                        className="manage-routes-nav-item active"
                    >
                        <span>🛣️</span>
                        Routes
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenStops)
                        }
                        className="manage-routes-nav-item"
                    >
                        <span>📍</span>
                        Stops
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(
                                onOpenRouteStops
                            )
                        }
                        className="manage-routes-nav-item"
                    >
                        <span>🔗</span>
                        Route Stops
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenTrips)
                        }
                        className="manage-routes-nav-item"
                    >
                        <span>🚍</span>
                        Trips
                    </button>

                </nav>

                <div className="manage-routes-sidebar-footer">

                    <div className="manage-routes-secure-badge">
                        <span>🔒</span>

                        <div>
                            <strong>Secure Portal</strong>
                            <small>Admin access only</small>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="manage-routes-sidebar-logout"
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>

            {/* =================================
                MAIN
            ================================= */}

            <div className="manage-routes-main">

                <header className="manage-routes-topbar">

                    <div className="manage-routes-topbar-left">

                        <button
                            type="button"
                            className="manage-routes-back-top-btn"
                            onClick={onBack}
                        >
                            ← Dashboard
                        </button>

                        <div>
                            <p>Route Management</p>
                            <h2>Manage Routes</h2>
                        </div>

                    </div>

                    <div className="manage-routes-admin-profile">

                        <div className="manage-routes-admin-avatar">
                            {(admin?.name || "A")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {admin?.name || "Admin"}
                            </strong>
                            <span>Administrator</span>
                        </div>

                    </div>

                </header>

                <main className="manage-routes-content">

                    {/* =================================
                        INTRO
                    ================================= */}

                    <section className="manage-routes-page-intro">

                        <div>
                            <span className="manage-routes-eyebrow">
                                ROUTE MANAGEMENT
                            </span>

                            <h1>
                                Bus Routes
                            </h1>

                            <p>
                                Create and manage routes used
                                by the SRIIT SmartBus system.
                            </p>
                        </div>

                        <div className="manage-routes-live-status">
                            <span></span>
                            Admin Control Active
                        </div>

                    </section>

                    {/* =================================
                        ALERTS
                    ================================= */}

                    {routeError && (
                        <div className="manage-routes-alert error">
                            <span>⚠️</span>

                            <div>
                                <strong>
                                    Action failed
                                </strong>

                                <p>
                                    {routeError}
                                </p>
                            </div>
                        </div>
                    )}

                    {routeMessage && (
                        <div className="manage-routes-alert success">
                            <span>✓</span>

                            <div>
                                <strong>
                                    Success
                                </strong>

                                <p>
                                    {routeMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* =================================
                        STATS
                    ================================= */}

                    <section className="manage-routes-stats">

                        <div className="manage-routes-stat-card">

                            <div className="manage-routes-stat-icon">
                                🛣️
                            </div>

                            <div>
                                <span>Total Routes</span>
                                <strong>
                                    {routes.length}
                                </strong>
                            </div>

                        </div>

                        <div className="manage-routes-stat-card">

                            <div className="manage-routes-stat-icon">
                                📍
                            </div>

                            <div>
                                <span>Route Network</span>
                                <strong>
                                    {routes.length > 0
                                        ? "Ready"
                                        : "Empty"}
                                </strong>
                            </div>

                        </div>

                        <div className="manage-routes-stat-card">

                            <div className="manage-routes-stat-icon">
                                ➕
                            </div>

                            <div>
                                <span>Creation</span>
                                <strong>
                                    Admin
                                </strong>
                            </div>

                        </div>

                        <div className="manage-routes-stat-card">

                            <div className="manage-routes-stat-icon">
                                🔐
                            </div>

                            <div>
                                <span>Access Control</span>
                                <strong>
                                    Protected
                                </strong>
                            </div>

                        </div>

                    </section>

                    {/* =================================
                        CREATE ROUTE
                    ================================= */}

                    <section className="manage-routes-card">

                        <div className="manage-routes-card-header">

                            <div>
                                <span className="manage-routes-card-kicker">
                                    NEW ROUTE
                                </span>

                                <h3>
                                    Create Route
                                </h3>

                                <p>
                                    Add a new route to the
                                    transportation network.
                                </p>
                            </div>

                            <div className="manage-routes-card-icon">
                                🛣️
                            </div>

                        </div>

                        <form
                            onSubmit={handleAddRoute}
                            className="manage-routes-form"
                        >

                            <div className="manage-routes-field route-name-field">

                                <label htmlFor="route-name">
                                    Route Name
                                </label>

                                <input
                                    id="route-name"
                                    type="text"
                                    placeholder="Example: Route 1"
                                    value={routeName}
                                    onChange={(e) =>
                                        setRouteName(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="manage-routes-field description-field">

                                <label htmlFor="route-description">
                                    Description
                                </label>

                                <textarea
                                    id="route-description"
                                    placeholder="Enter route description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    rows="3"
                                />

                            </div>

                            <div className="manage-routes-form-action">

                                <button
                                    type="submit"
                                    className="manage-routes-primary-btn"
                                    disabled={routeSaving}
                                >
                                    {routeSaving ? (
                                        <>
                                            <span className="manage-routes-spinner"></span>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <span>+</span>
                                            Create Route
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </section>

                    {/* =================================
                        ROUTE LIST
                    ================================= */}

                    <section className="manage-routes-card">

                        <div className="manage-routes-list-header">

                            <div>
                                <span className="manage-routes-card-kicker">
                                    ROUTE DIRECTORY
                                </span>

                                <h3>
                                    All Routes
                                </h3>

                                <p>
                                    Manage routes currently
                                    configured in the system.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fetchRoutes}
                                disabled={routeLoading}
                                className="manage-routes-refresh-btn"
                            >
                                ↻{" "}
                                {routeLoading
                                    ? "Loading..."
                                    : "Refresh"}
                            </button>

                        </div>

                        {routeLoading ? (
                            <div className="manage-routes-loading">
                                <span className="manage-routes-spinner"></span>
                                Loading routes...
                            </div>
                        ) : routes.length === 0 ? (
                            <div className="manage-routes-empty">

                                <div>🛣️</div>

                                <h4>
                                    No routes found
                                </h4>

                                <p>
                                    Create your first bus
                                    route above.
                                </p>

                            </div>
                        ) : (
                            <div className="manage-routes-table-wrapper">

                                <table className="manage-routes-table">

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Route</th>
                                            <th>Description</th>
                                            <th>Created At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {routes.map(
                                            (route) => (
                                                <tr
                                                    key={
                                                        route.id
                                                    }
                                                >

                                                    <td>
                                                        <span className="manage-routes-id">
                                                            {
                                                                route.id
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="manage-routes-name-cell">

                                                            <div className="manage-routes-mini-icon">
                                                                🛣️
                                                            </div>

                                                            <strong>
                                                                {
                                                                    route.name
                                                                }
                                                            </strong>

                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span className="manage-routes-description">
                                                            {
                                                                route.description ||
                                                                "-"
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {route.created_at
                                                            ? new Date(
                                                                  route.created_at
                                                              ).toLocaleString()
                                                            : "-"}
                                                    </td>

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="manage-routes-delete-btn"
                                                            onClick={() =>
                                                                handleDeleteRoute(
                                                                    route
                                                                )
                                                            }
                                                            disabled={
                                                                routeDeleting
                                                            }
                                                        >
                                                            {routeDeleting
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </section>

                    {/* =================================
                        POLICY
                    ================================= */}

                    <section className="manage-routes-policy">

                        <div className="manage-routes-policy-icon">
                            🔐
                        </div>

                        <div>

                            <h3>
                                Route Management Policy
                            </h3>

                            <p>
                                Routes are controlled by
                                administrators. Before permanently
                                deleting a route, ensure that its
                                associated trip history and route
                                dependencies satisfy the backend
                                deletion rules.
                            </p>

                            <div className="manage-routes-policy-tags">
                                <span>Admin Only</span>
                                <span>Trip History Protected</span>
                                <span>Controlled Deletion</span>
                            </div>

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default ManageRoutes;