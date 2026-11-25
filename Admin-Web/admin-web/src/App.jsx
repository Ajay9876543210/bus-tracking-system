import { useState } from "react";

import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

import ManageBuses from "./components/ManageBuses";
import ManageDrivers from "./components/ManageDrivers";
import ManagePassengers from "./components/ManagePassengers";
import ManageRoutes from "./components/ManageRoutes";
import ManageStops from "./components/ManageStops";
import RouteStops from "./components/RouteStops";
import ManageTrips from "./components/ManageTrips";

import "./App.css";

function App() {
    // =========================
    // LOGIN STATE
    // =========================

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("adminToken")
    );

    const [admin, setAdmin] = useState(() => {
        const savedAdmin = localStorage.getItem("admin");

        try {
            return savedAdmin
                ? JSON.parse(savedAdmin)
                : null;
        } catch {
            return null;
        }
    });

    // =========================
    // PAGE STATE
    // =========================

    const [page, setPage] = useState("dashboard");

    // =========================
    // LOGIN SUCCESS
    // =========================

    const handleLoginSuccess = (loggedInAdmin) => {
        setAdmin(loggedInAdmin);
        setIsLoggedIn(true);
        setPage("dashboard");
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        setAdmin(null);
        setIsLoggedIn(false);
        setPage("dashboard");
    };

    // =========================
    // NAVIGATION
    // =========================

    const goToDashboard = () => {
        setPage("dashboard");
    };

    const goToBuses = () => {
        setPage("buses");
    };

    const goToDrivers = () => {
        setPage("drivers");
    };

    const goToPassengers = () => {
        setPage("passengers");
    };

    const goToRoutes = () => {
        setPage("routes");
    };

    const goToStops = () => {
        setPage("stops");
    };

    const goToRouteStops = () => {
        setPage("route-stops");
    };

    const goToTrips = () => {
        setPage("trips");
    };

    // =========================
    // LOGIN PAGE
    // =========================

    if (!isLoggedIn) {
        return (
            <AdminLogin
                onLoginSuccess={handleLoginSuccess}
            />
        );
    }

    // =========================
    // MANAGE BUSES
    // =========================

    if (page === "buses") {
        return (
            <ManageBuses
                admin={admin}
                onLogout={handleLogout}
                onBack={goToDashboard}

                onOpenBuses={goToBuses}
                onOpenDrivers={goToDrivers}
                onOpenPassengers={goToPassengers}
                onOpenRoutes={goToRoutes}
                onOpenStops={goToStops}
                onOpenRouteStops={goToRouteStops}
                onOpenTrips={goToTrips}
            />
        );
    }

    // =========================
    // MANAGE DRIVERS
    // =========================

    if (page === "drivers") {
        return (
            <ManageDrivers
                admin={admin}
                onLogout={handleLogout}
                onBack={goToDashboard}

                onOpenBuses={goToBuses}
                onOpenDrivers={goToDrivers}
                onOpenPassengers={goToPassengers}
                onOpenRoutes={goToRoutes}
                onOpenStops={goToStops}
                onOpenRouteStops={goToRouteStops}
                onOpenTrips={goToTrips}
            />
        );
    }

    // =========================
    // MANAGE PASSENGERS
    // =========================

    if (page === "passengers") {
        return (
            <ManagePassengers
                admin={admin}
                onLogout={handleLogout}
                onBack={goToDashboard}

                onOpenBuses={goToBuses}
                onOpenDrivers={goToDrivers}
                onOpenPassengers={goToPassengers}
                onOpenRoutes={goToRoutes}
                onOpenStops={goToStops}
                onOpenRouteStops={goToRouteStops}
                onOpenTrips={goToTrips}
            />
        );
    }

    // =========================
    // MANAGE ROUTES
    // =========================

    if (page === "routes") {
        return (
            <ManageRoutes
                admin={admin}
                onLogout={handleLogout}
                onBack={goToDashboard}

                onOpenBuses={goToBuses}
                onOpenDrivers={goToDrivers}
                onOpenPassengers={goToPassengers}
                onOpenRoutes={goToRoutes}
                onOpenStops={goToStops}
                onOpenRouteStops={goToRouteStops}
                onOpenTrips={goToTrips}
            />
        );
    }

    // =========================
    // MANAGE STOPS
    // =========================

    if (page === "stops") {
        return (
            <ManageStops
                admin={admin}
                onLogout={handleLogout}
                onBack={goToDashboard}

                onOpenBuses={goToBuses}
                onOpenDrivers={goToDrivers}
                onOpenPassengers={goToPassengers}
                onOpenRoutes={goToRoutes}
                onOpenStops={goToStops}
                onOpenRouteStops={goToRouteStops}
                onOpenTrips={goToTrips}
            />
        );
    }

    // =========================
    // ROUTE STOPS
    // =========================

    if (page === "route-stops") {
        return (
            <RouteStops
                admin={admin}
                onLogout={handleLogout}
                onBack={goToDashboard}

                onOpenBuses={goToBuses}
                onOpenDrivers={goToDrivers}
                onOpenPassengers={goToPassengers}
                onOpenRoutes={goToRoutes}
                onOpenStops={goToStops}
                onOpenRouteStops={goToRouteStops}
                onOpenTrips={goToTrips}
            />
        );
    }

    // =========================
    // MANAGE TRIPS
    // =========================

    if (page === "trips") {
        return (
            <ManageTrips
                admin={admin}
                onLogout={handleLogout}
                onBack={goToDashboard}

                onOpenBuses={goToBuses}
                onOpenDrivers={goToDrivers}
                onOpenPassengers={goToPassengers}
                onOpenRoutes={goToRoutes}
                onOpenStops={goToStops}
                onOpenRouteStops={goToRouteStops}
                onOpenTrips={goToTrips}
            />
        );
    }

    // =========================
    // ADMIN DASHBOARD
    // =========================

    return (
        <AdminDashboard
            admin={admin}
            onLogout={handleLogout}

            onOpenBuses={goToBuses}
            onOpenDrivers={goToDrivers}
            onOpenPassengers={goToPassengers}
            onOpenRoutes={goToRoutes}
            onOpenStops={goToStops}
            onOpenRouteStops={goToRouteStops}
            onOpenTrips={goToTrips}
        />
    );
}

export default App;