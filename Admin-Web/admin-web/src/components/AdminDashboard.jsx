import { useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({
    admin,
    onLogout,
    onOpenBuses,
    onOpenDrivers,
    onOpenPassengers,
    onOpenRoutes,
    onOpenStops,
    onOpenRouteStops,
    onOpenTrips,
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleNavigation = (callback) => {
        closeMenu();
        callback();
    };

    return (
        <div className="admin-dashboard">

            {/* =================================
                MOBILE OVERLAY
            ================================= */}

            {menuOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={closeMenu}
                />
            )}


            {/* =================================
                SIDEBAR
            ================================= */}

            <aside
                className={`admin-sidebar ${
                    menuOpen ? "admin-sidebar-open" : ""
                }`}
            >

                <div className="admin-sidebar-brand">

                    <div className="admin-sidebar-logo">
                        🚌
                    </div>

                    <div>
                        <h1>
                            SRIIT SmartBus
                        </h1>

                        <p>
                            Admin Portal
                        </p>
                    </div>

                </div>


                <nav className="admin-sidebar-nav">

                    <p className="admin-nav-label">
                        MANAGEMENT
                    </p>


                    <button
                        className="admin-nav-item admin-nav-active"
                        onClick={closeMenu}
                    >
                        <span className="admin-nav-icon">
                            🏠
                        </span>

                        <span>
                            Dashboard
                        </span>
                    </button>


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenBuses)
                        }
                    >
                        <span className="admin-nav-icon">
                            🚌
                        </span>

                        <span>
                            Buses
                        </span>
                    </button>


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenDrivers)
                        }
                    >
                        <span className="admin-nav-icon">
                            👨‍✈️
                        </span>

                        <span>
                            Drivers
                        </span>
                    </button>


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenPassengers)
                        }
                    >
                        <span className="admin-nav-icon">
                            🎓
                        </span>

                        <span>
                            Passengers
                        </span>
                    </button>


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenRoutes)
                        }
                    >
                        <span className="admin-nav-icon">
                            🛣️
                        </span>

                        <span>
                            Routes
                        </span>
                    </button>


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenStops)
                        }
                    >
                        <span className="admin-nav-icon">
                            📍
                        </span>

                        <span>
                            Stops
                        </span>
                    </button>


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenRouteStops)
                        }
                    >
                        <span className="admin-nav-icon">
                            🔗
                        </span>

                        <span>
                            Route Stops
                        </span>
                    </button>


                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            handleNavigation(onOpenTrips)
                        }
                    >
                        <span className="admin-nav-icon">
                            🚍
                        </span>

                        <span>
                            Trips
                        </span>
                    </button>

                </nav>


                {/* =================================
                    SIDEBAR FOOTER
                ================================= */}

                <div className="admin-sidebar-footer">

                    <div className="admin-sidebar-secure">
                        <span>🔒</span>

                        <div>
                            <strong>
                                Secure Portal
                            </strong>

                            <small>
                                Authorized access only
                            </small>
                        </div>
                    </div>


                    <button
                        className="admin-sidebar-logout"
                        onClick={onLogout}
                    >
                        <span>
                            ↪
                        </span>

                        Logout
                    </button>

                </div>

            </aside>


            {/* =================================
                MAIN AREA
            ================================= */}

            <div className="admin-main-area">

                {/* =================================
                    TOP HEADER
                ================================= */}

                <header className="admin-top-header">

                    <div className="admin-header-left">

                        <button
                            className="admin-menu-button"
                            onClick={() =>
                                setMenuOpen(!menuOpen)
                            }
                            aria-label="Open navigation menu"
                        >
                            ☰
                        </button>


                        <div className="admin-mobile-header-brand">

                            <span>
                                🚌
                            </span>

                            <strong>
                                SRIIT SmartBus
                            </strong>

                        </div>

                    </div>


                    <div className="admin-header-right">

                        <div className="admin-header-user">

                            <div className="admin-user-avatar">
                                {(admin?.name ||
                                    admin?.email ||
                                    "A")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="admin-user-details">

                                <strong>
                                    {admin?.name ||
                                        "Administrator"}
                                </strong>

                                <span>
                                    Administrator
                                </span>

                            </div>

                        </div>


                        <button
                            className="admin-header-logout"
                            onClick={onLogout}
                        >
                            Logout
                        </button>

                    </div>

                </header>


                {/* =================================
                    DASHBOARD CONTENT
                ================================= */}

                <main className="admin-dashboard-content">

                    <section className="admin-welcome-section">

                        <div>

                            <span className="admin-page-eyebrow">
                                ADMINISTRATION
                            </span>

                            <h2>
                                Welcome back,{" "}
                                {admin?.name ||
                                    "Admin"}! 👋
                            </h2>

                            <p>
                                Manage your SmartBus system
                                from one convenient place.
                            </p>

                        </div>


                        <div className="admin-welcome-badge">
                            <span className="admin-live-dot" />

                            System Ready
                        </div>

                    </section>


                    {/* =================================
                        QUICK STATS
                    ================================= */}

                    <section className="admin-stat-grid">

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon buses">
                                🚌
                            </div>

                            <div>
                                <span>
                                    Fleet
                                </span>

                                <strong>
                                    Buses
                                </strong>

                                <small>
                                    Manage your buses
                                </small>
                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon drivers">
                                👨‍✈️
                            </div>

                            <div>
                                <span>
                                    Team
                                </span>

                                <strong>
                                    Drivers
                                </strong>

                                <small>
                                    Manage drivers
                                </small>
                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon passengers">
                                🎓
                            </div>

                            <div>
                                <span>
                                    Users
                                </span>

                                <strong>
                                    Passengers
                                </strong>

                                <small>
                                    Manage accounts
                                </small>
                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon trips">
                                🚍
                            </div>

                            <div>
                                <span>
                                    Operations
                                </span>

                                <strong>
                                    Trips
                                </strong>

                                <small>
                                    Manage trips
                                </small>
                            </div>

                        </div>

                    </section>


                    {/* =================================
                        MANAGEMENT
                    ================================= */}

                    <section className="admin-management-section">

                        <div className="admin-section-heading">

                            <div>
                                <span>
                                    CONTROL CENTER
                                </span>

                                <h3>
                                    Manage SmartBus
                                </h3>
                            </div>

                            <p>
                                Select a module to continue
                            </p>

                        </div>


                        <div className="admin-management-grid">

                            {/* BUSES */}

                            <button
                                className="admin-management-card"
                                onClick={onOpenBuses}
                            >

                                <div className="admin-management-icon">
                                    🚌
                                </div>

                                <div className="admin-management-content">

                                    <h4>
                                        Manage Buses
                                    </h4>

                                    <p>
                                        Add, update and manage
                                        your bus fleet.
                                    </p>

                                </div>

                                <span className="admin-card-arrow">
                                    →
                                </span>

                            </button>


                            {/* DRIVERS */}

                            <button
                                className="admin-management-card"
                                onClick={onOpenDrivers}
                            >

                                <div className="admin-management-icon">
                                    👨‍✈️
                                </div>

                                <div className="admin-management-content">

                                    <h4>
                                        Manage Drivers
                                    </h4>

                                    <p>
                                        Create and manage
                                        authorized drivers.
                                    </p>

                                </div>

                                <span className="admin-card-arrow">
                                    →
                                </span>

                            </button>


                            {/* PASSENGERS */}

                            <button
                                className="admin-management-card"
                                onClick={onOpenPassengers}
                            >

                                <div className="admin-management-icon">
                                    🎓
                                </div>

                                <div className="admin-management-content">

                                    <h4>
                                        Manage Passengers
                                    </h4>

                                    <p>
                                        Create and manage
                                        passenger accounts.
                                    </p>

                                </div>

                                <span className="admin-card-arrow">
                                    →
                                </span>

                            </button>


                            {/* ROUTES */}

                            <button
                                className="admin-management-card"
                                onClick={onOpenRoutes}
                            >

                                <div className="admin-management-icon">
                                    🛣️
                                </div>

                                <div className="admin-management-content">

                                    <h4>
                                        Manage Routes
                                    </h4>

                                    <p>
                                        Create and manage
                                        bus routes.
                                    </p>

                                </div>

                                <span className="admin-card-arrow">
                                    →
                                </span>

                            </button>


                            {/* STOPS */}

                            <button
                                className="admin-management-card"
                                onClick={onOpenStops}
                            >

                                <div className="admin-management-icon">
                                    📍
                                </div>

                                <div className="admin-management-content">

                                    <h4>
                                        Manage Stops
                                    </h4>

                                    <p>
                                        Create and manage
                                        bus stops.
                                    </p>

                                </div>

                                <span className="admin-card-arrow">
                                    →
                                </span>

                            </button>


                            {/* ROUTE STOPS */}

                            <button
                                className="admin-management-card"
                                onClick={onOpenRouteStops}
                            >

                                <div className="admin-management-icon">
                                    🔗
                                </div>

                                <div className="admin-management-content">

                                    <h4>
                                        Route Stops
                                    </h4>

                                    <p>
                                        Assign stops to
                                        specific routes.
                                    </p>

                                </div>

                                <span className="admin-card-arrow">
                                    →
                                </span>

                            </button>


                            {/* TRIPS */}

                            <button
                                className="admin-management-card admin-management-card-highlight"
                                onClick={onOpenTrips}
                            >

                                <div className="admin-management-icon">
                                    🚍
                                </div>

                                <div className="admin-management-content">

                                    <div className="admin-card-title-row">

                                        <h4>
                                            Manage Trips
                                        </h4>

                                        <span className="admin-card-badge">
                                            LIVE
                                        </span>

                                    </div>

                                    <p>
                                        Start, monitor and
                                        manage bus trips.
                                    </p>

                                </div>

                                <span className="admin-card-arrow">
                                    →
                                </span>

                            </button>

                        </div>

                    </section>


                    {/* =================================
                        BOTTOM INFORMATION
                    ================================= */}

                    <section className="admin-dashboard-info">

                        <div className="admin-info-icon">
                            💡
                        </div>

                        <div>

                            <strong>
                                SmartBus Administration
                            </strong>

                            <p>
                                Use the management modules above
                                to configure your fleet, routes,
                                passengers and daily trips.
                            </p>

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default AdminDashboard;