import { useEffect, useState } from "react";
import axios from "axios";
import "./ManagePassengers.css";

const API_URL = "https://bus-tracking-backend-n00g.onrender.com";

function ManagePassengers({
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
    const [passengers, setPassengers] = useState([]);

    // Single passenger form
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");

    // Password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Loading states
    const [passengerLoading, setPassengerLoading] = useState(false);
    const [passengerSaving, setPassengerSaving] = useState(false);
    const [bulkSaving, setBulkSaving] = useState(false);
    const [deletingPassengerId, setDeletingPassengerId] = useState(null);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Messages
    const [passengerError, setPassengerError] = useState("");
    const [passengerMessage, setPassengerMessage] = useState("");

    // Selection
    const [selectedPassengerIds, setSelectedPassengerIds] = useState([]);

    // CSV
    const [csvFile, setCsvFile] = useState(null);
    const [csvPassengers, setCsvPassengers] = useState([]);

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

    const fetchPassengers = async () => {
        try {
            setPassengerLoading(true);
            setPassengerError("");

            const response = await axios.get(
                `${API_URL}/api/admins/passengers`,
                getAuthConfig()
            );

            const passengerData = response.data.data || [];

            setPassengers(
                Array.isArray(passengerData)
                    ? passengerData
                    : []
            );

            setSelectedPassengerIds([]);
        } catch (err) {
            console.error("Fetch passengers error:", err);

            setPassengerError(
                err.response?.data?.message ||
                "Failed to load passengers"
            );
        } finally {
            setPassengerLoading(false);
        }
    };

    useEffect(() => {
        fetchPassengers();
    }, []);

    // ================================
    // SINGLE CREATE
    // ================================

    const handleAddPassenger = async (e) => {
        e.preventDefault();

        if (
            !userId.trim() ||
            !name.trim() ||
            !password ||
            !dateOfBirth
        ) {
            setPassengerError(
                "User ID, name, password and date of birth are required"
            );
            setPassengerMessage("");
            return;
        }

        if (password.length < 8) {
            setPassengerError(
                "Password must be at least 8 characters"
            );
            setPassengerMessage("");
            return;
        }

        try {
            setPassengerSaving(true);
            setPassengerError("");
            setPassengerMessage("");

            await axios.post(
                `${API_URL}/api/admins/passengers`,
                {
                    user_id: userId.trim(),
                    name: name.trim(),
                    password,
                    date_of_birth: dateOfBirth,
                },
                getAuthConfig()
            );

            setPassengerMessage(
                "Passenger account created successfully!"
            );

            setUserId("");
            setName("");
            setPassword("");
            setDateOfBirth("");
            setShowPassword(false);

            await fetchPassengers();
        } catch (err) {
            console.error("Add passenger error:", err);

            setPassengerError(
                err.response?.data?.message ||
                "Failed to create passenger"
            );
        } finally {
            setPassengerSaving(false);
        }
    };

    // ================================
    // CSV PARSER
    // ================================

    const parseCSVLine = (line) => {
        const values = [];
        let current = "";
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (
                    insideQuotes &&
                    line[i + 1] === '"'
                ) {
                    current += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (
                char === "," &&
                !insideQuotes
            ) {
                values.push(current.trim());
                current = "";
            } else {
                current += char;
            }
        }

        values.push(current.trim());

        return values;
    };

    const handleCSVChange = (e) => {
        const file = e.target.files?.[0];

        setCsvFile(null);
        setCsvPassengers([]);
        setPassengerError("");
        setPassengerMessage("");

        if (!file) {
            return;
        }

        if (!file.name.toLowerCase().endsWith(".csv")) {
            setPassengerError("Please select a CSV file");
            return;
        }

        setCsvFile(file);

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const text = event.target.result;

                const lines = text
                    .split(/\r?\n/)
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0);

                if (lines.length < 2) {
                    setPassengerError(
                        "CSV file must contain a header and at least one passenger"
                    );
                    return;
                }

                const headers = parseCSVLine(lines[0]).map(
                    (header) =>
                        header.trim().toLowerCase()
                );

                const requiredHeaders = [
                    "user_id",
                    "name",
                    "date_of_birth",
                    "password",
                ];

                const missingHeaders =
                    requiredHeaders.filter(
                        (header) =>
                            !headers.includes(header)
                    );

                if (missingHeaders.length > 0) {
                    setPassengerError(
                        `Missing CSV columns: ${missingHeaders.join(
                            ", "
                        )}`
                    );
                    setCsvPassengers([]);
                    return;
                }

                const parsedPassengers = [];

                for (let i = 1; i < lines.length; i++) {
                    const values = parseCSVLine(lines[i]);
                    const row = {};

                    headers.forEach((header, index) => {
                        row[header] = values[index] || "";
                    });

                    const passenger = {
                        user_id:
                            row.user_id?.trim() || "",
                        name:
                            row.name?.trim() || "",
                        date_of_birth:
                            row.date_of_birth?.trim() || "",
                        password:
                            row.password || "",
                    };

                    if (
                        !passenger.user_id &&
                        !passenger.name &&
                        !passenger.date_of_birth &&
                        !passenger.password
                    ) {
                        continue;
                    }

                    parsedPassengers.push(passenger);
                }

                if (parsedPassengers.length === 0) {
                    setPassengerError(
                        "No passenger records found in CSV"
                    );
                    return;
                }

                if (parsedPassengers.length > 5000) {
                    setPassengerError(
                        "Maximum 5000 passengers can be imported at once"
                    );
                    setCsvPassengers([]);
                    return;
                }

                setCsvPassengers(parsedPassengers);

                setPassengerMessage(
                    `${parsedPassengers.length} passenger records loaded from CSV`
                );
            } catch (error) {
                console.error(
                    "CSV parse error:",
                    error
                );

                setPassengerError(
                    "Failed to read CSV file"
                );
            }
        };

        reader.readAsText(file);
    };

    // ================================
    // BULK CREATE
    // ================================

    const handleBulkCreate = async () => {
        if (csvPassengers.length === 0) {
            setPassengerError(
                "Please select a valid CSV file first"
            );
            return;
        }

        const invalidRows = csvPassengers.filter(
            (passenger) =>
                !passenger.user_id ||
                !passenger.name ||
                !passenger.date_of_birth ||
                !passenger.password ||
                passenger.password.length < 8
        );

        if (invalidRows.length > 0) {
            setPassengerError(
                "CSV contains invalid records. Check User ID, Name, DOB and password (minimum 8 characters)."
            );
            return;
        }

        const userIds = csvPassengers.map(
            (passenger) => passenger.user_id
        );

        const duplicateUserIds = userIds.filter(
            (id, index) =>
                userIds.indexOf(id) !== index
        );

        if (duplicateUserIds.length > 0) {
            setPassengerError(
                `Duplicate User ID in CSV: ${[
                    ...new Set(duplicateUserIds),
                ].join(", ")}`
            );
            return;
        }

        const confirmed = window.confirm(
            `Create ${csvPassengers.length} passenger accounts?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setBulkSaving(true);
            setPassengerError("");
            setPassengerMessage("");

            const response = await axios.post(
                `${API_URL}/api/admins/passengers/bulk`,
                {
                    passengers: csvPassengers,
                },
                getAuthConfig()
            );

            setPassengerMessage(
                response.data.message ||
                `${csvPassengers.length} passengers created successfully`
            );

            setCsvFile(null);
            setCsvPassengers([]);

            const fileInput = document.getElementById(
                "passenger-csv-input"
            );

            if (fileInput) {
                fileInput.value = "";
            }

            await fetchPassengers();
        } catch (err) {
            console.error(
                "Bulk passenger create error:",
                err
            );

            setPassengerError(
                err.response?.data?.message ||
                "Failed to create passengers"
            );
        } finally {
            setBulkSaving(false);
        }
    };

    // ================================
    // SELECTION
    // ================================

    const handleSelectPassenger = (id) => {
        setSelectedPassengerIds((previous) => {
            if (previous.includes(id)) {
                return previous.filter(
                    (passengerId) =>
                        passengerId !== id
                );
            }

            return [...previous, id];
        });
    };

    const handleSelectAll = () => {
        if (
            selectedPassengerIds.length ===
            passengers.length
        ) {
            setSelectedPassengerIds([]);
        } else {
            setSelectedPassengerIds(
                passengers.map(
                    (passenger) => passenger.id
                )
            );
        }
    };

    // ================================
    // SINGLE DELETE
    // ================================

    const handleDeletePassenger = async (passenger) => {
        const confirmed = window.confirm(
            `Delete passenger "${passenger.name}" (${passenger.user_id}) permanently?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingPassengerId(passenger.id);
            setPassengerError("");
            setPassengerMessage("");

            const response = await axios.delete(
                `${API_URL}/api/admins/passengers/${passenger.id}`,
                getAuthConfig()
            );

            setPassengerMessage(
                response.data.message ||
                "Passenger deleted successfully"
            );

            setSelectedPassengerIds((previous) =>
                previous.filter(
                    (id) => id !== passenger.id
                )
            );

            await fetchPassengers();
        } catch (err) {
            console.error(
                "Delete passenger error:",
                err
            );

            setPassengerError(
                err.response?.data?.message ||
                "Failed to delete passenger"
            );
        } finally {
            setDeletingPassengerId(null);
        }
    };

    // ================================
    // BULK DELETE
    // ================================

    const handleBulkDelete = async () => {
        if (selectedPassengerIds.length === 0) {
            setPassengerError(
                "Please select at least one passenger"
            );
            return;
        }

        const confirmed = window.confirm(
            `Delete ${selectedPassengerIds.length} selected passenger accounts permanently?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setBulkDeleting(true);
            setPassengerError("");
            setPassengerMessage("");

            const response = await axios.delete(
                `${API_URL}/api/admins/passengers/bulk`,
                {
                    ...getAuthConfig(),
                    data: {
                        passenger_ids:
                            selectedPassengerIds,
                    },
                }
            );

            setPassengerMessage(
                response.data.message ||
                "Passengers deleted successfully"
            );

            setSelectedPassengerIds([]);

            await fetchPassengers();
        } catch (err) {
            console.error(
                "Bulk delete passenger error:",
                err
            );

            setPassengerError(
                err.response?.data?.message ||
                "Failed to delete passengers"
            );
        } finally {
            setBulkDeleting(false);
        }
    };

    const allSelected =
        passengers.length > 0 &&
        selectedPassengerIds.length ===
            passengers.length;

    return (
        <div className="manage-passengers-page">

            {/* ================================
                SIDEBAR
            ================================= */}

            <aside className="manage-passengers-sidebar">

                <div className="manage-passengers-sidebar-brand">
                    <div className="manage-passengers-brand-icon">
                        🚌
                    </div>

                    <div>
                        <h1>SRIIT SmartBus</h1>
                        <p>Admin Portal</p>
                    </div>
                </div>

                <nav className="manage-passengers-sidebar-nav">

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onBack)
                        }
                        className="manage-passengers-nav-item"
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenBuses)
                        }
                        className="manage-passengers-nav-item"
                    >
                        <span>🚌</span>
                        Buses
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenDrivers)
                        }
                        className="manage-passengers-nav-item"
                    >
                        <span>👨‍✈️</span>
                        Drivers
                    </button>

                    <button
                        type="button"
                        className="manage-passengers-nav-item active"
                        onClick={() =>
                            handleNavigation(
                                onOpenPassengers
                            )
                        }
                    >
                        <span>👥</span>
                        Passengers
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenRoutes)
                        }
                        className="manage-passengers-nav-item"
                    >
                        <span>🛣️</span>
                        Routes
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenStops)
                        }
                        className="manage-passengers-nav-item"
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
                        className="manage-passengers-nav-item"
                    >
                        <span>🔗</span>
                        Route Stops
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(onOpenTrips)
                        }
                        className="manage-passengers-nav-item"
                    >
                        <span>🚍</span>
                        Trips
                    </button>

                </nav>

                <div className="manage-passengers-sidebar-footer">

                    <div className="manage-passengers-secure-badge">
                        <span>🔒</span>
                        <div>
                            <strong>Secure Portal</strong>
                            <small>Admin access only</small>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="manage-passengers-sidebar-logout"
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>

            {/* ================================
                MAIN AREA
            ================================= */}

            <div className="manage-passengers-main">

                <header className="manage-passengers-topbar">

                    <div className="manage-passengers-topbar-left">
                        <button
                            type="button"
                            className="manage-passengers-back-top-btn"
                            onClick={onBack}
                        >
                            ← Dashboard
                        </button>

                        <div>
                            <p>Passenger Management</p>
                            <h2>Manage Passengers</h2>
                        </div>
                    </div>

                    <div className="manage-passengers-admin-profile">
                        <div className="manage-passengers-admin-avatar">
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

                <main className="manage-passengers-content">

                    <section className="manage-passengers-page-intro">

                        <div>
                            <span className="manage-passengers-eyebrow">
                                ACCOUNT MANAGEMENT
                            </span>

                            <h1>
                                Passenger Accounts
                            </h1>

                            <p>
                                Create, import and manage
                                passenger accounts securely.
                            </p>
                        </div>

                        <div className="manage-passengers-live-status">
                            <span></span>
                            Admin Control Active
                        </div>

                    </section>

                    {/* ================================
                        ALERTS
                    ================================= */}

                    {passengerError && (
                        <div className="manage-passengers-alert error">
                            <span>⚠️</span>
                            <div>
                                <strong>Action failed</strong>
                                <p>{passengerError}</p>
                            </div>
                        </div>
                    )}

                    {passengerMessage && (
                        <div className="manage-passengers-alert success">
                            <span>✓</span>
                            <div>
                                <strong>Success</strong>
                                <p>{passengerMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* ================================
                        STATS
                    ================================= */}

                    <section className="manage-passengers-stats">

                        <div className="manage-passengers-stat-card">
                            <div className="manage-passengers-stat-icon">
                                👥
                            </div>
                            <div>
                                <span>Total Passengers</span>
                                <strong>
                                    {passengers.length}
                                </strong>
                            </div>
                        </div>

                        <div className="manage-passengers-stat-card">
                            <div className="manage-passengers-stat-icon">
                                🆔
                            </div>
                            <div>
                                <span>Passenger IDs</span>
                                <strong>
                                    {passengers.length}
                                </strong>
                            </div>
                        </div>

                        <div className="manage-passengers-stat-card">
                            <div className="manage-passengers-stat-icon">
                                📄
                            </div>
                            <div>
                                <span>CSV Ready</span>
                                <strong>
                                    {csvPassengers.length}
                                </strong>
                            </div>
                        </div>

                        <div className="manage-passengers-stat-card">
                            <div className="manage-passengers-stat-icon">
                                🔐
                            </div>
                            <div>
                                <span>Access Control</span>
                                <strong>Admin</strong>
                            </div>
                        </div>

                    </section>

                    {/* ================================
                        CREATE PASSENGER
                    ================================= */}

                    <section className="manage-passengers-card">

                        <div className="manage-passengers-card-header">
                            <div>
                                <span className="manage-passengers-card-kicker">
                                    NEW ACCOUNT
                                </span>

                                <h3>
                                    Create Passenger
                                </h3>

                                <p>
                                    Admin-created passenger
                                    account with User ID,
                                    name, DOB and password.
                                </p>
                            </div>

                            <div className="manage-passengers-card-icon">
                                👤+
                            </div>
                        </div>

                        <form
                            onSubmit={handleAddPassenger}
                            className="manage-passengers-form"
                        >

                            <div className="manage-passengers-field">
                                <label htmlFor="passenger-user-id">
                                    User ID
                                </label>

                                <input
                                    id="passenger-user-id"
                                    type="text"
                                    placeholder="Example: P1001"
                                    value={userId}
                                    onChange={(e) =>
                                        setUserId(
                                            e.target.value
                                        )
                                    }
                                    autoComplete="off"
                                />
                            </div>

                            <div className="manage-passengers-field">
                                <label htmlFor="passenger-name">
                                    Full Name
                                </label>

                                <input
                                    id="passenger-name"
                                    type="text"
                                    placeholder="Enter passenger name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="manage-passengers-field">
                                <label htmlFor="passenger-password">
                                    Password
                                </label>

                                <div className="manage-passengers-password-wrapper">

                                    <input
                                        id="passenger-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Minimum 8 characters"
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
                                        className="manage-passengers-password-toggle"
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

                            <div className="manage-passengers-field">
                                <label htmlFor="passenger-dob">
                                    Date of Birth
                                </label>

                                <input
                                    id="passenger-dob"
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) =>
                                        setDateOfBirth(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="manage-passengers-form-action">
                                <button
                                    type="submit"
                                    className="manage-passengers-primary-btn"
                                    disabled={
                                        passengerSaving
                                    }
                                >
                                    {passengerSaving ? (
                                        <>
                                            <span className="manage-passengers-spinner"></span>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <span>+</span>
                                            Create Passenger
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>

                    </section>

                    {/* ================================
                        BULK CREATE
                    ================================= */}

                    <section className="manage-passengers-card">

                        <div className="manage-passengers-card-header">
                            <div>
                                <span className="manage-passengers-card-kicker">
                                    BULK IMPORT
                                </span>

                                <h3>
                                    Import Passengers from CSV
                                </h3>

                                <p>
                                    Create multiple passenger
                                    accounts at once.
                                </p>
                            </div>

                            <div className="manage-passengers-card-icon">
                                📄
                            </div>
                        </div>

                        <div className="manage-passengers-csv-info">
                            <strong>Required CSV columns:</strong>
                            <code>
                                user_id, name,
                                date_of_birth, password
                            </code>
                        </div>

                        <div className="manage-passengers-csv-row">

                            <label
                                htmlFor="passenger-csv-input"
                                className="manage-passengers-file-label"
                            >
                                <span>📁</span>
                                <span>
                                    {csvFile
                                        ? csvFile.name
                                        : "Choose CSV file"}
                                </span>
                            </label>

                            <input
                                id="passenger-csv-input"
                                type="file"
                                accept=".csv"
                                onChange={
                                    handleCSVChange
                                }
                                className="manage-passengers-file-input"
                            />

                            <button
                                type="button"
                                className="manage-passengers-secondary-btn"
                                onClick={
                                    handleBulkCreate
                                }
                                disabled={
                                    bulkSaving ||
                                    csvPassengers.length ===
                                        0
                                }
                            >
                                {bulkSaving
                                    ? "Creating..."
                                    : `Create All ${
                                          csvPassengers.length
                                              ? `(${csvPassengers.length})`
                                              : ""
                                      }`}
                            </button>

                        </div>

                        {csvPassengers.length > 0 && (
                            <div className="manage-passengers-csv-preview">

                                <div className="manage-passengers-preview-header">
                                    <div>
                                        <h4>
                                            CSV Preview
                                        </h4>
                                        <span>
                                            {
                                                csvPassengers.length
                                            }{" "}
                                            records loaded
                                        </span>
                                    </div>

                                    <span className="manage-passengers-preview-badge">
                                        Ready
                                    </span>
                                </div>

                                <div className="manage-passengers-table-wrapper">

                                    <table className="manage-passengers-table">

                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>User ID</th>
                                                <th>Name</th>
                                                <th>Date of Birth</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {csvPassengers
                                                .slice(0, 20)
                                                .map(
                                                    (
                                                        passenger,
                                                        index
                                                    ) => (
                                                        <tr
                                                            key={`${passenger.user_id}-${index}`}
                                                        >
                                                            <td>
                                                                {index +
                                                                    1}
                                                            </td>
                                                            <td>
                                                                {
                                                                    passenger.user_id
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    passenger.name
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    passenger.date_of_birth
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                        </tbody>

                                    </table>

                                </div>

                                {csvPassengers.length > 20 && (
                                    <p className="manage-passengers-preview-note">
                                        Showing first 20
                                        records only.
                                    </p>
                                )}

                            </div>
                        )}

                    </section>

                    {/* ================================
                        PASSENGER LIST
                    ================================= */}

                    <section className="manage-passengers-card">

                        <div className="manage-passengers-list-header">

                            <div>
                                <span className="manage-passengers-card-kicker">
                                    DIRECTORY
                                </span>

                                <h3>
                                    All Passengers
                                </h3>

                                <p>
                                    Manage passenger accounts
                                    created by administrators.
                                </p>
                            </div>

                            <div className="manage-passengers-list-actions">

                                <button
                                    type="button"
                                    onClick={fetchPassengers}
                                    disabled={
                                        passengerLoading ||
                                        bulkDeleting
                                    }
                                    className="manage-passengers-refresh-btn"
                                >
                                    ↻{" "}
                                    {passengerLoading
                                        ? "Loading..."
                                        : "Refresh"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleBulkDelete
                                    }
                                    disabled={
                                        selectedPassengerIds.length ===
                                            0 ||
                                        bulkDeleting
                                    }
                                    className="manage-passengers-delete-selected-btn"
                                >
                                    {bulkDeleting
                                        ? "Deleting..."
                                        : `Delete Selected (${selectedPassengerIds.length})`}
                                </button>

                            </div>

                        </div>

                        {passengerLoading ? (
                            <div className="manage-passengers-loading">
                                <span className="manage-passengers-spinner"></span>
                                Loading passengers...
                            </div>
                        ) : passengers.length === 0 ? (
                            <div className="manage-passengers-empty">
                                <div>👥</div>
                                <h4>No passengers found</h4>
                                <p>
                                    Create a passenger account
                                    or import passengers using
                                    CSV.
                                </p>
                            </div>
                        ) : (
                            <div className="manage-passengers-table-wrapper">

                                <table className="manage-passengers-table">

                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        allSelected
                                                    }
                                                    onChange={
                                                        handleSelectAll
                                                    }
                                                    aria-label="Select all passengers"
                                                />
                                            </th>

                                            <th>ID</th>
                                            <th>User ID</th>
                                            <th>Name</th>
                                            <th>Date of Birth</th>
                                            <th>Role</th>
                                            <th>Created At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {passengers.map(
                                            (passenger) => (
                                                <tr
                                                    key={
                                                        passenger.id
                                                    }
                                                >
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPassengerIds.includes(
                                                                passenger.id
                                                            )}
                                                            onChange={() =>
                                                                handleSelectPassenger(
                                                                    passenger.id
                                                                )
                                                            }
                                                            aria-label={`Select ${passenger.user_id}`}
                                                        />
                                                    </td>

                                                    <td>
                                                        <span className="manage-passengers-id">
                                                            {
                                                                passenger.id
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <strong className="manage-passengers-user-id">
                                                            {
                                                                passenger.user_id
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <div className="manage-passengers-name-cell">
                                                            <div className="manage-passengers-mini-avatar">
                                                                {(
                                                                    passenger.name ||
                                                                    "P"
                                                                )
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>

                                                            <span>
                                                                {
                                                                    passenger.name
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {passenger.date_of_birth
                                                            ? new Date(
                                                                  passenger.date_of_birth
                                                              ).toLocaleDateString()
                                                            : "-"}
                                                    </td>

                                                    <td>
                                                        <span className="manage-passengers-role-badge">
                                                            {passenger.role ||
                                                                "passenger"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {passenger.created_at
                                                            ? new Date(
                                                                  passenger.created_at
                                                              ).toLocaleString()
                                                            : "-"}
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="manage-passengers-delete-btn"
                                                            onClick={() =>
                                                                handleDeletePassenger(
                                                                    passenger
                                                                )
                                                            }
                                                            disabled={
                                                                deletingPassengerId ===
                                                                    passenger.id ||
                                                                bulkDeleting
                                                            }
                                                        >
                                                            {deletingPassengerId ===
                                                            passenger.id
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

                    {/* ================================
                        POLICY INFO
                    ================================= */}

                    <section className="manage-passengers-policy">

                        <div className="manage-passengers-policy-icon">
                            🔐
                        </div>

                        <div>
                            <h3>
                                Passenger Account Policy
                            </h3>

                            <p>
                                Passenger accounts are created
                                and controlled by administrators.
                                User ID, name and date of birth
                                are managed by the admin. Passenger
                                passwords are never displayed in
                                this panel.
                            </p>

                            <div className="manage-passengers-policy-tags">
                                <span>Admin Only</span>
                                <span>No Self Registration</span>
                                <span>Secure Passwords</span>
                            </div>
                        </div>

                    </section>

                </main>

            </div>
        </div>
    );
}

export default ManagePassengers;