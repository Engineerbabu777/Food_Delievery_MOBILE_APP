import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { openSettings } from 'expo-linking';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '@/lib/axios';
import { useImageUploader } from '@/lib/uploadthing';

interface FormErrors {
  name?: string;
  address?: string;
  cuisineType?: string;
}

const POPULAR_CUISINES = [
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Burgers', emoji: '🍔' },
  { label: 'Italian', emoji: '🍝' },
  { label: 'Fast Food', emoji: '🍗' },
  { label: 'Asian', emoji: '🥡' },
  { label: 'Mexican', emoji: '🌮' },
  { label: 'Japanese', emoji: '🍣' },
  { label: 'Healthy', emoji: '🥗' },
  { label: 'Cafe', emoji: '☕' },
  { label: 'Bakery', emoji: '🍰' },
  { label: 'Indian', emoji: '🍛' },
  { label: 'Sandwiches', emoji: '🥪' },
];

export default function CreateRestaurantScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Form interaction state
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // UploadThing image uploader hook
  const { openImagePicker, isUploading } = useImageUploader('restaurantImage', {
    onClientUploadComplete: (res) => {
      const uploadedUrl = res[0]?.ufsUrl ?? (res[0] as any)?.url;
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
        setServerError(null);
      }
    },
    onUploadError: (error) => {
      Alert.alert('Upload Error', error?.message || 'Could not upload image. Please try again.');
    },
  });

  // Create restaurant mutation
  const { mutate: createRestaurant, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        address: address.trim(),
        cuisineType: cuisineType.trim(),
        imageUrl: imageUrl || undefined,
      };

      const res = await api.post('/restaurants', payload);
      return res.data;
    },
    onSuccess: (restaurant) => {
      void queryClient.setQueryData(['my-restaurant'], restaurant);
      void queryClient.invalidateQueries({ queryKey: ['my-restaurant'] });
      Alert.alert(
        'Storefront Created! 🎉',
        'Your restaurant has been successfully registered. Welcome to your owner dashboard!',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => router.replace('/(owner)/(index)'),
          },
        ],
      );
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Failed to create restaurant. Please check your network and try again.';
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg);
      Alert.alert('Registration Failed', Array.isArray(msg) ? msg.join('\n') : msg);
    },
  });

  async function handlePickImage(source: 'library' | 'camera') {
    try {
      await openImagePicker({
        source,
        allowsEditing: true,
        quality: 0.85,
        onInsufficientPermissions: () => {
          Alert.alert(
            'Permissions Needed',
            `Please enable ${source === 'camera' ? 'camera' : 'photo library'} access in your device settings to upload photos.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => void openSettings() },
            ],
          );
        },
      });
    } catch (err: any) {
      if (err?.message && !err.message.toLowerCase().includes('cancel')) {
        Alert.alert('Image Selection Failed', err.message);
      }
    }
  }

  function showImageOptions() {
    Alert.alert('Restaurant Cover Photo', 'Choose an option to upload your storefront image:', [
      { text: 'Take Photo', onPress: () => void handlePickImage('camera') },
      { text: 'Choose from Library', onPress: () => void handlePickImage('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function handleSelectCuisineChip(cuisine: string) {
    setCuisineType((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return cuisine;
      // If already includes, don't duplicate
      const items = trimmed.split(',').map((s) => s.trim());
      if (items.includes(cuisine)) return prev;
      return `${trimmed}, ${cuisine}`;
    });
    if (errors.cuisineType) {
      setErrors((prev) => ({ ...prev, cuisineType: undefined }));
    }
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Restaurant name is required';
    }
    if (!address.trim()) {
      nextErrors.address = 'Street address is required';
    }
    if (!cuisineType.trim()) {
      nextErrors.cuisineType = 'At least one cuisine type is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    setServerError(null);
    if (!validate()) {
      Alert.alert('Missing Details', 'Please fill in all required fields indicated in red.');
      return;
    }
    createRestaurant();
  }

  const isFormBusy = isPending || isUploading;

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />

      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        {router.canGoBack() ? (
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.pressedState]}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={22} color="#1A1D24" />
          </Pressable>
        ) : (
          <View style={styles.topBarPlaceholder} />
        )}

        <View style={styles.topBadgePill}>
          <Ionicons name="shield-checkmark" size={13} color="#FF5E3A" />
          <Text style={styles.topBadgeText}>OWNER ONBOARDING</Text>
        </View>

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
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.brandIconWrapper}>
              <View style={styles.brandIconInner}>
                <Ionicons name="storefront" size={32} color="#FF5E3A" />
              </View>
              <View style={styles.badgePill}>
                <Ionicons name="sparkles" size={11} color="#fff" />
                <Text style={styles.badgeText}>STOREFRONT</Text>
              </View>
            </View>

            <Text style={styles.title}>Register Your Restaurant 🍽️</Text>
            <Text style={styles.subtitle}>
              Set up your kitchen profile to receive customer orders, create menus, and grow your brand.
            </Text>
          </View>

          {/* Server Error Banner if any */}
          {serverError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" style={styles.errorBannerIcon} />
              <Text style={styles.errorBannerText}>{serverError}</Text>
              <Pressable onPress={() => setServerError(null)} hitSlop={10}>
                <Ionicons name="close" size={18} color="#EF4444" />
              </Pressable>
            </View>
          )}

          {/* Storefront Image Upload Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="image-outline" size={20} color="#FF5E3A" />
              <View style={styles.sectionHeaderTextWrapper}>
                <Text style={styles.sectionTitle}>Cover Photo</Text>
                <Text style={styles.sectionSubtitle}>
                  Displayed as the main banner on customer feeds
                </Text>
              </View>
            </View>

            {imageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />

                {/* Floating Ready Badge */}
                <View style={styles.imageStatusBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  <Text style={styles.imageStatusText}>Photo Ready</Text>
                </View>

                {/* Action buttons over preview */}
                <View style={styles.imageActionsBar}>
                  <Pressable
                    style={styles.imageActionPill}
                    onPress={showImageOptions}
                    disabled={isFormBusy}
                  >
                    <Ionicons name="camera-reverse-outline" size={15} color="#1A1D24" />
                    <Text style={styles.imageActionText}>Change</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.imageActionPill, styles.imageDeletePill]}
                    onPress={() => setImageUrl(null)}
                    disabled={isFormBusy}
                  >
                    <Ionicons name="trash-outline" size={15} color="#EF4444" />
                    <Text style={[styles.imageActionText, styles.imageDeleteText]}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.imageUploadBox}>
                {isUploading ? (
                  <View style={styles.uploadingContainer}>
                    <ActivityIndicator size="large" color="#FF5E3A" />
                    <Text style={styles.uploadingTitle}>Uploading photo...</Text>
                    <Text style={styles.uploadingSubtitle}>
                      Connecting to storage, please hold on
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.uploadIconCircle}>
                      <Ionicons name="cloud-upload-outline" size={28} color="#FF5E3A" />
                    </View>
                    <Text style={styles.uploadPromptTitle}>Add Cover Image</Text>
                    <Text style={styles.uploadPromptSubtitle}>
                      High-resolution JPG or PNG (up to 8MB)
                    </Text>

                    <View style={styles.uploadButtonsRow}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.uploadSourceButton,
                          pressed && styles.pressedState,
                        ]}
                        onPress={() => void handlePickImage('library')}
                        disabled={isFormBusy}
                      >
                        <Ionicons name="images-outline" size={17} color="#FF5E3A" />
                        <Text style={styles.uploadSourceButtonText}>Photo Library</Text>
                      </Pressable>

                      <Pressable
                        style={({ pressed }) => [
                          styles.uploadSourceButton,
                          styles.uploadSourceButtonSecondary,
                          pressed && styles.pressedState,
                        ]}
                        onPress={() => void handlePickImage('camera')}
                        disabled={isFormBusy}
                      >
                        <Ionicons name="camera-outline" size={17} color="#555C6A" />
                        <Text style={styles.uploadSourceButtonTextSecondary}>Take Photo</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>

          {/* Form Fields Card */}
          <View style={styles.formCard}>
            {/* Restaurant Name */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Restaurant Name</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>

              <View
                style={[
                  styles.inputWrapper,
                  errors.name ? styles.inputWrapperError : null,
                ]}
              >
                <View pointerEvents="none" style={styles.inputLeftIcon}>
                  <Ionicons name="business-outline" size={20} color={errors.name ? '#EF4444' : '#FF5E3A'} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Napoli Woodfired Pizza"
                  placeholderTextColor="#9EA5B1"
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {name.length > 0 && (
                  <Pressable onPress={() => setName('')} hitSlop={10} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={18} color="#C4C8D0" />
                  </Pressable>
                )}
              </View>
              {errors.name && <Text style={styles.fieldErrorText}>{errors.name}</Text>}
            </View>

            {/* Cuisine Type */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Cuisine Category</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>

              <View
                style={[
                  styles.inputWrapper,
                  errors.cuisineType ? styles.inputWrapperError : null,
                ]}
              >
                <View pointerEvents="none" style={styles.inputLeftIcon}>
                  <Ionicons name="restaurant-outline" size={20} color={errors.cuisineType ? '#EF4444' : '#FF5E3A'} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Italian, Pizza, Pasta"
                  placeholderTextColor="#9EA5B1"
                  value={cuisineType}
                  onChangeText={(val) => {
                    setCuisineType(val);
                    if (errors.cuisineType) setErrors((prev) => ({ ...prev, cuisineType: undefined }));
                  }}
                  autoCapitalize="words"
                />
                {cuisineType.length > 0 && (
                  <Pressable onPress={() => setCuisineType('')} hitSlop={10} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={18} color="#C4C8D0" />
                  </Pressable>
                )}
              </View>
              {errors.cuisineType && <Text style={styles.fieldErrorText}>{errors.cuisineType}</Text>}

              {/* Quick Select Cuisine Chips */}
              <View style={styles.chipsContainer}>
                <Text style={styles.chipsHeader}>Quick Add Categories:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsScrollContent}
                >
                  {POPULAR_CUISINES.map((item) => {
                    const isSelected = cuisineType
                      .toLowerCase()
                      .includes(item.label.toLowerCase());

                    return (
                      <Pressable
                        key={item.label}
                        onPress={() => handleSelectCuisineChip(item.label)}
                        style={({ pressed }) => [
                          styles.chip,
                          isSelected && styles.chipActive,
                          pressed && styles.pressedState,
                        ]}
                      >
                        <Text style={styles.chipEmoji}>{item.emoji}</Text>
                        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                          {item.label}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name="checkmark"
                            size={13}
                            color="#FF5E3A"
                            style={styles.chipCheckIcon}
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* Address */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Street Address</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>

              <View
                style={[
                  styles.inputWrapper,
                  errors.address ? styles.inputWrapperError : null,
                ]}
              >
                <View pointerEvents="none" style={styles.inputLeftIcon}>
                  <Ionicons name="location-outline" size={20} color={errors.address ? '#EF4444' : '#FF5E3A'} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 742 Evergreen Terrace, Springfield"
                  placeholderTextColor="#9EA5B1"
                  value={address}
                  onChangeText={(val) => {
                    setAddress(val);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  autoCapitalize="sentences"
                />
                {address.length > 0 && (
                  <Pressable onPress={() => setAddress('')} hitSlop={10} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={18} color="#C4C8D0" />
                  </Pressable>
                )}
              </View>
              {errors.address && <Text style={styles.fieldErrorText}>{errors.address}</Text>}
              <Text style={styles.fieldHelperText}>
                Used to determine delivery areas and driver dispatch.
              </Text>
            </View>

            {/* Description (Optional) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>About Your Kitchen</Text>
                <Text style={styles.optionalBadge}>Optional</Text>
              </View>

              <View style={[styles.inputWrapper, styles.multilineWrapper]}>
                <View pointerEvents="none" style={[styles.inputLeftIcon, styles.multilineIcon]}>
                  <Ionicons name="document-text-outline" size={20} color="#FF5E3A" />
                </View>
                <TextInput
                  style={[styles.textInput, styles.multilineTextInput]}
                  placeholder="Tell foodies about your signature dishes, history, fresh ingredients, or chef specialties..."
                  placeholderTextColor="#9EA5B1"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
                  textAlignVertical="top"
                />
              </View>
              <View style={styles.charCounterRow}>
                <Text style={styles.charCounterText}>{description.length} / 300 characters</Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                isFormBusy && styles.primaryButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isFormBusy}
            >
              {isPending ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.buttonText}>Registering Storefront...</Text>
                </View>
              ) : isUploading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.buttonText}>Uploading Cover Image...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Launch Restaurant</Text>
                  <Ionicons name="arrow-forward" size={19} color="#fff" style={styles.buttonIcon} />
                </View>
              )}
            </Pressable>

            <View style={styles.secureNoticeRow}>
              <Ionicons name="lock-closed" size={13} color="#9EA5B1" />
              <Text style={styles.secureNoticeText}>
                Your business details are securely verified and stored
              </Text>
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
    backgroundColor: '#F8F9FB',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E9EE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topBarPlaceholder: {
    width: 40,
    height: 40,
  },
  topBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEFEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD7CC',
  },
  topBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF5E3A',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  brandIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  brandIconInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF1ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD7CC',
    shadowColor: '#FF5E3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },
  badgePill: {
    position: 'absolute',
    bottom: -8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5E3A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 3,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#1A1D24',
    letterSpacing: -0.4,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#707785',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  errorBannerIcon: {
    marginRight: 10,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '500',
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0ECE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionHeaderTextWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1D24',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#707785',
    marginTop: 2,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F3F5',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageStatusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  imageStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 4,
  },
  imageActionsBar: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  imageActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1D24',
    marginLeft: 5,
  },
  imageDeletePill: {
    backgroundColor: 'rgba(254, 242, 242, 0.96)',
  },
  imageDeleteText: {
    color: '#EF4444',
  },
  imageUploadBox: {
    borderWidth: 2,
    borderColor: '#FFDCD3',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#FFF9F6',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingContainer: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  uploadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1D24',
    marginTop: 12,
  },
  uploadingSubtitle: {
    fontSize: 13,
    color: '#707785',
    marginTop: 4,
  },
  uploadIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFEAE3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadPromptTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1D24',
  },
  uploadPromptSubtitle: {
    fontSize: 12,
    color: '#8E94A0',
    marginTop: 4,
    marginBottom: 16,
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  uploadSourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EB',
    borderWidth: 1.2,
    borderColor: '#FFC8BA',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  uploadSourceButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5E3A',
    marginLeft: 6,
  },
  uploadSourceButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6E9EE',
  },
  uploadSourceButtonTextSecondary: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 6,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
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
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C303B',
    letterSpacing: 0.1,
  },
  requiredStar: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 4,
  },
  optionalBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9EA5B1',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
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
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
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
  fieldErrorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 5,
    marginLeft: 2,
  },
  fieldHelperText: {
    fontSize: 12,
    color: '#707785',
    marginTop: 5,
    marginLeft: 2,
  },
  chipsContainer: {
    marginTop: 10,
  },
  chipsHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#707785',
    marginBottom: 8,
  },
  chipsScrollContent: {
    paddingVertical: 2,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#FFF0EB',
    borderColor: '#FFB8A5',
  },
  chipEmoji: {
    fontSize: 13,
    marginRight: 5,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#FF5E3A',
    fontWeight: '700',
  },
  chipCheckIcon: {
    marginLeft: 4,
  },
  multilineWrapper: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  multilineIcon: {
    marginTop: 2,
  },
  multilineTextInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  charCounterRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  charCounterText: {
    fontSize: 11,
    color: '#9EA5B1',
  },
  submitSection: {
    marginTop: 4,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#FF5E3A',
    borderRadius: 15,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5E3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonDisabled: {
    opacity: 0.65,
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
  secureNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  secureNoticeText: {
    fontSize: 12,
    color: '#8E94A0',
    marginLeft: 5,
  },
  pressedState: {
    opacity: 0.75,
  },
});