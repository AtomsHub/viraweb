import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Burnt from "burnt";

// Base URL from environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to get the token from storage
const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

// Request interceptor to attach the Bearer token (only for requests that require it)
api.interceptors.request.use(
  async (config) => {
    // Check if the request should include the token
    if (config.requiresToken !== false) {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle specific HTTP error codes
      if (error.response.status === 401) {
        await handleLogout();
      } else {
        // console.log("Error:", error);
        await Burnt.toast({
          title: error.response.data?.message || "An error occurred. Please try again.",
          preset: "error",
          from: "top",
        });
      }
    } else {
      // Handle network errors or cases where there is no response
      await Burnt.toast({
        title: "Unable to connect to the server. Please check your internet connection.",
        preset: "error",
        from: "top",
      });
    }
    return Promise.reject(error);
  }
);

export default api;




export const handleLogout = async () => {
  try {
    await AsyncStorage.clear();
    await Burnt.toast({
      title: 'Logged out successfully.',
      preset: 'success',
      from: 'top',
    });
    router.replace('sign-in'); 
  } catch (error) {
    console.error('Error during logout:', error);
    await Burnt.toast({
      title: 'Failed to log out. Please try again.',
      preset: 'error',
      from: 'top',
    });
  }
};

export const storeData = async (data) => {
  try {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "object") {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } else {
        await AsyncStorage.setItem(key, value);
      }
    }
    // console.log('Data stored successfully!');
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // Try to parse the value as JSON
      try {
        return JSON.parse(value); 
      } catch (error) {
        return value;
      }
    }
    return null; 
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

export const checkToken = async () => {
    try {
      const token = await retrieveData('token');
      
      if (!token) {
        // await handleLogout();
        return false;
      }

      return true;

    } catch (error) {
      console.error('Token check failed:', error);
      // await handleLogout();
      return false;
    }
}