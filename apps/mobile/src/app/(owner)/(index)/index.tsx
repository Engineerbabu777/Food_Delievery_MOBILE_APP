import { api } from "@/lib/axios"
import { RestaurantType } from "@food-delivery/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, RefreshControl, SafeAreaView, View } from "react-native";



export default function OwnerHomeScreen(){
    const queryClient = useQueryClient()

    const {data: restaurant, isPending: isLoading, isError: isError} = useQuery<RestaurantType | null>({
        queryKey:['my-restaurant'],
        queryFn: async()=>{
            return await api.get<RestaurantType | null>("restaurants/mine").then((res) => res.data)
    }
    });

   const {mutate: toggle, isPending:isPendingToggle} = useMutation({
    mutationFn:async() => await api.patch(`restaurants/${restaurant?.id}`, {isOpen: !restaurant?.isOpen}),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["my-restaurant"]
        })
    }
   })

  useEffect(() => {
    if (isLoading) return;
    if (!restaurant) {
      router.replace('/(owner)/(index)/create-restaurant');
    }
  }, [restaurant, isLoading]);

    if (isLoading) {
    return (
      <View style={{}}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }
  
    return<>
    </>
  
}