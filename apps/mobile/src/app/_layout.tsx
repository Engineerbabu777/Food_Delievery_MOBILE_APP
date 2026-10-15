import { ActivityIndicator, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { Stack } from 'expo-router';
import { UserRole } from '@food-delivery/types';


const queryClient = new QueryClient()


function RootNavigator(){
  const {user, isLoading} = useAuth()

  if(isLoading){
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#FF6B00" />
    </View>
  }

  console.log({user})

  return (
    <Stack screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="health" options={{headerShown: false}} />

      <Stack.Protected guard={!user}  >
        <Stack.Screen name="login" options={{headerShown:false}}/>
        <Stack.Screen name="register" options={{headerShown:false}}/>
      </Stack.Protected>

      <Stack.Protected guard={!!user && user.role === UserRole.CUSTOMER}>
        <Stack.Screen name="(customer)" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && user.role === UserRole.RESTURANT_OWNER}>
        <Stack.Screen name="(owner)" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && user.role === UserRole.DRIVER}>
        <Stack.Screen name="(driver)" />
      </Stack.Protected>

    </Stack>
  )



  
}
export default function TabLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <RootNavigator />
      </AuthProvider>

    </QueryClientProvider>
  );
}
