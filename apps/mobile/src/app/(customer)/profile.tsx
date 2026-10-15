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
import { router, Stack } from 'expo-router';

export default function CustomerProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);

  // User details & defaults
  const firstName = user?.firstName || 'Foodie';
  const lastName = user?.lastName || 'Customer';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const email = user?.email || 'customer@fooddelivery.app';

  function handleLogoutConfirmation() {
    Alert.alert(
      'Log Out of Your Account?',
      'Are you sure you want to sign out? You will need to log back in to track your deliveries and access saved addresses.',
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

  function handleFeatureInfo(title: string, message: string) {
    Alert.alert(title, message, [{ text: 'Got it' }]);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />

        {/* Top Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greetingText}>My Profile</Text>
            <Text style={styles.subGreetingText}>Manage your delivery preferences & orders</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Customer Support',
                  'Need help with an order or missing item? Our 24/7 Live Concierge is ready to help!'
                )
              }
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1E293B" />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Edit Account',
                  'You can update your name, profile photo, and phone number anytime.'
                )
              }
            >
              <Ionicons name="settings-outline" size={20} color="#1E293B" />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 44 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* User Profile Identity Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarRow}>
              {/* Avatar circle */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
                <View style={styles.avatarBadge}>
                  <Ionicons name="sparkles" size={13} color="#FFFFFF" />
                </View>
              </View>

              {/* User Info */}
              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.fullName} numberOfLines={1}>
                    {firstName} {lastName}
                  </Text>
                  <Ionicons name="shield-checkmark" size={17} color="#10B981" />
                </View>

                <Text style={styles.emailText} numberOfLines={1}>
                  {email}
                </Text>

                <View style={styles.tierBadgeRow}>
                  <View style={styles.tierPill}>
                    <Ionicons name="star" size={11} color="#FF5E3A" />
                    <Text style={styles.tierPillText}>FOODIE PLUS VIP</Text>
                  </View>

                  <View style={styles.memberStatusPill}>
                    <Text style={styles.memberStatusText}>Member since 2026</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Foodie Pass Banner */}
            <Pressable
              style={({ pressed }) => [styles.passBanner, pressed && styles.passBannerPressed]}
              onPress={() =>
                handleFeatureInfo(
                  'Foodie Pass Membership',
                  'Your VIP membership gives you $0 Delivery Fees on orders over $12 and 5% Food Cash back on all deliveries!\n\nYou have saved $48.20 this month.'
                )
              }
            >
              <View style={styles.passLeft}>
                <View style={styles.passIconBg}>
                  <Ionicons name="flash" size={18} color="#FF5E3A" />
                </View>
                <View style={styles.passTextCol}>
                  <View style={styles.passTitleRow}>
                    <Text style={styles.passTitle}>Foodie Pass Active</Text>
                    <View style={styles.passSavingsBadge}>
                      <Text style={styles.passSavingsText}>Saved $48.20</Text>
                    </View>
                  </View>
                  <Text style={styles.passSubtitle}>Free delivery on orders $12+ & priority couriers</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>
          </View>

          {/* Quick Stats / Wallet & Perks Bar */}
          <View style={styles.perksRow}>
            {/* Food Cash / Wallet */}
            <Pressable
              style={({ pressed }) => [styles.perkCard, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Food Cash Balance',
                  'Current available balance: $28.50.\n\nUse this balance at checkout for instant order discounts!'
                )
              }
            >
              <View style={[styles.perkIconBg, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="wallet-outline" size={18} color="#059669" />
              </View>
              <Text style={styles.perkValue}>$28.50</Text>
              <Text style={styles.perkLabel}>Food Cash</Text>
            </Pressable>

            {/* Vouchers */}
            <Pressable
              style={({ pressed }) => [styles.perkCard, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Available Coupons',
                  'You have 4 active promo vouchers:\n• 40% OFF Weekend Feasts\n• Free Dessert voucher\n• $5 OFF Pizza Night\n• Free Delivery on Burgers'
                )
              }
            >
              <View style={[styles.perkIconBg, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="ticket-outline" size={18} color="#EA580C" />
              </View>
              <Text style={styles.perkValue}>4 Promo</Text>
              <Text style={styles.perkLabel}>Vouchers</Text>
            </Pressable>

            {/* Reward Points */}
            <Pressable
              style={({ pressed }) => [styles.perkCard, pressed && styles.pressedState]}
              onPress={() =>
                handleFeatureInfo(
                  'Loyalty Points',
                  'You currently have 1,420 Foodie Points!\n\nJust 80 points until your next Free Gourmet Burger reward.'
                )
              }
            >
              <View style={[styles.perkIconBg, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="star-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.perkValue}>1,420</Text>
              <Text style={styles.perkLabel}>Points</Text>
            </Pressable>
          </View>

          {/* SECTION 1: FOOD & ORDERS */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ORDERS & FAVORITES</Text>
            <View style={styles.menuCard}>
              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() => router.push('/(customer)/orders')}
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="receipt-outline" size={20} color="#2563EB" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>My Orders & Receipts</Text>
                  <Text style={styles.menuItemSubtitle}>Track live orders, view history & reorder</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() =>
                  handleFeatureInfo(
                    'Favorite Restaurants',
                    'You have 14 bookmarked restaurants and 28 saved dishes ready for quick order!'
                  )
                }
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#FFF1F2' }]}>
                  <Ionicons name="heart-outline" size={20} color="#E11D48" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Favorite Spots & Dishes</Text>
                  <Text style={styles.menuItemSubtitle}>14 saved restaurants & cuisines</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() => router.push('/(customer)/cart')}
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#FFF7ED' }]}>
                  <Ionicons name="cart-outline" size={20} color="#EA580C" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>View Cart & Bag</Text>
                  <Text style={styles.menuItemSubtitle}>Check items ready for checkout</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() =>
                  handleFeatureInfo(
                    'Refer a Friend',
                    'Share your invite link with friends. They get $15 off their first meal, and you receive $15 in Food Cash after their delivery!'
                  )
                }
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#FDF2F8' }]}>
                  <Ionicons name="gift-outline" size={20} color="#DB2777" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Invite Friends, Get $15</Text>
                  <Text style={styles.menuItemSubtitle}>Give $15, get $15 for every friend</Text>
                </View>
                <View style={styles.bonusBadge}>
                  <Text style={styles.bonusBadgeText}>EARN $15</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>
            </View>
          </View>

          {/* SECTION 2: DELIVERY & PAYMENTS */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>DELIVERY & PAYMENT</Text>
            <View style={styles.menuCard}>
              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() =>
                  handleFeatureInfo(
                    'Saved Addresses',
                    'Your saved delivery destinations:\n• Home: 124 Grand Avenue, Apt 4B\n• Work: Tech Plaza Suite 800\n• Gym: Metro Fitness Club'
                  )
                }
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="location-outline" size={20} color="#D97706" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Delivery Addresses</Text>
                  <Text style={styles.menuItemSubtitle}>Home, Work, and 2 other saved spots</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() =>
                  handleFeatureInfo(
                    'Payment Methods',
                    'Saved payment options:\n• Apple Pay (Default)\n• Visa ending in 4242\n• Food Cash Balance ($28.50)'
                  )
                }
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="card-outline" size={20} color="#059669" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Payment Methods</Text>
                  <Text style={styles.menuItemSubtitle}>Apple Pay & Visa •••• 4242</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() =>
                  handleFeatureInfo(
                    'Dietary & Allergy Flags',
                    'Set your dining requirements so kitchens know your dietary needs automatically:\n• Vegetarian / Vegan\n• Halal\n• Gluten-free\n• Peanut / Nut allergy alerts'
                  )
                }
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#F0FDF4' }]}>
                  <Ionicons name="leaf-outline" size={20} color="#16A34A" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Dietary & Allergy Flags</Text>
                  <Text style={styles.menuItemSubtitle}>Allergies, Halal, Veg & preferences</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>
            </View>
          </View>

          {/* SECTION 3: APP PREFERENCES */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>NOTIFICATIONS & PREFERENCES</Text>
            <View style={styles.menuCard}>
              <View style={styles.menuItem}>
                <View style={[styles.menuIconBg, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="notifications-outline" size={20} color="#9333EA" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Live Delivery Tracking Alerts</Text>
                  <Text style={styles.menuItemSubtitle}>SMS & push alerts as driver approaches</Text>
                </View>
                <Switch
                  value={orderNotifications}
                  onValueChange={setOrderNotifications}
                  trackColor={{ false: '#CBD5E1', true: '#C084FC' }}
                  thumbColor={orderNotifications ? '#9333EA' : '#F1F5F9'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.menuItem}>
                <View style={[styles.menuIconBg, { backgroundColor: '#FFF7ED' }]}>
                  <Ionicons name="sparkles-outline" size={20} color="#EA580C" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Flash Offers & Discounts</Text>
                  <Text style={styles.menuItemSubtitle}>Weekly deals from favorite restaurants</Text>
                </View>
                <Switch
                  value={promoAlerts}
                  onValueChange={setPromoAlerts}
                  trackColor={{ false: '#CBD5E1', true: '#FFB29D' }}
                  thumbColor={promoAlerts ? '#FF5E3A' : '#F1F5F9'}
                />
              </View>
            </View>
          </View>

          {/* SECTION 4: HELP & SECURITY */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>HELP & PRIVACY</Text>
            <View style={styles.menuCard}>
              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() =>
                  handleFeatureInfo(
                    '24/7 Help Concierge',
                    'Order running late or missing an item? Tap below to chat instantly with our Customer Care team.'
                  )
                }
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="help-circle-outline" size={20} color="#2563EB" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Help Center & Live Chat</Text>
                  <Text style={styles.menuItemSubtitle}>Instant support for active deliveries</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() =>
                  handleFeatureInfo(
                    'Account Security',
                    'Manage your password, linked Google/Apple logins, and active sessions.'
                  )
                }
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#F1F5F9' }]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#475569" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Security & Credentials</Text>
                  <Text style={styles.menuItemSubtitle}>Password, Face ID & login history</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressedState]}
                onPress={() =>
                  handleFeatureInfo(
                    'Terms & Privacy',
                    'FoodDelivery customer privacy terms, rider tips policy, and user agreements.'
                  )
                }
              >
                <View style={[styles.menuIconBg, { backgroundColor: '#F8FAFC' }]}>
                  <Ionicons name="document-text-outline" size={20} color="#64748B" />
                </View>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuItemTitle}>Terms of Service & Privacy</Text>
                  <Text style={styles.menuItemSubtitle}>Legal agreements & community guidelines</Text>
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
                    <Text style={styles.logoutTitle}>Sign Out</Text>
                    <Text style={styles.logoutSubtitle}>
                      Logged in as {email}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#F87171" />
                </>
              )}
            </Pressable>
          </View>

          {/* Footer Branding */}
          <View style={styles.footerContainer}>
            <View style={styles.footerBadge}>
              <Ionicons name="heart" size={13} color="#EF4444" />
              <Text style={styles.footerBadgeText}>Crafted for Food Lovers Worldwide</Text>
            </View>
            <Text style={styles.footerVersion}>FoodDelivery App v2.4.0 • Consumer Edition</Text>
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
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subGreetingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
  /* Profile Identity Card */
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
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
        shadowOpacity: 0.28,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarInitials: {
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
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  emailText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 8,
  },
  tierBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  tierPill: {
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
  tierPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF5E3A',
    letterSpacing: 0.5,
  },
  memberStatusPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  memberStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  /* Foodie Pass Banner */
  passBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7F5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFD7CE',
  },
  passBannerPressed: {
    backgroundColor: '#FFEFEA',
  },
  passLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 12,
  },
  passIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE4DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passTextCol: {
    flex: 1,
  },
  passTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  passSavingsBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  passSavingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  passSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  /* Perks / Wallet Bar */
  perksRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  perkCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
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
  perkIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  perkValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  perkLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  /* Sections */
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
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
  menuTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '400',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
  },
  bonusBadge: {
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    marginRight: 6,
  },
  bonusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DB2777',
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
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 8,
  },
  footerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#991B1B',
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