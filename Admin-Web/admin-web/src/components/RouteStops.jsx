import { useEffect, useState } from "react";
import axios from "axios";
import "./RouteStops.css";

const API_URL = "https://bus-tracking-backend-n00g.onrender.com";

function RouteStops({
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
  const [stops, setStops] = useState([]);
  const [routeStops, setRouteStops] = useState([]);

  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [selectedStopId, setSelectedStopId] = useState("");
  const [stopOrder, setStopOrder] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);

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

  const fetchStops = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/stops`,
        getAuthConfig()
      );

      setStops(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Stops load nahi ho paaye."
      );
    }
  };

  const fetchRouteStops = async (routeId) => {
    if (!routeId) {
      setRouteStops([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/route-stops/route/${routeId}`,
        getAuthConfig()
      );

      setRouteStops(response.data.data?.stops || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Route ke stops load nahi ho paaye."
      );

      setRouteStops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
    fetchStops();
  }, []);

  useEffect(() => {
    fetchRouteStops(selectedRouteId);
  }, [selectedRouteId]);

  const handleAssignStop = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const routeId = Number(selectedRouteId);
    const stopId = Number(selectedStopId);
    const order = Number(stopOrder);

    if (!routeId) {
      setError("Route select karein.");
      return;
    }

    if (!stopId) {
      setError("Stop select karein.");
      return;
    }

    if (!Number.isInteger(order) || order <= 0) {
      setError("Stop order positive integer hona chahiye.");
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        `${API_URL}/api/route-stops`,
        {
          route_id: routeId,
          stop_id: stopId,
          stop_order: order,
        },
        getAuthConfig()
      );

      setSelectedStopId("");
      setStopOrder("");

      setMessage(
        "Stop successfully route mein assign ho gaya."
      );

      await fetchRouteStops(routeId);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Stop route mein assign nahi ho paaya."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveStop = async (routeStop) => {
    const routeStopId = Number(routeStop.id);

    if (!routeStopId) {
      setError("Invalid route stop assignment.");
      return;
    }

    const stopName =
      routeStop.name ||
      routeStop.stop_name ||
      "this stop";

    const confirmed = window.confirm(
      `Kya aap "${stopName}" ko is route se remove karna chahte hain?\n\n` +
        "Stop permanently delete nahi hoga. Sirf route se assignment remove hoga."
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingId(routeStopId);
      setError("");
      setMessage("");

      await axios.delete(
        `${API_URL}/api/route-stops/${routeStopId}`,
        getAuthConfig()
      );

      setMessage(
        "Stop route se successfully remove ho gaya."
      );

      await fetchRouteStops(selectedRouteId);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Stop route se remove nahi ho paaya."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleNavigation = (callback) => {
    setMenuOpen(false);

    if (callback) {
      callback();
    }
  };

  return (
    <div className="route-stops-page">
      {menuOpen && (
        <div
          className="route-stops-mobile-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`route-stops-sidebar ${
          menuOpen ? "route-stops-sidebar-open" : ""
        }`}
      >
        <div className="route-stops-sidebar-brand">
          <div className="route-stops-brand-icon">🚌</div>

          <div>
            <h2>SRIIT SmartBus</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="route-stops-navigation">
          <button
            className="route-stops-nav-item"
            onClick={() => handleNavigation(onBack)}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="route-stops-nav-item"
            onClick={() => handleNavigation(onOpenBuses)}
          >
            <span>🚌</span>
            Buses
          </button>

          <button
            className="route-stops-nav-item"
            onClick={() => handleNavigation(onOpenDrivers)}
          >
            <span>👨‍✈️</span>
            Drivers
          </button>

          <button
            className="route-stops-nav-item"
            onClick={() => handleNavigation(onOpenPassengers)}
          >
            <span>👥</span>
            Passengers
          </button>

          <button
            className="route-stops-nav-item"
            onClick={() => handleNavigation(onOpenRoutes)}
          >
            <span>🛣️</span>
            Routes
          </button>

          <button
            className="route-stops-nav-item"
            onClick={() => handleNavigation(onOpenStops)}
          >
            <span>📍</span>
            Stops
          </button>

          <button className="route-stops-nav-item active">
            <span>🔗</span>
            Route Stops
          </button>

          <button
            className="route-stops-nav-item"
            onClick={() => handleNavigation(onOpenTrips)}
          >
            <span>🚍</span>
            Trips
            <span className="route-stops-live-dot" />
          </button>
        </nav>

        <div className="route-stops-sidebar-bottom">
          <div className="route-stops-security">
            <span>🔒</span>

            <div>
              <strong>Secure Portal</strong>
              <small>Admin access only</small>
            </div>
          </div>

          <button
            className="route-stops-sidebar-logout"
            onClick={onLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="route-stops-main">
        <header className="route-stops-topbar">
          <button
            className="route-stops-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>

          <div className="route-stops-topbar-title">
            <span>Route Management</span>
            <h1>Route Stops</h1>
          </div>

          <div className="route-stops-admin-profile">
            <div className="route-stops-admin-avatar">
              {(admin?.name || admin?.email || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="route-stops-admin-info">
              <strong>
                {admin?.name || "Admin"}
              </strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <main className="route-stops-content">
          <section className="route-stops-welcome">
            <div>
              <span className="route-stops-page-label">
                ROUTE CONFIGURATION
              </span>

              <h2>Assign stops to routes</h2>

              <p>
                Route ka sequence manage karein aur passengers ke
                liye correct stop order maintain karein.
              </p>
            </div>

            <div className="route-stops-status-badge">
              <span />
              System Ready
            </div>
          </section>

          <section className="route-stops-stats">
            <div className="route-stops-stat-card">
              <div className="route-stops-stat-icon route-icon">
                🛣️
              </div>

              <div>
                <span>Total Routes</span>
                <strong>{routes.length}</strong>
              </div>
            </div>

            <div className="route-stops-stat-card">
              <div className="route-stops-stat-icon stop-icon">
                📍
              </div>

              <div>
                <span>Total Stops</span>
                <strong>{stops.length}</strong>
              </div>
            </div>

            <div className="route-stops-stat-card">
              <div className="route-stops-stat-icon assigned-icon">
                🔗
              </div>

              <div>
                <span>Assigned Stops</span>
                <strong>{routeStops.length}</strong>
              </div>
            </div>

            <div className="route-stops-stat-card">
              <div className="route-stops-stat-icon order-icon">
                🔢
              </div>

              <div>
                <span>Selected Route</span>
                <strong>
                  {selectedRouteId || "—"}
                </strong>
              </div>
            </div>
          </section>

          {error && (
            <div className="route-stops-alert route-stops-alert-error">
              <span>⚠️</span>
              <div>
                <strong>Action could not be completed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="route-stops-alert route-stops-alert-success">
              <span>✓</span>
              <div>
                <strong>Success</strong>
                <p>{message}</p>
              </div>
            </div>
          )}

          <section className="route-stops-card route-stops-assignment-card">
            <div className="route-stops-card-header">
              <div className="route-stops-card-heading">
                <div className="route-stops-heading-icon">
                  🔗
                </div>

                <div>
                  <h2>Assign Stop to Route</h2>
                  <p>
                    Route select karke usme stop aur uska sequence
                    assign karein.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleAssignStop}
              className="route-stops-form"
            >
              <div className="route-stops-form-group">
                <label htmlFor="route-select">
                  Route
                </label>

                <select
                  id="route-select"
                  value={selectedRouteId}
                  onChange={(e) =>
                    setSelectedRouteId(e.target.value)
                  }
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

              <div className="route-stops-form-group">
                <label htmlFor="stop-select">
                  Stop
                </label>

                <select
                  id="stop-select"
                  value={selectedStopId}
                  onChange={(e) =>
                    setSelectedStopId(e.target.value)
                  }
                >
                  <option value="">
                    Select Stop
                  </option>

                  {stops.map((stop) => (
                    <option
                      key={stop.id}
                      value={stop.id}
                    >
                      {stop.name} (ID: {stop.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="route-stops-form-group">
                <label htmlFor="stop-order">
                  Stop Order
                </label>

                <input
                  id="stop-order"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 1"
                  value={stopOrder}
                  onChange={(e) =>
                    setStopOrder(e.target.value)
                  }
                />

                <small>
                  1 = first stop, 2 = second stop...
                </small>
              </div>

              <button
                type="submit"
                className="route-stops-add-btn"
                disabled={saving}
              >
                <span>{saving ? "⏳" : "＋"}</span>
                {saving
                  ? "Assigning..."
                  : "Assign Stop"}
              </button>
            </form>
          </section>

          <section className="route-stops-card route-stops-list-card">
            <div className="route-stops-list-header">
              <div className="route-stops-card-heading">
                <div className="route-stops-heading-icon">
                  📍
                </div>

                <div>
                  <h2>Assigned Route Stops</h2>

                  <p>
                    {selectedRouteId
                      ? `Route ID ${selectedRouteId} ke assigned stops`
                      : "Route select karke assigned stops dekhein."}
                  </p>
                </div>
              </div>

              {selectedRouteId && (
                <button
                  className="route-stops-refresh-btn"
                  onClick={() =>
                    fetchRouteStops(selectedRouteId)
                  }
                  disabled={loading}
                >
                  <span>↻</span>
                  {loading ? "Loading..." : "Refresh"}
                </button>
              )}
            </div>

            {!selectedRouteId ? (
              <div className="route-stops-state route-stops-empty-state">
                <div className="route-stops-state-icon">
                  🛣️
                </div>

                <h3>Select a route</h3>

                <p>
                  Route select karne ke baad uske assigned stops
                  yahan dikhenge.
                </p>
              </div>
            ) : loading ? (
              <div className="route-stops-state">
                <div className="route-stops-spinner" />
                <h3>Loading route stops...</h3>
                <p>Please wait.</p>
              </div>
            ) : routeStops.length === 0 ? (
              <div className="route-stops-state route-stops-empty-state">
                <div className="route-stops-state-icon">
                  📍
                </div>

                <h3>No stops assigned</h3>

                <p>
                  Is route par abhi koi stop assigned nahi hai.
                </p>
              </div>
            ) : (
              <>
                <div className="route-stops-route-summary">
                  <div>
                    <span>Selected Route</span>
                    <strong>Route #{selectedRouteId}</strong>
                  </div>

                  <div>
                    <span>Stops in Route</span>
                    <strong>{routeStops.length}</strong>
                  </div>
                </div>

                <div className="route-stops-table-wrapper">
                  <table className="route-stops-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Stop ID</th>
                        <th>Stop Name</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {routeStops.map((item) => {
                        const itemId = Number(item.id);

                        return (
                          <tr
                            key={
                              item.id ||
                              `${item.stop_id}-${item.stop_order}`
                            }
                          >
                            <td>
                              <span className="route-stops-order-badge">
                                {item.stop_order}
                              </span>
                            </td>

                            <td>
                              <span className="route-stops-id">
                                #{item.stop_id}
                              </span>
                            </td>

                            <td>
                              <div className="route-stops-name-cell">
                                <span className="route-stops-stop-icon">
                                  📍
                                </span>

                                <strong>
                                  {item.name ||
                                    item.stop_name ||
                                    "-"}
                                </strong>
                              </div>
                            </td>

                            <td>
                              {item.latitude ?? "-"}
                            </td>

                            <td>
                              {item.longitude ?? "-"}
                            </td>

                            <td>
                              <button
                                className="route-stops-remove-btn"
                                onClick={() =>
                                  handleRemoveStop(item)
                                }
                                disabled={
                                  removingId === itemId
                                }
                              >
                                {removingId === itemId
                                  ? "Removing..."
                                  : "Remove"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          <section className="route-stops-info-card">
            <div className="route-stops-info-icon">
              ℹ️
            </div>

            <div>
              <h3>Route Stop Management</h3>

              <ul>
                <li>
                  Stop ko route se remove karne par stop
                  permanently delete nahi hota.
                </li>

                <li>
                  Stop order passenger route sequence ko
                  determine karta hai.
                </li>

                <li>
                  Same stop ko different routes me separately
                  assign kiya ja sakta hai.
                </li>

                <li>
                  Route configuration change karne ke baad active
                  trip data ko verify karein.
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default RouteStops;