import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { styles } from './dashboard.styles';
import GPSTracker from '@/components/GPS/GPSTracker';

const API_URL =
  'https://bus-tracking-backend-n00g.onrender.com';

type DriverUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ActiveTrip = {
  trip_id: number;
  bus_id: number;
  driver_id: number;
  route_id: number;
  status: string;
  started_at: string;
  bus_number?: string;
  route_name?: string;
};

type BusOption = {
  id: number;
  bus_number: string;
  status: string;
};

type RouteOption = {
  id: number;
  name: string;
  description: string | null;
};

export default function Dashboard() {
  const [user, setUser] =
    useState<DriverUser | null>(null);

  const [activeTrip, setActiveTrip] =
    useState<ActiveTrip | null>(null);

  const [buses, setBuses] =
    useState<BusOption[]>([]);

  const [routes, setRoutes] =
    useState<RouteOption[]>([]);

  const [selectedBusId, setSelectedBusId] =
    useState<number | null>(null);

  const [selectedRouteId, setSelectedRouteId] =
    useState<number | null>(null);

  const [showBusList, setShowBusList] =
    useState(false);

  const [showRouteList, setShowRouteList] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [optionsLoading, setOptionsLoading] =
    useState(false);

  const [startingTrip, setStartingTrip] =
    useState(false);

  const [endingTrip, setEndingTrip] =
    useState(false);

  const loadDashboard = async () => {
    try {
      const token =
        await SecureStore.getItemAsync(
          'driver_token'
        );

      const storedUser =
        await SecureStore.getItemAsync(
          'driver_user'
        );

      if (!token) {
        router.replace('/');
        return;
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const response = await axios.get(
        `${API_URL}/api/trips/my-active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setActiveTrip(response.data.data);
      }
    } catch (error: any) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        await SecureStore.deleteItemAsync(
          'driver_token'
        );

        await SecureStore.deleteItemAsync(
          'driver_user'
        );

        router.replace('/');
        return;
      }

      if (error.response?.status === 404) {
        setActiveTrip(null);
      } else {
        console.log(
          'Load dashboard error:',
          error.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTripOptions = async () => {
    try {
      setOptionsLoading(true);

      const token =
        await SecureStore.getItemAsync(
          'driver_token'
        );

      if (!token) {
        router.replace('/');
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/trips/options`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setBuses(
          response.data.data.buses || []
        );

        setRoutes(
          response.data.data.routes || []
        );
      }
    } catch (error: any) {
      console.log(
        'Load trip options error:',
        error.response?.data ||
          error.message
      );

      Alert.alert(
        'Error',
        'Bus aur route list load nahi ho saki.'
      );
    } finally {
      setOptionsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadTripOptions();
  }, []);

  const startTrip = async () => {
    if (!selectedBusId) {
      Alert.alert(
        'Select Bus',
        'Please bus select karein.'
      );
      return;
    }

    if (!selectedRouteId) {
      Alert.alert(
        'Select Route',
        'Please route select karein.'
      );
      return;
    }

    try {
      setStartingTrip(true);

      const token =
        await SecureStore.getItemAsync(
          'driver_token'
        );

      if (!token) {
        router.replace('/');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/trips`,
        {
          bus_id: selectedBusId,
          route_id: selectedRouteId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.success) {
        Alert.alert(
          'Trip Started',
          'Trip successfully start ho gayi.'
        );

        setShowBusList(false);
        setShowRouteList(false);
        setSelectedBusId(null);
        setSelectedRouteId(null);

        await loadDashboard();
        await loadTripOptions();
      }
    } catch (error: any) {
      console.log(
        'Start trip error:',
        error.response?.data ||
          error.message
      );

      Alert.alert(
        'Start Trip Error',
        error.response?.data?.message ||
          'Trip start nahi ho saki.'
      );
    } finally {
      setStartingTrip(false);
    }
  };

  const endTrip = () => {
    if (!activeTrip) {
      return;
    }

    Alert.alert(
      'End Trip',
      `Kya aap Trip #${activeTrip.trip_id} ko end karna chahte hain?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Trip',
          style: 'destructive',
          onPress: async () => {
            try {
              setEndingTrip(true);

              const token =
                await SecureStore.getItemAsync(
                  'driver_token'
                );

              if (!token) {
                router.replace('/');
                return;
              }

              const response =
                await axios.patch(
                  `${API_URL}/api/trips/${activeTrip.trip_id}/end`,
                  {},
                  {
                    headers: {
                      Authorization:
                        `Bearer ${token}`,
                      'Content-Type':
                        'application/json',
                    },
                  }
                );

              if (response.data?.success) {
                setActiveTrip(null);
                setSelectedBusId(null);
                setSelectedRouteId(null);
                setShowBusList(false);
                setShowRouteList(false);

                await loadTripOptions();

                Alert.alert(
                  'Trip Ended',
                  'Trip successfully end ho gayi aur GPS tracking stop ho gayi.'
                );
              }
            } catch (error: any) {
              console.log(
                'End trip error:',
                error.response?.data ||
                  error.message
              );

              if (
                error.response?.status === 401 ||
                error.response?.status === 403
              ) {
                await SecureStore.deleteItemAsync(
                  'driver_token'
                );

                await SecureStore.deleteItemAsync(
                  'driver_user'
                );

                router.replace('/');
                return;
              }

              Alert.alert(
                'End Trip Error',
                error.response?.data?.message ||
                  'Trip end nahi ho saki.'
              );
            } finally {
              setEndingTrip(false);
            }
          },
        },
      ]
    );
  };

  const logout = async () => {
    try {
      const token =
        await SecureStore.getItemAsync(
          'driver_token'
        );

      if (token) {
        try {
          await axios.post(
            `${API_URL}/api/auth/driver/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log(
            'Driver logout API error:',
            error
          );
        }
      }

      await SecureStore.deleteItemAsync(
        'driver_token'
      );

      await SecureStore.deleteItemAsync(
        'driver_user'
      );

      router.replace('/');
    } catch (error) {
      console.log(
        'Logout error:',
        error
      );
    }
  };

  const selectedBus = buses.find(
    (bus) => bus.id === selectedBusId
  );

  const selectedRoute = routes.find(
    (route) => route.id === selectedRouteId
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator
            size="large"
            color="#4f46e5"
          />

          <Text style={styles.loadingText}>
            Dashboard loading...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.brandMini}>
            <Text style={styles.brandEmoji}>
              🚌
            </Text>

            <View>
              <Text style={styles.brandName}>
                SRIIT SmartBus
              </Text>

              <Text style={styles.brandTagline}>
                Driver Portal
              </Text>
            </View>
          </View>

          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />

            <Text style={styles.onlineText}>
              ONLINE
            </Text>
          </View>
        </View>

        <View style={styles.welcomeBlock}>
          <Text style={styles.welcomeLabel}>
            Welcome back,
          </Text>

          <Text style={styles.title}>
            {user?.name || 'Driver'} 👋
          </Text>

          <Text style={styles.subtitle}>
            Manage your bus trip and live GPS
            tracking from here.
          </Text>
        </View>
      </View>

      {/* Driver Information */}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Text>👤</Text>
          </View>

          <View>
            <Text style={styles.cardTitle}>
              Driver Information
            </Text>

            <Text style={styles.cardSubtitle}>
              Your registered account
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.label}>
              NAME
            </Text>

            <Text style={styles.value}>
              {user?.name || '-'}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>
              EMAIL
            </Text>

            <Text style={styles.value}>
              {user?.email || '-'}
            </Text>
          </View>
        </View>
      </View>

      {/* Current Trip */}

      <View style={styles.tripCard}>
        <View style={styles.tripHeader}>
          <View>
            <Text style={styles.tripTitle}>
              Current Trip
            </Text>

            <Text style={styles.tripSubtitle}>
              {activeTrip
                ? 'Your trip is currently active'
                : 'Start a trip when you are ready'}
            </Text>
          </View>

          <View
            style={[
              styles.tripStatusBadge,
              activeTrip
                ? styles.activeBadge
                : styles.idleBadge,
            ]}
          >
            <View
              style={[
                styles.tripStatusDot,
                activeTrip
                  ? styles.activeDot
                  : styles.idleDot,
              ]}
            />

            <Text
              style={[
                styles.tripStatusText,
                activeTrip
                  ? styles.activeStatusText
                  : styles.idleStatusText,
              ]}
            >
              {activeTrip ? 'ACTIVE' : 'IDLE'}
            </Text>
          </View>
        </View>

        {activeTrip ? (
          <>
            {/* Trip Details */}

            <View style={styles.tripDetails}>
              <View style={styles.tripDetailItem}>
                <Text style={styles.detailIcon}>
                  🔢
                </Text>

                <View>
                  <Text style={styles.detailLabel}>
                    Trip ID
                  </Text>

                  <Text style={styles.detailValue}>
                    #{activeTrip.trip_id}
                  </Text>
                </View>
              </View>

              <View style={styles.tripDetailItem}>
                <Text style={styles.detailIcon}>
                  🚌
                </Text>

                <View>
                  <Text style={styles.detailLabel}>
                    Bus
                  </Text>

                  <Text style={styles.detailValue}>
                    {activeTrip.bus_number ||
                      `Bus #${activeTrip.bus_id}`}
                  </Text>
                </View>
              </View>

              <View style={styles.tripDetailItem}>
                <Text style={styles.detailIcon}>
                  🛣️
                </Text>

                <View>
                  <Text style={styles.detailLabel}>
                    Route
                  </Text>

                  <Text style={styles.detailValue}>
                    {activeTrip.route_name ||
                      `Route #${activeTrip.route_id}`}
                  </Text>
                </View>
              </View>

              <View style={styles.tripDetailItem}>
                <Text style={styles.detailIcon}>
                  🟢
                </Text>

                <View>
                  <Text style={styles.detailLabel}>
                    Status
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      styles.statusValue,
                    ]}
                  >
                    {activeTrip.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* GPS Section */}

            <View style={styles.gpsSection}>
              <View style={styles.gpsHeader}>
                <View>
                  <Text style={styles.gpsTitle}>
                    Live GPS Tracking
                  </Text>

                  <Text style={styles.gpsSubtitle}>
                    Send your current location to
                    passengers
                  </Text>
                </View>

                <Text style={styles.gpsIcon}>
                  📍
                </Text>
              </View>

              <GPSTracker
                tripId={activeTrip.trip_id}
              />
            </View>

            {/* End Trip */}

            <Pressable
              style={[
                styles.endButton,
                endingTrip &&
                  styles.buttonDisabled,
              ]}
              onPress={endTrip}
              disabled={endingTrip}
            >
              {endingTrip ? (
                <ActivityIndicator
                  color="#ffffff"
                />
              ) : (
                <>
                  <Text style={styles.endButtonIcon}>
                    ⏹
                  </Text>

                  <Text
                    style={styles.endButtonText}
                  >
                    End Trip
                  </Text>
                </>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.emptyTrip}>
              <View style={styles.emptyTripIcon}>
                <Text>🚌</Text>
              </View>

              <Text style={styles.waitingText}>
                No active trip
              </Text>

              <Text style={styles.smallText}>
                Select a bus and route below to
                start your trip.
              </Text>
            </View>

            {/* Bus */}

            <View style={styles.selectionSection}>
              <Text style={styles.inputLabel}>
                Select Bus
              </Text>

              <Pressable
                style={styles.dropdown}
                onPress={() => {
                  setShowBusList(!showBusList);
                  setShowRouteList(false);
                }}
                disabled={optionsLoading}
              >
                <View style={styles.dropdownLeft}>
                  <Text style={styles.dropdownIcon}>
                    🚌
                  </Text>

                  <View style={styles.dropdownContent}>
                    <Text
                      style={styles.dropdownLabel}
                    >
                      BUS
                    </Text>

                    <Text
                      style={styles.dropdownText}
                    >
                      {selectedBus
                        ? selectedBus.bus_number
                        : optionsLoading
                        ? 'Loading buses...'
                        : 'Select Bus'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.dropdownArrow}>
                  {showBusList ? '▲' : '▼'}
                </Text>
              </Pressable>

              {showBusList && (
                <View style={styles.dropdownList}>
                  {buses.length === 0 ? (
                    <Text
                      style={styles.emptyOption}
                    >
                      No inactive buses available
                    </Text>
                  ) : (
                    buses.map((bus) => (
                      <Pressable
                        key={bus.id}
                        style={
                          styles.dropdownOption
                        }
                        onPress={() => {
                          setSelectedBusId(
                            bus.id
                          );

                          setShowBusList(false);
                        }}
                      >
                        <View
                          style={
                            styles.optionIcon
                          }
                        >
                          <Text>🚌</Text>
                        </View>

                        <View
                          style={
                            styles.optionContent
                          }
                        >
                          <Text
                            style={
                              styles.dropdownOptionTitle
                            }
                          >
                            {bus.bus_number}
                          </Text>

                          <Text
                            style={
                              styles.dropdownOptionDescription
                            }
                          >
                            Available
                          </Text>
                        </View>

                        {selectedBusId ===
                          bus.id && (
                          <Text
                            style={
                              styles.selectedCheck
                            }
                          >
                            ✓
                          </Text>
                        )}
                      </Pressable>
                    ))
                  )}
                </View>
              )}
            </View>

            {/* Route */}

            <View style={styles.selectionSection}>
              <Text style={styles.inputLabel}>
                Select Route
              </Text>

              <Pressable
                style={styles.dropdown}
                onPress={() => {
                  setShowRouteList(
                    !showRouteList
                  );

                  setShowBusList(false);
                }}
                disabled={optionsLoading}
              >
                <View style={styles.dropdownLeft}>
                  <Text style={styles.dropdownIcon}>
                    🛣️
                  </Text>

                  <View style={styles.dropdownContent}>
                    <Text
                      style={styles.dropdownLabel}
                    >
                      ROUTE
                    </Text>

                    <Text
                      style={styles.dropdownText}
                    >
                      {selectedRoute
                        ? selectedRoute.name
                        : optionsLoading
                        ? 'Loading routes...'
                        : 'Select Route'}
                    </Text>

                    {selectedRoute?.description ? (
                      <Text
                        style={
                          styles.selectedDescription
                        }
                      >
                        {selectedRoute.description}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <Text style={styles.dropdownArrow}>
                  {showRouteList ? '▲' : '▼'}
                </Text>
              </Pressable>

              {showRouteList && (
                <View style={styles.dropdownList}>
                  {routes.length === 0 ? (
                    <Text
                      style={styles.emptyOption}
                    >
                      No routes available
                    </Text>
                  ) : (
                    routes.map((route) => (
                      <Pressable
                        key={route.id}
                        style={
                          styles.dropdownOption
                        }
                        onPress={() => {
                          setSelectedRouteId(
                            route.id
                          );

                          setShowRouteList(false);
                        }}
                      >
                        <View
                          style={
                            styles.optionIcon
                          }
                        >
                          <Text>🛣️</Text>
                        </View>

                        <View
                          style={
                            styles.optionContent
                          }
                        >
                          <Text
                            style={
                              styles.dropdownOptionTitle
                            }
                          >
                            {route.name}
                          </Text>

                          <Text
                            style={
                              styles.dropdownOptionDescription
                            }
                          >
                            {route.description ||
                              'No description'}
                          </Text>
                        </View>

                        {selectedRouteId ===
                          route.id && (
                          <Text
                            style={
                              styles.selectedCheck
                            }
                          >
                            ✓
                          </Text>
                        )}
                      </Pressable>
                    ))
                  )}
                </View>
              )}
            </View>

            {/* Start Trip */}

            <Pressable
              style={[
                styles.startButton,
                startingTrip &&
                  styles.buttonDisabled,
              ]}
              onPress={startTrip}
              disabled={startingTrip}
            >
              {startingTrip ? (
                <ActivityIndicator
                  color="#ffffff"
                />
              ) : (
                <>
                  <Text style={styles.startButtonIcon}>
                    ▶
                  </Text>

                  <Text
                    style={styles.startButtonText}
                  >
                    Start Trip
                  </Text>
                </>
              )}
            </Pressable>
          </>
        )}
      </View>

      {/* Logout */}

      <Pressable
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutIcon}>
          ⇥
        </Text>

        <Text style={styles.logoutText}>
          Logout
        </Text>
      </Pressable>

      <Text style={styles.footerText}>
        SRIIT SmartBus • Your journey, our
        responsibility.
      </Text>
    </ScrollView>
  );
}