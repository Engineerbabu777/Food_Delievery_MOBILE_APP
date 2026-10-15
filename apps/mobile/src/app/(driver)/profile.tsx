import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth-context';
import { Stack } from 'expo-router';

export default function CustomerProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [loudAlertsEnabled, setLoudAlertsEnabled] = useState(true);

  const firstName = user?.firstName || 'Restaurant';
  const lastName = user?.lastName || 'Owner';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const email = user?.email || 'owner@restaurant.com';
  const role = user?.role || 'RESTAURANT';
  const formattedRole = role.replace(/_/g, ' ');

  function handleLogoutConfirmation() {
    Alert.alert(
      'Log Out of Merchant Account?',
      'Are you sure you want to log out? You will stop receiving sound alerts for new incoming orders on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
            } catch (error: any) {
              Alert.alert(
                'Logout Failed',
                error?.message || 'Could not complete logout. Please try again.'
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  }

  function handleFeatureInfo(featureName: string, detail: string) {
    Alert.alert(featureName, detail, [{ text: 'Done' }]);
  }

  function handleCopyAccountId() {
    Alert.alert('Merchant Account ID', `Account ID: ${user?.id || 'REST-884920'}\n\nID copied for support and reference.`, [
      { text: 'OK' },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />

        {/* Screen Header */}
        <View style={styles.topHeader}>
        <View>
          <Text style={styles.topHeaderTitle}>Merchant Profile</Text>
          <Text style={styles.topHeaderSubtitle}>Restaurant Management Console</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressedState]}
          onPress={() =>
            handleFeatureInfo(
              'Partner Help Center',
              'Need immediate support? Call Merchant Hotline (24/7) or start a live chat with our partner response team.'
            )
          }
        >
          <Ionicons name="help-circle-outline" size={22} color="#1E293B" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarRow}>
            {/* Avatar with Initials & Chef/Store Badge */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.avatarBadge}>
                <Ionicons name="restaurant" size={14} color="#FFFFFF" />
              </View>
            </View>

            {/* Basic Info */}
            <View style={styles.userInfoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  {firstName} {lastName}
                </Text>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              </View>

              <Text style={styles.userEmail} numberOfLines={1}>
                {email}
              </Text>

              {/* Role & Verification Badge */}
              <View style={styles.badgeRow}>
                <View style={styles.rolePill}>
                  <Ionicons name="shield-checkmark" size={12} color="#FF5E3A" />
                  <Text style={styles.rolePillText}>{formattedRole}</Text>
                </View>

                <View style={styles.statusPill}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isStoreOpen ? '#10B981' : '#EF4444' },
                    ]}
                  />
                  <Text style={styles.statusPillText}>
                    {isStoreOpen ? 'Accepting Orders' : 'Store Paused'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Store Live Operations Switcher Bar */}
          <View style={styles.storeStatusBanner}>
            <View style={styles.storeStatusInfo}>
              <Ionicons
                name={isStoreOpen ? 'radio-button-on' : 'pause-circle'}
                size={20}
                color={isStoreOpen ? '#10B981' : '#94A3B8'}
              />
              <View style={styles.storeStatusTextWrapper}>
                <Text style={styles.storeStatusTitle}>
                  {isStoreOpen ? 'Kitchen is Open' : 'Kitchen is Paused'}
                </Text>
                <Text style={styles.storeStatusSubtitle}>
                  {isStoreOpen
                    ? 'Customers can place delivery & pickup orders'
                    : 'No new customer orders will be accepted'}
                </Text>
              </View>
            </View>
            <Switch
              value={isStoreOpen}
              onValueChange={(val) => {
                setIsStoreOpen(val);
                Alert.alert(
                  val ? 'Store Opened' : 'Store Paused',
                  val
                    ? 'Your kitchen is now online and available for customer orders.'
                    : 'Your kitchen is paused. Pending accepted orders can still be completed.'
                );
              }}
              trackColor={{ false: '#CBD5E1', true: '#FF886E' }}
              thumbColor={isStoreOpen ? '#FF5E3A' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* Business Metrics Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="star" size={16} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>4.92</Text>
            <Text style={styles.statLabel}>Partner Rating</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="time" size={16} color="#10B981" />
            </View>
            <Text style={styles.statValue}>18 min</Text>
            <Text style={styles.statLabel}>Avg Prep Time</Text>
          </View>

          <View style={styles.statBox}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="bicycle" size={16} color="#F97316" />
            </View>
            <Text style={styles.statValue}>98.5%</Text>
            <Text style={styles.statLabel}>Fulfillment</Text>
          </View>
        </View>

        {/* SECTION 1: Kitchen & Restaurant Management */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>STORE & OPERATIONS</Text>
          <View style={styles.menuGroup}>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Store Details',
                  'Manage restaurant brand name, banner pictures, street address, and cuisine categories.'
                )
              }
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="storefront-outline" size={20} color="#DC2626" />
              </View>
              <View style={styles.menuTextWrapper}>
                <Text style={styles.menuTitle}>Store Details & Profile</Text>
                <Text style={styles.menuSubtitle}>Name, cuisine, banner & location</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.separator} />

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Operating Schedule',
                  'Set regular opening and closing hours, lunch pauses, and holiday schedules.'
                )
              }
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="time-outline" size={20} color="#D97706" />
              </View>
              <View style={styles.menuTextWrapper}>
                <Text style={styles.menuTitle}>Operating Hours</Text>
                <Text style={styles.menuSubtitle}>Daily 10:00 AM – 11:30 PM</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.separator} />

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Delivery Configuration',
                  'Configure maximum delivery radius (default 8 km), prep buffer, and packaging fees.'
                )
              }
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#E0E7FF' }]}>
                <Ionicons name="bicycle-outline" size={20} color="#4F46E5" />
              </View>
              <View style={styles.menuTextWrapper}>
                <Text style={styles.menuTitle}>Delivery & Radius</Text>
                <Text style={styles.menuSubtitle}>8.0 km radius • Direct courier dispatch</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.separator} />

            {/* Toggle Row for Order Chime */}
            <View style={styles.menuItem}>
              <View style={[styles.menuIconBg, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="notifications-outline" size={20} color="#9333EA" />
              </View>
              <View style={styles.menuTextWrapper}>
                <Text style={styles.menuTitle}>High-Volume Order Alerts</Text>
                <Text style={styles.menuSubtitle}>Loud continuous sound on new orders</Text>
              </View>
              <Switch
                value={loudAlertsEnabled}
                onValueChange={setLoudAlertsEnabled}
                trackColor={{ false: '#CBD5E1', true: '#C084FC' }}
                thumbColor={loudAlertsEnabled ? '#9333EA' : '#F1F5F9'}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: Financials & Payouts */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>FINANCIALS & PAYOUTS</Text>
          <View style={styles.menuGroup}>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Payout Accounts',
                  'Automated weekly deposits configured to direct deposit bank ending in •••• 4912.'
                )
              }
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="card-outline" size={20} color="#059669" />
              </View>
              <View style={styles.menuTextWrapper}>
                <Text style={styles.menuTitle}>Bank & Payout Details</Text>
                <Text style={styles.menuSubtitle}>Weekly deposit • Chase Bank •••• 4912</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.separator} />

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Invoices & Statements',
                  'Download weekly sales breakdowns, commission deductions, and tax invoices.'
                )
              }
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="document-text-outline" size={20} color="#475569" />
              </View>
              <View style={styles.menuTextWrapper}>
                <Text style={styles.menuTitle}>Tax Invoices & Reports</Text>
                <Text style={styles.menuSubtitle}>Monthly VAT & statement archives</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>
          </View>
        </View>

        {/* SECTION 3: Security & Support */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>SECURITY & PREFERENCES</Text>
          <View style={styles.menuGroup}>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
              onPress={handleCopyAccountId}
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="copy-outline" size={20} color="#2563EB" />
              </View>
              <View style={styles.menuTextWrapper}>
                <Text style={styles.menuTitle}>Merchant Partner ID</Text>
                <Text style={styles.menuSubtitle}>{user?.id || 'REST-884920'} (Tap to copy)</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.separator} />

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Partner Security',
                  'Two-factor authentication and device management are active for this account.'
                )
              }
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#F3F4F6' }]}>
                <Ionicons name="lock-closed-outline" size={20} color="#374151" />
              </View>
              <View style={styles.menuTextWrapper}>
                <Text style={styles.menuTitle}>Account Security & Password</Text>
                <Text style={styles.menuSubtitle}>2FA enabled • Last updated recently</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>

            <View style={styles.separator} />

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Merchant Priority Support',
                  'Call Partner Helpline at +1 (800) 555-FOOD or email partners@fooddelivery.app.'
                )
              }
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="headset-outline" size={20} color="#B45309" />
              </View>
              <View style={styles.menuTextWrapper}>
                <Text style={styles.menuTitle}>24/7 Priority Helpline</Text>
                <Text style={styles.menuSubtitle}>Instant assistance for active orders</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <View style={styles.logoutContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutCard,
              pressed && styles.logoutCardPressed,
              isLoggingOut && styles.disabledButton,
            ]}
            onPress={handleLogoutConfirmation}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#EF4444" size="small" />
            ) : (
              <>
                <View style={styles.logoutIconWrapper}>
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                </View>
                <View style={styles.logoutTextWrapper}>
                  <Text style={styles.logoutTitle}>Sign Out of Restaurant Account</Text>
                  <Text style={styles.logoutSubtitle}>
                    Logged in as {email}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#F87171" />
              </>
            )}
          </Pressable>
        </View>

        {/* Footer Brand Info */}
        <View style={styles.footerContainer}>
          <View style={styles.footerBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#10B981" />
            <Text style={styles.footerBadgeText}>Secure Food Delivery Merchant Network</Text>
          </View>
          <Text style={styles.footerVersion}>Partner App v2.4.0 • Enterprise Edition</Text>
        </View>
      </ScrollView>
    </View>
    </>
  
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  topHeaderSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  /* Hero Card */
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 14,
      },
      android: {
        elevation: 3,
      },
    }),
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FF5E3A',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF5E3A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0DA',
    gap: 4,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF5E3A',
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#334155',
  },
  /* Store Status Switch Banner */
  storeStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  storeStatusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 10,
  },
  storeStatusTextWrapper: {
    flex: 1,
  },
  storeStatusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  storeStatusSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  /* Stat KPIs */
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  statIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  /* Section Layout */
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextWrapper: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
  },
  /* Logout */
  logoutContainer: {
    marginTop: 6,
    marginBottom: 20,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logoutCardPressed: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  logoutIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  logoutTextWrapper: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  logoutSubtitle: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 2,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
  /* Footer */
  footerContainer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    marginBottom: 8,
  },
  footerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  footerVersion: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  pressedState: {
    backgroundColor: '#F8FAFC',
  },
});