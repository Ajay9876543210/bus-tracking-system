import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { styles } from './gpsTracker.styles';

type GPSTrackerProps = {
  tripId: number;
};

const API_URL =
  'https://bus-tracking-backend-n00g.onrender.com';

export default function GPSTracker({
  tripId,
}: GPSTrackerProps) {
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  const [lastLocation, setLastLocation] =
    useState<Location.LocationObject | null>(null);

  const watcherRef =
    useRef<Location.LocationSubscription | null>(null);

  const startTracking = async () => {
    try {
      setLoading(true);

      const token =
        await SecureStore.getItemAsync('driver_token');

      if (!token) {
        Alert.alert(
          'Login Required',
          'Driver login session nahi mili.'
        );
        return;
      }

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (
        status !== Location.PermissionStatus.GRANTED
      ) {
        Alert.alert(
          'Location Permission',
          'GPS tracking ke liye location permission allow karein.'
        );
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      setLastLocation(currentLocation);

      watcherRef.current =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
          },

          async (location) => {
            setLastLocation(location);

            try {
              const {
                latitude,
                longitude,
                speed,
              } = location.coords;

              const speedKmh =
                speed && speed > 0
                  ? speed * 3.6
                  : 0;

              const response =
                await axios.post(
                  `${API_URL}/api/locations`,
                  {
                    trip_id: tripId,
                    latitude,
                    longitude,
                    speed: speedKmh,
                  },
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
                console.log(
                  'GPS location sent:',
                  latitude,
                  longitude,
                  speedKmh
                );
              }
            } catch (error: any) {
              console.log(
                'GPS send error:',
                error.response?.data ||
                  error.message
              );
            }
          }
        );

      setTracking(true);
    } catch (error: any) {
      console.log(
        'GPS start error:',
        error.message
      );

      Alert.alert(
        'GPS Error',
        'GPS tracking start nahi ho saki.'
      );
    } finally {
      setLoading(false);
    }
  };

  const stopTracking = () => {
    if (watcherRef.current) {
      watcherRef.current.remove();
      watcherRef.current = null;
    }

    setTracking(false);

    console.log(
      'GPS tracking stopped'
    );
  };

  useEffect(() => {
    return () => {
      if (watcherRef.current) {
        watcherRef.current.remove();
        watcherRef.current = null;
      }
    };
  }, []);

  const speedKmh =
    lastLocation?.coords.speed &&
    lastLocation.coords.speed > 0
      ? lastLocation.coords.speed * 3.6
      : 0;

  return (
    <View style={styles.container}>

      {/* GPS Header */}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            GPS Tracking
          </Text>

          <Text style={styles.subtitle}>
            Live bus location update
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            tracking
              ? styles.statusBadgeOn
              : styles.statusBadgeOff,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              tracking
                ? styles.statusDotOn
                : styles.statusDotOff,
            ]}
          />

          <Text
            style={[
              styles.statusBadgeText,
              tracking
                ? styles.statusBadgeTextOn
                : styles.statusBadgeTextOff,
            ]}
          >
            {tracking ? 'LIVE' : 'OFF'}
          </Text>
        </View>
      </View>

      {/* Main GPS Button */}

      <Pressable
        onPress={
          tracking
            ? stopTracking
            : startTracking
        }
        disabled={loading}
        style={({ pressed }) => [
          styles.gpsButton,
          tracking && styles.stopGpsButton,
          loading && styles.disabledButton,
          pressed && styles.buttonPressed,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color="#ffffff"
            size="small"
          />
        ) : (
          <>
            <Text style={styles.buttonIcon}>
              {tracking ? '■' : '▶'}
            </Text>

            <Text style={styles.buttonText}>
              {tracking
                ? 'Stop GPS Tracking'
                : 'Start GPS Tracking'}
            </Text>
          </>
        )}
      </Pressable>

      {/* Tracking Status */}

      <View
        style={[
          styles.trackingStatus,
          tracking
            ? styles.trackingStatusOn
            : styles.trackingStatusOff,
        ]}
      >
        <Text style={styles.trackingStatusIcon}>
          {tracking ? '🟢' : '⚪'}
        </Text>

        <View style={styles.trackingStatusContent}>
          <Text style={styles.trackingStatusTitle}>
            {tracking
              ? 'GPS Tracking Active'
              : 'GPS Tracking Inactive'}
          </Text>

          <Text style={styles.trackingStatusText}>
            {tracking
              ? 'Location har 5 seconds mein update ho rahi hai.'
              : 'Trip ke liye GPS tracking start karein.'}
          </Text>
        </View>
      </View>

      {/* Last Location */}

      {lastLocation ? (
        <View style={styles.locationCard}>

          <View style={styles.locationHeader}>
            <View>
              <Text style={styles.locationTitle}>
                Current Location
              </Text>

              <Text style={styles.locationSubtitle}>
                Latest GPS coordinates
              </Text>
            </View>

            <Text style={styles.locationIcon}>
              📍
            </Text>
          </View>

          <View style={styles.locationGrid}>

            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>
                LATITUDE
              </Text>

              <Text style={styles.locationValue}>
                {lastLocation.coords.latitude.toFixed(
                  6
                )}
              </Text>
            </View>

            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>
                LONGITUDE
              </Text>

              <Text style={styles.locationValue}>
                {lastLocation.coords.longitude.toFixed(
                  6
                )}
              </Text>
            </View>

          </View>

          <View style={styles.speedCard}>
            <Text style={styles.speedIcon}>
              🚗
            </Text>

            <View style={styles.speedContent}>
              <Text style={styles.speedLabel}>
                CURRENT SPEED
              </Text>

              <Text style={styles.speedValue}>
                {speedKmh.toFixed(1)}
                <Text style={styles.speedUnit}>
                  {' '}km/h
                </Text>
              </Text>
            </View>
          </View>

        </View>
      ) : (
        <View style={styles.noLocationCard}>
          <Text style={styles.noLocationIcon}>
            📍
          </Text>

          <Text style={styles.noLocationTitle}>
            No GPS Location Yet
          </Text>

          <Text style={styles.noLocationText}>
            GPS tracking start karne ke baad
            current location yahan dikhegi.
          </Text>
        </View>
      )}

    </View>
  );
}