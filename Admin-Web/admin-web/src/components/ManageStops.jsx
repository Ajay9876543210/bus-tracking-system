import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageStops.css";

const API_URL = "https://bus-tracking-backend-n00g.onrender.com";

function ManageStops({
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
  const [stops, setStops] = useState([]);

  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const fetchStops = async () => {
    try {
      setLoading(true);
      setError("");

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStops();
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

  const handleAddStop = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const trimmedName = name.trim();
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!trimmedName) {
      setError("Stop name required hai.");
      return;
    }

    if (latitude === "" || !Number.isFinite(lat)) {
      setError("Valid latitude enter karein.");
      return;
    }

    if (lat < -90 || lat > 90) {
      setError(
        "Latitude -90 se 90 ke beech honi chahiye."
      );
      return;
    }

    if (longitude === "" || !Number.isFinite(lng)) {
      setError("Valid longitude enter karein.");
      return;
    }

    if (lng < -180 || lng > 180) {
      setError(
        "Longitude -180 se 180 ke beech honi chahiye."
      );
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        `${API_URL}/api/stops`,
        {
          name: trimmedName,
          latitude: lat,
          longitude: lng,
        },
        getAuthConfig()
      );

      setName("");
      setLatitude("");
      setLongitude("");

      setMessage("Stop successfully add ho gaya.");

      await fetchStops();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Stop add nahi ho paaya."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStop = async (stop) => {
    const confirmed = window.confirm(
      `Kya aap "${stop.name}" stop ko permanently delete karna chahte hain?\n\n` +
        "Agar ye stop kisi route me assigned hai, to delete nahi hoga."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setMessage("");

      await axios.delete(
        `${API_URL}/api/stops/${stop.id}`,
        getAuthConfig()
      );

      setMessage(
        `Stop "${stop.name}" permanently delete ho gaya.`
      );

      await fetchStops();
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData?.data?.route_count) {
        setError(
          `Stop delete nahi ho sakta. Ye ${responseData.data.route_count} route(s) me assigned hai.`
        );
      } else {
        setError(
          responseData?.message ||
            "Stop delete nahi ho paaya."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="manage-stops-page">
      {menuOpen && (
        <div
          className="manage-stops-mobile-overlay"
          onClick={closeMobileMenu}
        />
      )}

      <aside
        className={`manage-stops-sidebar ${
          menuOpen ? "manage-stops-sidebar-open" : ""
        }`}
      >
        <div className="manage-stops-sidebar-brand">
          <div className="manage-stops-brand-icon">🚌</div>

          <div>
            <h2>SRIIT SmartBus</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="manage-stops-navigation">
          <button
            className="manage-stops-nav-item"
            onClick={() => navigate(onBack)}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="manage-stops-nav-item"
            onClick={() => navigate(onOpenBuses)}
          >
            <span>🚌</span>
            Buses
          </button>

          <button
            className="manage-stops-nav-item"
            onClick={() => navigate(onOpenDrivers)}
          >
            <span>👨‍✈️</span>
            Drivers
          </button>

          <button
            className="manage-stops-nav-item"
            onClick={() => navigate(onOpenPassengers)}
          >
            <span>👥</span>
            Passengers
          </button>

          <button
            className="manage-stops-nav-item"
            onClick={() => navigate(onOpenRoutes)}
          >
            <span>🛣️</span>
            Routes
          </button>

          <button className="manage-stops-nav-item active">
            <span>📍</span>
            Stops
          </button>

          <button
            className="manage-stops-nav-item"
            onClick={() => navigate(onOpenRouteStops)}
          >
            <span>🔗</span>
            Route Stops
          </button>

          <button
            className="manage-stops-nav-item"
            onClick={() => navigate(onOpenTrips)}
          >
            <span>🚦</span>
            Trips
          </button>
        </nav>

        <div className="manage-stops-sidebar-bottom">
          <div className="manage-stops-security">
            <span>🔒</span>
            <div>
              <strong>Secure Portal</strong>
              <small>Admin access only</small>
            </div>
          </div>

          <button
            className="manage-stops-sidebar-logout"
            onClick={onLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="manage-stops-main">
        <header className="manage-stops-topbar">
          <button
            className="manage-stops-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="manage-stops-topbar-title">
            <span>Administration</span>
            <h1>Manage Stops</h1>
          </div>

          <div className="manage-stops-admin-profile">
            <div className="manage-stops-admin-avatar">
              {(admin?.name || admin?.email || "A")
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

        <main className="manage-stops-content">
          <section className="manage-stops-page-heading">
            <div>
              <span className="manage-stops-eyebrow">
                TRANSPORT MANAGEMENT
              </span>

              <h2>Bus Stop Management</h2>

              <p>
                Create and manage the pickup and drop-off
                locations used by your bus routes.
              </p>
            </div>

            <div className="manage-stops-status-badge">
              <span />
              System Ready
            </div>
          </section>

          <section className="manage-stops-stats-grid">
            <div className="manage-stops-stat-card">
              <div className="manage-stops-stat-icon">📍</div>

              <div>
                <span>Total Stops</span>
                <strong>{stops.length}</strong>
                <small>Currently listed</small>
              </div>
            </div>

            <div className="manage-stops-stat-card">
              <div className="manage-stops-stat-icon">🌐</div>

              <div>
                <span>GPS Locations</span>
                <strong>{stops.length}</strong>
                <small>Configured coordinates</small>
              </div>
            </div>

            <div className="manage-stops-stat-card">
              <div className="manage-stops-stat-icon">🛣️</div>

              <div>
                <span>Route Ready</span>
                <strong>YES</strong>
                <small>Available for assignment</small>
              </div>
            </div>
          </section>

          <section className="manage-stops-card manage-stops-create-card">
            <div className="manage-stops-card-heading">
              <div>
                <div className="manage-stops-card-icon">
                  ＋
                </div>

                <div>
                  <h3>Add New Stop</h3>
                  <p>
                    Enter the stop name and exact GPS
                    coordinates.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleAddStop}
              className="manage-stops-form"
            >
              <div className="manage-stops-form-group">
                <label htmlFor="stop-name">
                  Stop Name
                </label>

                <input
                  id="stop-name"
                  type="text"
                  placeholder="e.g. Rajwada"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  disabled={saving}
                />
              </div>

              <div className="manage-stops-form-group">
                <label htmlFor="stop-latitude">
                  Latitude
                </label>

                <input
                  id="stop-latitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 22.7196"
                  value={latitude}
                  onChange={(e) =>
                    setLatitude(e.target.value)
                  }
                  disabled={saving}
                />
              </div>

              <div className="manage-stops-form-group">
                <label htmlFor="stop-longitude">
                  Longitude
                </label>

                <input
                  id="stop-longitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 75.8577"
                  value={longitude}
                  onChange={(e) =>
                    setLongitude(e.target.value)
                  }
                  disabled={saving}
                />
              </div>

              <button
                type="submit"
                className="manage-stops-add-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="manage-stops-spinner" />
                    Adding...
                  </>
                ) : (
                  <>
                    <span>＋</span>
                    Add Stop
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="manage-stops-alert manage-stops-alert-error">
                <span>⚠️</span>
                <div>
                  <strong>Action failed</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {message && (
              <div className="manage-stops-alert manage-stops-alert-success">
                <span>✓</span>
                <div>
                  <strong>Success</strong>
                  <p>{message}</p>
                </div>
              </div>
            )}
          </section>

          <section className="manage-stops-card manage-stops-list-card">
            <div className="manage-stops-list-header">
              <div>
                <h3>All Stops</h3>
                <p>
                  View and manage all configured bus
                  stops.
                </p>
              </div>

              <button
                className="manage-stops-refresh-btn"
                onClick={fetchStops}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="manage-stops-spinner" />
                    Loading...
                  </>
                ) : (
                  <>
                    ↻ Refresh
                  </>
                )}
              </button>
            </div>

            {loading ? (
              <div className="manage-stops-state">
                <div className="manage-stops-state-icon">
                  ⏳
                </div>
                <h4>Stops load ho rahe hain...</h4>
                <p>Please wait a moment.</p>
              </div>
            ) : stops.length === 0 ? (
              <div className="manage-stops-state">
                <div className="manage-stops-state-icon">
                  📍
                </div>
                <h4>Abhi koi stop available nahi hai.</h4>
                <p>
                  Add New Stop form se pehla stop create
                  karein.
                </p>
              </div>
            ) : (
              <div className="manage-stops-table-wrapper">
                <table className="manage-stops-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Stop</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stops.map((stop) => (
                      <tr key={stop.id}>
                        <td>
                          <span className="manage-stops-id">
                            #{stop.id}
                          </span>
                        </td>

                        <td>
                          <div className="manage-stops-name-cell">
                            <div className="manage-stops-location-icon">
                              📍
                            </div>

                            <strong>{stop.name}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="manage-stops-coordinate">
                            {stop.latitude}
                          </span>
                        </td>

                        <td>
                          <span className="manage-stops-coordinate">
                            {stop.longitude}
                          </span>
                        </td>

                        <td>
                          <span className="manage-stops-date">
                            {stop.created_at
                              ? new Date(
                                  stop.created_at
                                ).toLocaleString()
                              : "-"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="manage-stops-delete-btn"
                            onClick={() =>
                              handleDeleteStop(stop)
                            }
                            disabled={deleting}
                          >
                            {deleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="manage-stops-policy-card">
            <div className="manage-stops-policy-icon">
              🛡️
            </div>

            <div>
              <h3>Stop Management Policy</h3>

              <p>
                Stops are used as route pickup/drop-off
                points. Before deleting a stop, make sure
                it is not assigned to any route.
              </p>

              <div className="manage-stops-policy-points">
                <span>✓ Accurate GPS coordinates required</span>
                <span>✓ Admin controlled management</span>
                <span>✓ Assigned stops cannot be deleted</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ManageStops;