import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { router } from 'expo-router';

import { styles } from './index.styles';

const API_URL =
  'https://bus-tracking-backend-n00g.onrender.com';

export default function DriverLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        'Login Error',
        'Email and password are required'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/driver/login`,
        {
          email: email.trim(),
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (
        response.data?.success &&
        response.data?.data?.token &&
        response.data?.data?.user
      ) {
        const { token, user } = response.data.data;

        await SecureStore.setItemAsync(
          'driver_token',
          token
        );

        await SecureStore.setItemAsync(
          'driver_user',
          JSON.stringify(user)
        );

        Alert.alert(
          'Login Successful',
          `Welcome ${user.name}`
        );

        router.replace('/dashboard');
      } else {
        Alert.alert(
          'Login Failed',
          response.data?.message ||
            'Invalid login response'
        );
      }
    } catch (error: any) {
      console.error(
        'Driver login error:',
        error?.response?.data ||
          error?.message
      );

      const message =
        error?.response?.data?.message ||
        'Unable to connect to backend';

      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.content}>
        {/* Brand */}
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>
              🚌
            </Text>
          </View>

          <Text style={styles.brandName}>
            SRIIT SmartBus
          </Text>

          <Text style={styles.tagline}>
            Your journey, our responsibility.
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.title}>
            Driver Login
          </Text>

          <Text style={styles.subtitle}>
            Sign in to manage your trip
          </Text>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Driver Email
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>
                ✉
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>
                🔒
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword(!showPassword)
                }
                disabled={loading}
              >
                <Text style={styles.eyeIcon}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Login Button */}
          <Pressable
            style={[
              styles.loginButton,
              loading &&
                styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <>
                <Text style={styles.loginButtonText}>
                  Login
                </Text>

                <Text style={styles.loginArrow}>
                  →
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🛡️ Secure Driver Portal
          </Text>

          <Text style={styles.footerSubtext}>
            Authorized drivers only
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}