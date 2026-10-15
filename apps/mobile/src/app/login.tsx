import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '@/context/auth-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      return Alert.alert('Missing Information', 'Please enter both email and password.');
    }

    setIsLoading(true);
    try {
      await login(trimmedEmail, password);
      router.replace('/');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Invalid email or password. Please try again.';
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleForgotPassword() {
    Alert.alert(
      'Reset Password',
      'Please enter your registered email to receive password reset instructions.',
      [{ text: 'OK' }]
    );
  }

  function handleSocialLogin(provider: 'Google' | 'Apple') {
    Alert.alert(
      `${provider} Sign-In`,
      `${provider} authentication will connect with your delivery account. Coming soon!`,
      [{ text: 'Got it' }]
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          {/* Header & Food Delivery Branding */}
          <View style={styles.headerContainer}>
            <View style={styles.brandIconWrapper}>
              <View style={styles.brandIconInner}>
                <Ionicons name="fast-food" size={34} color="#FF5E3A" />
              </View>
              <View style={styles.badgePill}>
                <Ionicons name="flash" size={10} color="#fff" />
                <Text style={styles.badgeText}>FAST DELIVERY</Text>
              </View>
            </View>

            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>
              Sign in to order hot, delicious meals delivered right to your door.
            </Text>
          </View>

          {/* Form Fields Card */}
          <View style={styles.formContainer}>
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <View pointerEvents="none" style={styles.inputLeftIcon}>
                  <Ionicons name="mail-outline" size={20} color="#FF5E3A" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor="#9EA5B1"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {email.length > 0 && (
                  <Pressable onPress={() => setEmail('')} hitSlop={10} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={18} color="#C4C8D0" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <Pressable onPress={handleForgotPassword} hitSlop={8}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </Pressable>
              </View>

              <View style={styles.inputWrapper}>
                <View pointerEvents="none" style={styles.inputLeftIcon}>
                  <Ionicons name="lock-closed-outline" size={20} color="#FF5E3A" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#9EA5B1"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={10}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#8E94A0"
                  />
                </Pressable>
              </View>
            </View>

            {/* Remember Me Option */}
            <Pressable
              style={styles.rememberRow}
              onPress={() => setRememberMe((prev) => !prev)}
              hitSlop={8}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
              <Text style={styles.rememberText}>Remember my login</Text>
            </Pressable>

            {/* Login Button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                isLoading && styles.primaryButtonDisabled,
              ]}
              onPress={() => {
                void handleLogin();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.buttonText}>Signing In...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" style={styles.buttonIcon} />
                </View>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialRow}>
              <Pressable
                style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
                onPress={() => handleSocialLogin('Google')}
              >
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
                onPress={() => handleSocialLogin('Apple')}
              >
                <Ionicons name="logo-apple" size={19} color="#000" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footerContainer}>
            <View style={styles.signupPromptRow}>
              <Text style={styles.signupPromptText}>Don't have an account?</Text>
              <Pressable onPress={() => router.push('/register')} hitSlop={8}>
                <Text style={styles.signupLinkText}>Create one</Text>
              </Pressable>
            </View>

            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark-outline" size={13} color="#949AA8" />
              <Text style={styles.securityBadgeText}>Encrypted & secure food delivery service</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FDFBF9',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandIconWrapper: {
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  brandIconInner: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: '#FFF0EA',
    borderWidth: 1.5,
    borderColor: '#FFE0D3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5E3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 3,
  },
  badgePill: {
    position: 'absolute',
    bottom: -8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FF5E3A',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1D24',
    letterSpacing: -0.3,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#707785',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0ECE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C303B',
    marginBottom: 7,
    letterSpacing: 0.1,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF5E3A',
    marginBottom: 7,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#E6E9EE',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1D24',
    height: '100%',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  eyeButton: {
    padding: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD0DA',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },
  checkboxActive: {
    backgroundColor: '#FF5E3A',
    borderColor: '#FF5E3A',
  },
  rememberText: {
    fontSize: 13,
    color: '#555C6A',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#FF5E3A',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5E3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ECEFF2',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F7F8F9',
    borderWidth: 1,
    borderColor: '#E6E9ED',
    gap: 8,
  },
  socialButtonPressed: {
    backgroundColor: '#EDEFF2',
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C303B',
  },
  footerContainer: {
    alignItems: 'center',
    gap: 14,
  },
  signupPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signupPromptText: {
    fontSize: 14,
    color: '#656D7C',
  },
  signupLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5E3A',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  securityBadgeText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});