import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router } from 'expo-router';
import { retrieveData } from '@/utils/api';
import Loading from '@/components/Loading';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const [userPackage, setUserPackage] = useState(null);
  const [emptyField, setEmptyField] = useState(null);

  // Fetch user subscription data
  const fetchUserSubscription = async () => {
    try {
      const userResponse = await retrieveData('userResponse');
      const emptyField = await retrieveData('emptyField');
      setEmptyField(emptyField);
      if (userResponse && userResponse.package) {
        setUserPackage(userResponse.package); 
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    }
  };


  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setHasToken(true); 
      }
    } catch (error) {
      console.error('Error checking token:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUserSubscription();
    checkToken();
  }, []);


  if (loading) {
    return <Loading />;
  }

  // Redirect logic
  if (hasToken && userPackage && emptyField !== "bankDetails") {
    return router.replace("/(root)/(tabs)/")
  } else if (hasToken && !userPackage) {
    return router.replace("/subscription")
  } else if (hasToken && emptyField === "bankDetails") {
    return router.replace("/bankDetails")
  }

  // Redirect to welcome screen if the user has no token
  return router.replace("/welcome")
}