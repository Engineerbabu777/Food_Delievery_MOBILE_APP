import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  // Shared animated values
  const overlayOpacity = useSharedValue(1);
  const overlayScale = useSharedValue(1);

  const logoScale = useSharedValue(0.4);
  const logoOpacity = useSharedValue(0);

  const pulseRingScale = useSharedValue(1);
  const pulseRingOpacity = useSharedValue(0.6);

  const textTranslateY = useSharedValue(24);
  const textOpacity = useSharedValue(0);

  const badgesOpacity = useSharedValue(0);
  const badgesScale = useSharedValue(0.6);

  const dot1Scale = useSharedValue(0.8);
  const dot2Scale = useSharedValue(0.8);
  const dot3Scale = useSharedValue(0.8);

  useEffect(() => {
    // 1. Logo entrance bounce
    logoScale.value = withSpring(1, { damping: 9, stiffness: 90 });
    logoOpacity.value = withTiming(1, { duration: 500 });

    // 2. Pulse glow ring behind emblem
    pulseRingScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 900, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.in(Easing.ease) })
      ),
      -1,
      true
    );
    pulseRingOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 900 }),
        withTiming(0.6, { duration: 900 })
      ),
      -1,
      true
    );

    // 3. Floating mini badges entrance
    badgesOpacity.value = withDelay(350, withTiming(1, { duration: 500 }));
    badgesScale.value = withDelay(
      350,
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    // 4. Brand text entrance
    textTranslateY.value = withDelay(
      450,
      withSpring(0, { damping: 12, stiffness: 90 })
    );
    textOpacity.value = withDelay(450, withTiming(1, { duration: 500 }));

    // 5. Pulsing loading dots
    dot1Scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 350 }),
        withTiming(0.8, { duration: 350 })
      ),
      -1,
      true
    );
    dot2Scale.value = withDelay(
      180,
      withRepeat(
        withSequence(
          withTiming(1.4, { duration: 350 }),
          withTiming(0.8, { duration: 350 })
        ),
        -1,
        true
      )
    );
    dot3Scale.value = withDelay(
      360,
      withRepeat(
        withSequence(
          withTiming(1.4, { duration: 350 }),
          withTiming(0.8, { duration: 350 })
        ),
        -1,
        true
      )
    );

    // 6. Smooth exit after 2.3 seconds
    const exitTimer = setTimeout(() => {
      overlayScale.value = withTiming(1.05, { duration: 400 });
      overlayOpacity.value = withTiming(
        0,
        { duration: 400, easing: Easing.out(Easing.quad) },
        (finished) => {
          if (finished) {
            runOnJS(setVisible)(false);
          }
        }
      );
    }, 2300);

    return () => clearTimeout(exitTimer);
  }, []);

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: overlayScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const pulseRingStyle = useAnimatedStyle(() => ({
    opacity: pulseRingOpacity.value,
    transform: [{ scale: pulseRingScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const badgesStyle = useAnimatedStyle(() => ({
    opacity: badgesOpacity.value,
    transform: [{ scale: badgesScale.value }],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot1Scale.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot2Scale.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot3Scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, overlayStyle]}>
      <StatusBar style="light" />

      {/* Ambient background glow */}
      <View style={styles.ambientGlow} />

      {/* Main Food Delivery Emblem Center */}
      <View style={styles.centerContainer}>
        {/* Pulsing Outer Glow Ring */}
        <Animated.View style={[styles.pulseRing, pulseRingStyle]} />

        {/* Floating Mini Food Badges (Satellite items) */}
        <Animated.View style={[styles.badgesContainer, badgesStyle]}>
          <View style={[styles.satelliteBadge, styles.badgeTopLeft]}>
            <Ionicons name="pizza" size={20} color="#FF9F1C" />
          </View>
          <View style={[styles.satelliteBadge, styles.badgeTopRight]}>
            <Ionicons name="bicycle" size={20} color="#10B981" />
          </View>
          <View style={[styles.satelliteBadge, styles.badgeBottomLeft]}>
            <Ionicons name="flame" size={20} color="#EF4444" />
          </View>
          <View style={[styles.satelliteBadge, styles.badgeBottomRight]}>
            <Ionicons name="cafe" size={20} color="#3B82F6" />
          </View>
        </Animated.View>

        {/* Central Logo Box */}
        <Animated.View style={[styles.logoCard, logoStyle]}>
          <View style={styles.logoInner}>
            <Ionicons name="fast-food" size={54} color="#FFFFFF" />
            <View style={styles.flashBadge}>
              <Ionicons name="flash" size={13} color="#FFFFFF" />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Brand Title & Tagline */}
      <Animated.View style={[styles.textContainer, textStyle]}>
        <View style={styles.brandTitleRow}>
          <Text style={styles.brandTextWhite}>Food</Text>
          <Text style={styles.brandTextCoral}>Delivery</Text>
        </View>

        <Text style={styles.taglineText}>
          Hot & Fresh Meals • Delivered to Your Door
        </Text>

        <View style={styles.featurePill}>
          <Ionicons name="flash" size={11} color="#FF5E3A" />
          <Text style={styles.featurePillText}>FAST & FRESH DISPATCH</Text>
        </View>
      </Animated.View>

      {/* Bottom Loading Dots */}
      <View style={styles.bottomContainer}>
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.loadingDot, dot1Style]} />
          <Animated.View
            style={[styles.loadingDot, styles.dotMiddle, dot2Style]}
          />
          <Animated.View style={[styles.loadingDot, dot3Style]} />
        </View>
        <Text style={styles.loadingCaption}>Preparing your menu...</Text>
      </View>
    </Animated.View>
  );
}

// Fallback export if needed
export function AnimatedIcon() {
  return null;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  ambientGlow: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    borderRadius: (SCREEN_WIDTH * 0.9) / 2,
    backgroundColor: 'rgba(255, 94, 58, 0.08)',
  },
  centerContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255, 94, 58, 0.22)',
  },
  logoCard: {
    width: 104,
    height: 104,
    borderRadius: 28,
    backgroundColor: '#FF5E3A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5E3A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  logoInner: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  flashBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  satelliteBadge: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeTopLeft: {
    top: 14,
    left: 18,
  },
  badgeTopRight: {
    top: 14,
    right: 18,
  },
  badgeBottomLeft: {
    bottom: 14,
    left: 18,
  },
  badgeBottomRight: {
    bottom: 14,
    right: 18,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTextWhite: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandTextCoral: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FF5E3A',
    letterSpacing: -0.5,
    marginLeft: 3,
  },
  taglineText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 94, 58, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 94, 58, 0.28)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 16,
    gap: 6,
  },
  featurePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF5E3A',
    letterSpacing: 0.7,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5E3A',
  },
  dotMiddle: {
    marginHorizontal: 8,
    backgroundColor: '#FF886E',
  },
  loadingCaption: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: 0.2,
  },
});
