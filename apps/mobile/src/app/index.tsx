

import { useAuth } from "@/context/auth-context";
import { UserRole } from "@food-delivery/types";
import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function HomeScreen() {
    const {user, isLoading} = useAuth();

    if (isLoading) {
        return <ActivityIndicator />
    }

    if (!user) {
        return <Redirect href="/login" />
    }

    if(user.role === UserRole.CUSTOMER){
        return <Redirect href={"/(customer)" as any} />
    }

    if(user.role === UserRole.RESTURANT_OWNER){
        return <Redirect href={"/(owner)" as any} />
    }

    if(user.role === UserRole.DRIVER){
        return <Redirect href={"/(driver)" as any} />
    }

    return <Redirect href="/login" />
}