import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = 'auth_token';

export const saveToken = async (token:string) =>{
    return SecureStore.setItemAsync(TOKEN_KEY,token);
} 

export const getToken = async () =>{
    return SecureStore.getItemAsync(TOKEN_KEY);
} 

export const removeToken = async () =>{
    return SecureStore.deleteItemAsync(TOKEN_KEY);
} 