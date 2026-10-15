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
import { UserRole } from '@food-delivery/types';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RoleOption {
  label: string;
  subtitle: string;
  value: UserRole;
  icon: keyof typeof Ionicons.glyphMap;
}

const ROLES: RoleOption[] = [
  {
    label: 'Customer',
    subtitle: 'Order food',
    value: UserRole.CUSTOMER,
    icon: 'fast-food-outline',
  },
  {
    label: 'Restaurant',
    subtitle: 'Manage shop',
    value: UserRole.RESTURANT_OWNER,
    icon: 'restaurant-outline',
  },
  {
    label: 'Driver',
    subtitle: 'Deliver & earn',
    value: UserRole.DRIVER,
    icon: 'bicycle-outline',
  },
];

export default function RegisterScreen() {
  const { register } = useAuth();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordValid = password.length >= 6;

  async function handleRegister() {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail || !password) {
      return Alert.alert('Missing Fields', 'Please fill in all required fields.');
    }

    if (!agreeTerms) {
      return Alert.alert(
        'Terms of Service',
        'Please accept the Terms of Service and Privacy Policy to continue.'
      );
    }

    if (password.length < 6) {
      return Alert.alert(
        'Weak Password',
        'Password must be at least 6 characters long.'
      );
    }

    setIsLoading(true);
    try {
      await register({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
        password,
        role,
      });
      router.replace('/');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration could not be completed. Please try again.';
      Alert.alert('Registration Failed', message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSocialRegister(provider: 'Google' | 'Apple') {
    Alert.alert(
      `${provider} Sign-Up`,
      `Quick sign-up with ${provider} is coming soon. Please create an account with email for now.`,
      [{ text: 'OK' }]
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />

      {/* Top Navigation Bar with Back Button */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={20} color="#1A1D24" />
        </Pressable>
        <Text style={styles.topBarTitle}>Sign Up</Text>
        <View style={styles.topBarPlaceholder} />
      </View>

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
          {/* Header Title & Subtitle */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account 🚀</Text>
            <Text style={styles.subtitle}>
              Join the food revolution. Pick how you'll use the platform:
            </Text>
          </View>

          {/* Interactive Food Delivery Role Selector */}
          <View style={styles.roleSection}>
            <Text style={styles.sectionLabel}>Select Your Account Type</Text>
            <View style={styles.roleGrid}>
              {ROLES.map((r) => {
                const isSelected = role === r.value;
                return (
                  <Pressable
                    key={r.value}
                    style={({ pressed }) => [
                      styles.roleCard,
                      isSelected && styles.roleCardSelected,
                      pressed && styles.roleCardPressed,
                    ]}
                    onPress={() => setRole(r.value)}
                  >
                    <View
                      style={[
                        styles.roleIconCircle,
                        isSelected && styles.roleIconCircleSelected,
                      ]}
                    >
                      <Ionicons
                        name={r.icon}
                        size={22}
                        color={isSelected ? '#FF5E3A' : '#717886'}
                      />
                    </View>
                    <Text
                      style={[
                        styles.roleLabel,
                        isSelected && styles.roleLabelSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {r.label}
                    </Text>
                    <Text style={styles.roleSubtitle} numberOfLines={1}>
                      {r.subtitle}
                    </Text>

                    {isSelected ? (
                      <View style={styles.selectedCheckBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#FF5E3A" />
                      </View>
                    ) : (
                      <View style={styles.unselectedCheckCircle} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formContainer}>
            {/* Names Row (Two Columns) */}
            <View style={styles.nameRow}>
              <View style={[styles.inputGroup, styles.halfColumn]}>
                <Text style={styles.inputLabel}>First Name</Text>
                <View style={styles.inputWrapper}>
                  <View pointerEvents="none" style={styles.inputLeftIcon}>
                    <Ionicons name="person-outline" size={18} color="#FF5E3A" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="John"
                    placeholderTextColor="#9EA5B1"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfColumn]}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <View style={styles.inputWrapper}>
                  <View pointerEvents="none" style={styles.inputLeftIcon}>
                    <Ionicons name="person-outline" size={18} color="#FF5E3A" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Doe"
                    placeholderTextColor="#9EA5B1"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <View pointerEvents="none" style={styles.inputLeftIcon}>
                  <Ionicons name="mail-outline" size={19} color="#FF5E3A" />
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
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <View pointerEvents="none" style={styles.inputLeftIcon}>
                  <Ionicons name="lock-closed-outline" size={19} color="#FF5E3A" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a strong password"
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

              {/* Password Requirement Hint */}
              <View style={styles.passwordHintRow}>
                <Ionicons
                  name={isPasswordValid ? 'checkmark-circle' : 'ellipse-outline'}
                  size={14}
                  color={isPasswordValid ? '#10B981' : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.passwordHintText,
                    isPasswordValid && styles.passwordHintTextValid,
                  ]}
                >
                  Must be at least 6 characters
                </Text>
              </View>
            </View>

            {/* Terms & Privacy Agreement */}
            <Pressable
              style={styles.termsRow}
              onPress={() => setAgreeTerms((prev) => !prev)}
              hitSlop={8}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                {agreeTerms && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
                <Text style={styles.termsHighlight}>Privacy Policy</Text>
              </Text>
            </Pressable>

            {/* Register Button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                isLoading && styles.primaryButtonDisabled,
              ]}
              onPress={() => {
                void handleRegister();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.buttonText}>Creating Account...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" style={styles.buttonIcon} />
                </View>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or register with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialRow}>
              <Pressable
                style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
                onPress={() => handleSocialRegister('Google')}
              >
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
                onPress={() => handleSocialRegister('Apple')}
              >
                <Ionicons name="logo-apple" size={19} color="#000" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footerContainer}>
            <View style={styles.loginPromptRow}>
              <Text style={styles.loginPromptText}>Already have an account?</Text>
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <Text style={styles.loginLinkText}>Sign In</Text>
              </Pressable>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAECEF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonPressed: {
    backgroundColor: '#F3F4F6',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D24',
  },
  topBarPlaceholder: {
    width: 38,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1D24',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#707785',
    lineHeight: 20,
  },
  roleSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C303B',
    marginBottom: 10,
    letterSpacing: 0.1,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: '#E8ECF0',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  roleCardSelected: {
    borderColor: '#FF5E3A',
    backgroundColor: '#FFF8F5',
    shadowColor: '#FF5E3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  roleCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  roleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F4F6F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleIconCircleSelected: {
    backgroundColor: '#FFE9E2',
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C303B',
    marginBottom: 2,
    textAlign: 'center',
  },
  roleLabelSelected: {
    color: '#FF5E3A',
  },
  roleSubtitle: {
    fontSize: 10,
    color: '#8A92A0',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedCheckBadge: {
    marginTop: 'auto',
  },
  unselectedCheckCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#D4D8E0',
    marginTop: 'auto',
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfColumn: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C303B',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#E6E9EE',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
  },
  inputLeftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
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
  passwordHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    marginLeft: 2,
  },
  passwordHintText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  passwordHintTextValid: {
    color: '#10B981',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
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
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#656D7C',
    lineHeight: 18,
  },
  termsHighlight: {
    color: '#FF5E3A',
    fontWeight: '600',
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
    paddingVertical: 10,
  },
  loginPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loginPromptText: {
    fontSize: 14,
    color: '#656D7C',
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5E3A',
  },
});