import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useColorScheme,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { HealthCheck } from "@food-delivery/types";
import { BottomTabInset } from "@/constants/theme";

const CATEGORIES = [
  { id: "1", name: "Burgers", icon: "🍔" },
  { id: "2", name: "Pizza", icon: "🍕" },
  { id: "3", name: "Asian", icon: "🍜" },
  { id: "4", name: "Healthy", icon: "🥗" },
  { id: "5", name: "Dessert", icon: "🍰" },
  { id: "6", name: "Coffee", icon: "☕" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    data: health,
    isError,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<HealthCheck>({
    queryKey: ["health-check"],
    queryFn: async () => {
      const res = await api.get<HealthCheck>("/health");
      return res.data;
    },
  });

  const formattedTimestamp = health?.timestamp
    ? new Date(health.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  const dynamicStyles = {
    container: {
      backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
    },
    card: {
      backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
      borderColor: isDark ? "#334155" : "#E2E8F0",
    },
    textPrimary: {
      color: isDark ? "#F8FAFC" : "#0F172A",
    },
    textSecondary: {
      color: isDark ? "#94A3B8" : "#64748B",
    },
    chip: {
      backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
      borderColor: isDark ? "#334155" : "#E2E8F0",
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 16) + 8,
            paddingBottom: insets.bottom + BottomTabInset + 24,
          },
        ]}
      >
        {/* TOP BAR / LOCATION */}
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.locationLabel, dynamicStyles.textSecondary]}>
              DELIVER TO
            </Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={[styles.locationText, dynamicStyles.textPrimary]}>
                Current Location
              </Text>
              <Text style={[styles.dropdownArrow, dynamicStyles.textSecondary]}>
                ▾
              </Text>
            </View>
          </View>

          <View style={[styles.avatarBadge, dynamicStyles.card]}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
        </View>

        {/* HERO TITLE & BRAND */}
        <View style={styles.heroSection}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeDot}>●</Text>
            <Text style={styles.brandBadgeText}>FAST & FRESH</Text>
          </View>
          <Text style={[styles.title, dynamicStyles.textPrimary]}>
            Food Delivery
          </Text>
          <Text style={[styles.subtitle, dynamicStyles.textSecondary]}>
            Craving something delicious? Order from top restaurants near you.
          </Text>
        </View>

        {/* SEARCH BAR PREVIEW */}
        <View style={[styles.searchBar, dynamicStyles.card]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={[styles.searchPlaceholder, dynamicStyles.textSecondary]}>
            Search dishes, restaurants, groceries...
          </Text>
        </View>

        {/* FOOD CATEGORIES SCROLLER */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, dynamicStyles.textPrimary]}>
            Categories
          </Text>
          <Text style={styles.seeAllText}>See all</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              style={[styles.categoryPill, dynamicStyles.chip]}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[styles.categoryName, dynamicStyles.textPrimary]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PROMO BANNER */}
        <View style={styles.promoCard}>
          <View style={styles.promoTextContainer}>
            <View style={styles.promoTag}>
              <Text style={styles.promoTagText}>SPECIAL OFFER</Text>
            </View>
            <Text style={styles.promoTitle}>30% OFF Your First Order</Text>
            <Text style={styles.promoSubtitle}>Use code: FEAST30 at checkout</Text>
          </View>
          <Text style={styles.promoEmoji}>🍕</Text>
        </View>

        {/* SERVER HEALTH MONITOR CARD */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, dynamicStyles.textPrimary]}>
            API & Server Status
          </Text>
          {isFetching && (
            <ActivityIndicator size="small" color="#FF6B00" />
          )}
        </View>

        <View style={[styles.healthCard, dynamicStyles.card]}>
          <View style={styles.healthHeader}>
            <View style={styles.healthTitleRow}>
              <View
                style={[
                  styles.statusIndicatorDot,
                  isLoading
                    ? styles.dotPending
                    : isError
                    ? styles.dotError
                    : styles.dotSuccess,
                ]}
              />
              <Text style={[styles.healthCardTitle, dynamicStyles.textPrimary]}>
                NestJS Backend
              </Text>
            </View>

            <View
              style={[
                styles.badgePill,
                isLoading
                  ? styles.badgePending
                  : isError
                  ? styles.badgeError
                  : styles.badgeSuccess,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isLoading
                    ? styles.badgeTextPending
                    : isError
                    ? styles.badgeTextError
                    : styles.badgeTextSuccess,
                ]}
              >
                {isLoading ? "CONNECTING" : isError ? "OFFLINE" : "HEALTHY"}
              </Text>
            </View>
          </View>

          <View style={styles.healthDivider} />

          {/* LOADER SPINNER WHILE LOADING */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B00" />
              <Text
                style={[styles.loadingText, dynamicStyles.textSecondary]}
              >
                Connecting to server...
              </Text>
            </View>
          ) : isError ? (
            /* ERROR STATE */
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Connection Failed</Text>
              <Text style={styles.errorMessage}>
                {error?.message || "Unable to reach the server"}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                activeOpacity={0.8}
                onPress={() => refetch()}
              >
                <Text style={styles.retryButtonText}>Retry Connection</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* HEALTH DATA CONTENT */
            <View style={styles.healthContent}>
              <View style={styles.healthRow}>
                <Text
                  style={[styles.healthLabel, dynamicStyles.textSecondary]}
                >
                  Status Code
                </Text>
                <View style={styles.valueRow}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text
                    style={[
                      styles.healthValueHighlight,
                      { color: "#10B981" },
                    ]}
                  >
                    {health?.status?.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.healthRow}>
                <Text
                  style={[styles.healthLabel, dynamicStyles.textSecondary]}
                >
                  Endpoint
                </Text>
                <Text
                  style={[styles.healthCodeText, dynamicStyles.textPrimary]}
                >
                  /api/health
                </Text>
              </View>

              <View style={styles.healthRow}>
                <Text
                  style={[styles.healthLabel, dynamicStyles.textSecondary]}
                >
                  Last Checked
                </Text>
                <Text
                  style={[styles.healthValue, dynamicStyles.textPrimary]}
                >
                  {formattedTimestamp || "Just now"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.refreshButton}
                activeOpacity={0.8}
                onPress={() => refetch()}
              >
                <Text style={styles.refreshButtonText}>
                  {isFetching ? "Checking..." : "🔄 Ping Server"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationPin: {
    fontSize: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "700",
  },
  dropdownArrow: {
    fontSize: 14,
    marginLeft: 4,
  },
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: 20,
  },
  heroSection: {
    marginBottom: 20,
  },
  brandBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFEDE6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  brandBadgeDot: {
    color: "#FF6B00",
    fontSize: 8,
    marginRight: 6,
  },
  brandBadgeText: {
    color: "#FF6B00",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FF6B00",
  },
  categoriesContainer: {
    paddingVertical: 4,
    paddingRight: 12,
    gap: 12,
    marginBottom: 24,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
  },
  promoCard: {
    backgroundColor: "#FF6B00",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    ...Platform.select({
      ios: {
        shadowColor: "#FF6B00",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  promoTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 4,
  },
  promoSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
  },
  promoEmoji: {
    fontSize: 48,
    marginLeft: 12,
  },
  healthCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  healthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  healthTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dotSuccess: {
    backgroundColor: "#10B981",
  },
  dotPending: {
    backgroundColor: "#F59E0B",
  },
  dotError: {
    backgroundColor: "#EF4444",
  },
  healthCardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSuccess: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  badgePending: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
  badgeError: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  badgeTextSuccess: {
    color: "#10B981",
  },
  badgeTextPending: {
    color: "#F59E0B",
  },
  badgeTextError: {
    color: "#EF4444",
  },
  healthDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
    opacity: 0.6,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  retryButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  healthContent: {
    gap: 12,
  },
  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  healthLabel: {
    fontSize: 14,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  checkIcon: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "800",
  },
  healthValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  healthValueHighlight: {
    fontSize: 14,
    fontWeight: "800",
  },
  healthCodeText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  refreshButton: {
    marginTop: 8,
    backgroundColor: "#FF6B00",
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});