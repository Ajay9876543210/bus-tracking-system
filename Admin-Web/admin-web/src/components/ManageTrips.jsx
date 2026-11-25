import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageTrips.css";

const API_URL = "https://bus-tracking-backend-n00g.onrender.com";

function ManageTrips({
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
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [selectedBusId, setSelectedBusId] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");

  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [endingTripId, setEndingTripId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const getAuthConfig = () => {
    const token = localStorage.getItem("adminToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/trips`,
        getAuthConfig()
      );

      setTrips(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Trips load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/buses`,
        getAuthConfig()
      );

      setBuses(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Buses load nahi ho paaye."
      );
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/drivers`,
        getAuthConfig()
      );

      setDrivers(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Drivers load nahi ho paaye."
      );
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/routes`,
        getAuthConfig()
      );

      setRoutes(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Routes load nahi ho paaye."
      );
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchBuses();
    fetchDrivers();
    fetchRoutes();
  }, []);

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  const navigate = (callback) => {
    closeMobileMenu();

    if (callback) {
      callback();
    }
  };

  const activeTrips = trips.filter(
    (trip) => trip.status === "active"
  );

  const completedTrips = trips.filter(
    (trip) => trip.status !== "active"
  );

  const availableBuses = buses.filter(
    (bus) => bus.status === "inactive"
  );

  const handleStartTrip = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const busId = Number(selectedBusId);
    const driverId = Number(selectedDriverId);
    const routeId = Number(selectedRouteId);

    if (!busId) {
      setError("Bus select karein.");
      return;
    }

    if (!driverId) {
      setError("Driver select karein.");
      return;
    }

    if (!routeId) {
      setError("Route select karein.");
      return;
    }

    try {
      setStarting(true);

      await axios.post(
        `${API_URL}/api/trips`,
        {
          bus_id: busId,
          driver_id: driverId,
          route_id: routeId,
        },
        getAuthConfig()
      );

      setSelectedBusId("");
      setSelectedDriverId("");
      setSelectedRouteId("");

      setMessage("Trip successfully start ho gayi.");

      await fetchTrips();
      await fetchBuses();
      await fetchDrivers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Trip start nahi ho paayi."
      );
    } finally {
      setStarting(false);
    }
  };

  const handleEndTrip = async (tripId) => {
    setError("");
    setMessage("");

    const confirmEnd = window.confirm(
      `Kya aap Trip #${tripId} ko end karna chahte hain?`
    );

    if (!confirmEnd) {
      return;
    }

    try {
      setEndingTripId(tripId);

      await axios.patch(
        `${API_URL}/api/trips/${tripId}/end`,
        {},
        getAuthConfig()
      );

      setMessage(
        `Trip #${tripId} successfully end ho gayi.`
      );

      await fetchTrips();
      await fetchBuses();
      await fetchDrivers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Trip end nahi ho paayi."
      );
    } finally {
      setEndingTripId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div className="manage-trips-page">
      {menuOpen && (
        <div
          className="manage-trips-mobile-overlay"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`manage-trips-sidebar ${
          menuOpen
            ? "manage-trips-sidebar-open"
            : ""
        }`}
      >
        <div className="manage-trips-sidebar-brand">
          <div className="manage-trips-brand-icon">
            🚌
          </div>

          <div>
            <h2>SRIIT SmartBus</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="manage-trips-navigation">
          <button
            className="manage-trips-nav-item"
            onClick={() => navigate(onBack)}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="manage-trips-nav-item"
            onClick={() => navigate(onOpenBuses)}
          >
            <span>🚌</span>
            Buses
          </button>

          <button
            className="manage-trips-nav-item"
            onClick={() => navigate(onOpenDrivers)}
          >
            <span>👨‍✈️</span>
            Drivers
          </button>

          <button
            className="manage-trips-nav-item"
            onClick={() => navigate(onOpenPassengers)}
          >
            <span>👥</span>
            Passengers
          </button>

          <button
            className="manage-trips-nav-item"
            onClick={() => navigate(onOpenRoutes)}
          >
            <span>🛣️</span>
            Routes
          </button>

          <button
            className="manage-trips-nav-item"
            onClick={() => navigate(onOpenStops)}
          >
            <span>📍</span>
            Stops
          </button>

          <button
            className="manage-trips-nav-item"
            onClick={() => navigate(onOpenRouteStops)}
          >
            <span>🔗</span>
            Route Stops
          </button>

          <button className="manage-trips-nav-item active">
            <span>🚦</span>
            Trips
          </button>
        </nav>

        <div className="manage-trips-sidebar-bottom">
          <div className="manage-trips-security">
            <span>🔒</span>

            <div>
              <strong>Secure Portal</strong>
              <small>Admin access only</small>
            </div>
          </div>

          <button
            className="manage-trips-sidebar-logout"
            onClick={onLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="manage-trips-main">
        <header className="manage-trips-topbar">
          <button
            className="manage-trips-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="manage-trips-topbar-title">
            <span>Administration</span>
            <h1>Manage Trips</h1>
          </div>

          <div className="manage-trips-admin-profile">
            <div className="manage-trips-admin-avatar">
              {(admin?.name ||
                admin?.email ||
                "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {admin?.name || "Administrator"}
              </strong>

              <span>Admin</span>
            </div>
          </div>
        </header>

        <main className="manage-trips-content">
          <section className="manage-trips-page-heading">
            <div>
              <span className="manage-trips-eyebrow">
                LIVE OPERATIONS
              </span>

              <h2>Trip Management</h2>

              <p>
                Start, monitor and end bus trips from
                one central admin panel.
              </p>
            </div>

            <div className="manage-trips-live-badge">
              <span />
              LIVE OPERATIONS
            </div>
          </section>

          <section className="manage-trips-stats-grid">
            <div className="manage-trips-stat-card">
              <div className="manage-trips-stat-icon">
                🚦
              </div>

              <div>
                <span>Active Trips</span>
                <strong>{activeTrips.length}</strong>
                <small>Currently running</small>
              </div>
            </div>

            <div className="manage-trips-stat-card">
              <div className="manage-trips-stat-icon">
                🚌
              </div>

              <div>
                <span>Available Buses</span>
                <strong>{availableBuses.length}</strong>
                <small>Ready for trip</small>
              </div>
            </div>

            <div className="manage-trips-stat-card">
              <div className="manage-trips-stat-icon">
                ✓
              </div>

              <div>
                <span>Completed Trips</span>
                <strong>{completedTrips.length}</strong>
                <small>Trip history</small>
              </div>
            </div>

            <div className="manage-trips-stat-card">
              <div className="manage-trips-stat-icon">
                🛣️
              </div>

              <div>
                <span>Total Routes</span>
                <strong>{routes.length}</strong>
                <small>Configured routes</small>
              </div>
            </div>
          </section>

          <section className="manage-trips-card manage-trips-start-card">
            <div className="manage-trips-card-heading">
              <div className="manage-trips-card-icon">
                ▶
              </div>

              <div>
                <h3>Start New Trip</h3>
                <p>
                  Assign a bus, driver and route to
                  start a trip.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleStartTrip}
              className="manage-trips-form"
            >
              <div className="manage-trips-form-group">
                <label htmlFor="trip-bus">
                  Bus
                </label>

                <select
                  id="trip-bus"
                  value={selectedBusId}
                  onChange={(e) =>
                    setSelectedBusId(e.target.value)
                  }
                  disabled={starting}
                >
                  <option value="">
                    Select Bus
                  </option>

                  {buses.map((bus) => (
                    <option
                      key={bus.id}
                      value={bus.id}
                      disabled={
                        bus.status !== "inactive"
                      }
                    >
                      {bus.bus_number} (ID: {bus.id}) -{" "}
                      {bus.status}
                    </option>
                  ))}
                </select>

                <small>
                  Sirf inactive bus start trip ke
                  liye available hai.
                </small>
              </div>

              <div className="manage-trips-form-group">
                <label htmlFor="trip-driver">
                  Driver
                </label>

                <select
                  id="trip-driver"
                  value={selectedDriverId}
                  onChange={(e) =>
                    setSelectedDriverId(e.target.value)
                  }
                  disabled={starting}
                >
                  <option value="">
                    Select Driver
                  </option>

                  {drivers.map((driver) => {
                    const driverHasActiveTrip =
                      trips.some(
                        (trip) =>
                          trip.status === "active" &&
                          Number(trip.driver_id) ===
                            Number(driver.id)
                      );

                    return (
                      <option
                        key={driver.id}
                        value={driver.id}
                        disabled={driverHasActiveTrip}
                      >
                        {driver.name} (ID:{" "}
                        {driver.id})
                        {driverHasActiveTrip
                          ? " - On Active Trip"
                          : ""}
                      </option>
                    );
                  })}
                </select>

                <small>
                  Active trip wala driver select
                  nahi kiya ja sakta.
                </small>
              </div>

              <div className="manage-trips-form-group">
                <label htmlFor="trip-route">
                  Route
                </label>

                <select
                  id="trip-route"
                  value={selectedRouteId}
                  onChange={(e) =>
                    setSelectedRouteId(e.target.value)
                  }
                  disabled={starting}
                >
                  <option value="">
                    Select Route
                  </option>

                  {routes.map((route) => (
                    <option
                      key={route.id}
                      value={route.id}
                    >
                      {route.name} (ID: {route.id})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="manage-trips-start-btn"
                disabled={starting}
              >
                {starting ? (
                  <>
                    <span className="manage-trips-spinner" />
                    Starting...
                  </>
                ) : (
                  <>
                    <span>▶</span>
                    Start Trip
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="manage-trips-alert manage-trips-alert-error">
                <span>⚠️</span>

                <div>
                  <strong>Action failed</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {message && (
              <div className="manage-trips-alert manage-trips-alert-success">
                <span>✓</span>

                <div>
                  <strong>Success</strong>
                  <p>{message}</p>
                </div>
              </div>
            )}
          </section>

          <section className="manage-trips-card manage-trips-list-card">
            <div className="manage-trips-list-header">
              <div>
                <h3>All Trips</h3>

                <p>
                  Active aur completed trips ki
                  complete list.
                </p>
              </div>

              <button
                className="manage-trips-refresh-btn"
                onClick={fetchTrips}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="manage-trips-refresh-spinner" />
                    Loading...
                  </>
                ) : (
                  <>↻ Refresh</>
                )}
              </button>
            </div>

            {loading ? (
              <div className="manage-trips-state">
                <div className="manage-trips-state-icon">
                  ⏳
                </div>

                <h4>
                  Trips load ho rahe hain...
                </h4>

                <p>
                  Please wait a moment.
                </p>
              </div>
            ) : trips.length === 0 ? (
              <div className="manage-trips-state">
                <div className="manage-trips-state-icon">
                  🚦
                </div>

                <h4>
                  Abhi koi trip available nahi
                  hai.
                </h4>

                <p>
                  Upar se bus, driver aur route
                  select karke trip start karein.
                </p>
              </div>
            ) : (
              <div className="manage-trips-table-wrapper">
                <table className="manage-trips-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Bus</th>
                      <th>Driver</th>
                      <th>Route</th>
                      <th>Started At</th>
                      <th>Ended At</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {trips.map((trip) => (
                      <tr key={trip.id}>
                        <td>
                          <span className="manage-trips-id">
                            #{trip.id}
                          </span>
                        </td>

                        <td>
                          <div className="manage-trips-name-cell">
                            <div className="manage-trips-row-icon">
                              🚌
                            </div>

                            <strong>
                              {trip.bus_number ||
                                `Bus #${trip.bus_id}`}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <div className="manage-trips-driver-cell">
                            <strong>
                              {trip.driver_name ||
                                `Driver #${trip.driver_id}`}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <span className="manage-trips-route">
                            {trip.route_name ||
                              `Route #${trip.route_id}`}
                          </span>
                        </td>

                        <td>
                          <span className="manage-trips-date">
                            {formatDate(
                              trip.started_at
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="manage-trips-date">
                            {formatDate(
                              trip.ended_at
                            )}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`manage-trips-status ${
                              trip.status === "active"
                                ? "active"
                                : trip.status ===
                                  "scheduled"
                                ? "scheduled"
                                : "completed"
                            }`}
                          >
                            <span />
                            {trip.status}
                          </span>
                        </td>

                        <td>
                          {trip.status ===
                          "active" ? (
                            <button
                              className="manage-trips-end-btn"
                              onClick={() =>
                                handleEndTrip(
                                  trip.id
                                )
                              }
                              disabled={
                                endingTripId ===
                                trip.id
                              }
                            >
                              {endingTripId ===
                              trip.id ? (
                                <>
                                  <span className="manage-trips-small-spinner" />
                                  Ending...
                                </>
                              ) : (
                                "End Trip"
                              )}
                            </button>
                          ) : (
                            <span className="manage-trips-completed">
                              ✓ Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="manage-trips-policy-card">
            <div className="manage-trips-policy-icon">
              🛡️
            </div>

            <div>
              <h3>Trip Operations Policy</h3>

              <p>
                A bus and driver already involved in an
                active trip should not be assigned to
                another active trip. End the current trip
                before reusing the resources.
              </p>

              <div className="manage-trips-policy-points">
                <span>
                  ✓ One active trip per bus
                </span>

                <span>
                  ✓ One active trip per driver
                </span>

                <span>
                  ✓ Admin controlled operations
                </span>

                <span>
                  ✓ Trip history preserved
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ManageTrips;