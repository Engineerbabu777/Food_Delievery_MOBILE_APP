# Fixing Expo CLI Simulator Detection on Xcode 27+ (DeviceHub)

This document provides a concise, step-by-step implementation guide to resolve the Expo CLI simulator error on Xcode 27 (`CommandError: Can't determine id of Simulator app`).

---

## 1. Problem Overview

In **Xcode 27**, Apple replaced `Simulator.app` with `DeviceHub.app` (`com.apple.dt.Devices`). Older `@expo/cli` versions (such as SDK 55) attempt to query and launch `Simulator.app`, which fails with:

```text
CommandError: Can't determine id of Simulator app; the Simulator is most likely not installed on this machine.
```

---

## 2. Step-by-Step Code Implementation

### Step 1: Initialize pnpm patch for `@expo/cli`
Extracts the installed `@expo/cli` into an editable patch directory.
```bash
pnpm patch @expo/cli
```

---

### Step 2: Patch `SimulatorAppPrerequisite.js`
Adds AppleScript and bundle Info.plist fallbacks for `DeviceHub` and registers `com.apple.dt.Devices` as a valid simulator ID.

**File:** `build/src/start/doctor/apple/SimulatorAppPrerequisite.js`

```javascript
// 1. Update AppleScript lookup to check DeviceHub when Simulator fails
async function getSimulatorAppIdViaAppleScriptAsync() {
    try {
        return (await (0, _osascript().execAsync)('id of app "Simulator"')).trim();
    } catch {}
    try {
        return (await (0, _osascript().execAsync)('id of app "DeviceHub"')).trim();
    } catch {}
    return null;
}

// 2. Update bundle fallback to check DeviceHub.app Info.plist inside Xcode
async function getSimulatorAppIdFromBundleAsync() {
    try {
        const { stdout: developerDir } = await (0, _spawnasync().default)('xcode-select', ['--print-path']);
        const simulatorInfoPlist = _path().default.join(developerDir.trim(), 'Applications', 'Simulator.app', 'Contents', 'Info.plist');
        try {
            const { stdout: bundleId } = await (0, _spawnasync().default)('defaults', ['read', simulatorInfoPlist, 'CFBundleIdentifier']);
            if (bundleId.trim()) return bundleId.trim();
        } catch {}

        const deviceHubInfoPlist = _path().default.join(developerDir.trim(), '..', 'Applications', 'DeviceHub.app', 'Contents', 'Info.plist');
        const { stdout: hubBundleId } = await (0, _spawnasync().default)('defaults', ['read', deviceHubInfoPlist, 'CFBundleIdentifier']);
        return hubBundleId.trim() || null;
    } catch {}
    return null;
}

// 3. Allow 'com.apple.dt.Devices' alongside standard simulator bundle IDs
if (result !== 'com.apple.dt.Devices' && result !== 'com.apple.iphonesimulator' && result !== 'com.apple.CoreSimulator.SimulatorTrampoline') {
    throw new _Prerequisite.PrerequisiteCommandError('SIMULATOR_APP', "Simulator is installed but is identified as '" + result + "'; don't know what that is.");
}
```

---

### Step 3: Patch `ensureSimulatorAppRunning.js`
Updates process counting and opening command to support `DeviceHub` when `Simulator.app` is not found.

**File:** `build/src/start/platforms/ios/ensureSimulatorAppRunning.js`

```javascript
// 1. Check if either Simulator or DeviceHub process is currently running
async function isSimulatorAppRunningAsync() {
    try {
        const zeroMeansNo = (await _osascript().execAsync('tell app "System Events" to count (processes whose name is "Simulator" or name is "DeviceHub")')).trim();
        if (zeroMeansNo === '0') return false;
    } catch (error) {
        if (error.message.includes('Application isn’t running')) return false;
        throw error;
    }
    return true;
}

// 2. Fallback to launching DeviceHub if open -a Simulator fails
async function openSimulatorAppAsync(device) {
    try {
        const args = ['-a', 'Simulator'];
        if (device.udid) {
            args.push('--args', '-CurrentDeviceUDID', device.udid);
        }
        await (0, _spawnasync().default)('open', args);
    } catch {
        await (0, _spawnasync().default)('open', ['-a', 'DeviceHub']).catch(() => {});
    }
}
```

---

### Step 4: Patch `AppleDeviceManager.js`
Activates `DeviceHub` window on macOS if `Simulator.app` is not active.

**File:** `build/src/start/platforms/ios/AppleDeviceManager.js`

```javascript
// Activate Simulator or DeviceHub window without throwing errors
async function activateWindowAsync() {
    await (0, _ensureSimulatorAppRunning.ensureSimulatorAppRunningAsync)(this.device);
    try {
        await _osascript().execAsync(`
            if application "Simulator" is running then
                tell application "Simulator" to activate
            else if application "DeviceHub" is running then
                tell application "DeviceHub" to activate
            end if
        `);
    } catch {}
}
```

---

### Step 5: Commit Patch and Save to Repository
Commits the patch to `patches/@expo__cli.patch` and adds `patchedDependencies` to `package.json`.
```bash
pnpm patch-commit '<path-to-pnpm_patches-folder>'
```

---

---

### Step 6: Verify the Patch
Runs Expo iOS build/simulator launcher to confirm DeviceHub is properly detected.
```bash
pnpm --filter mobile run ios
```

---

## 3. Fixing `IPHONEOS_DEPLOYMENT_TARGET` for Xcode 27+

### Root Cause
Xcode 27 strictly requires a deployment target between **15.0 and 27.0.x**. Older third-party pod libraries (e.g. `SDWebImage-SDWebImage`) default to iOS 9.0 in their podspecs, which triggers:

```text
❌ The iOS Simulator deployment target 'IPHONEOS_DEPLOYMENT_TARGET' is set to 9.0, but the range of supported deployment target versions is 15.0 to 27.0.x. (in target 'SDWebImage-SDWebImage' from project 'Pods')
```

### Solution
In `apps/mobile/ios/Podfile`, update the `post_install` hook to elevate all targets to at least iOS 15.1:

```ruby
  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      :ccache_enabled => ccache_enabled?(podfile_properties),
    )

    # Enforce minimum deployment target for Xcode 27+ across all pod targets
    deployment_target = podfile_properties['ios.deploymentTarget'] || '15.1'
    projects = installer.respond_to?(:generated_projects) ? installer.generated_projects : [installer.pods_project]
    projects.each do |project|
      project.targets.each do |target|
        target.build_configurations.each do |config|
          if config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < deployment_target.to_f
            config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = deployment_target
          end
        end
      end
    end
  end
```

Then re-run pod install:
```bash
cd apps/mobile/ios && pod install
```

