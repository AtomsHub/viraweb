import * as Burnt from 'burnt';
import { Link, router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paystack } from 'react-native-paystack-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { images } from '@/constants';
import Modal from 'react-native-modal';
import Loading from '@/components/Loading';
import FormField from '@/components/FormField';
import PackageCard from '@/components/PackageCard';
import CustomButton from '@/components/CustomButton';
import api, { handleLogout, retrieveData, storeData } from '@/utils/api';

const PAYSTACK_PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_KEY;

const Subscription = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [user, setUser] = useState(null); // State to store the user ID
  const [code, setCode] = useState('')
  const paystackWebViewRef = useRef(null);

  useEffect(() => {
    getPackages();
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    setIsModalLoading(true);
    try {
      const response = await api.post('/api/auth/apply-coupon', {
        packageId: selectedPackage._id,
        code,
        amountPaid: selectedPackage.price
      });
      if (response.data.status === 'success') {
        onPaymentSuccess();
      }
    } catch (error) {
    } finally {
      setIsModalLoading(false);
    }
  };

  const getPackages = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("api/packages/", { requiresToken: false });
      if (response.data.status === "success") {
        setPackages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("api/auth/profile/");
      if (response.data.status === "success") {
        const profileData = response.data.data;
        await storeData(profileData);

        
        // Force update userPackage in RootLayout by storing fresh data
        const freshData = await retrieveData('userResponse');
        if (freshData?.package) {
          if (Platform.OS === 'web') {
            window.location.href = '/';
            return;
          }
          // Navigate based on emptyField
          if (profileData.emptyField === "bankDetails") {
            router.replace('/(other)/bankDetails');
          } else {
            router.replace('(tabs)/');
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  

  
  const fetchUser = async () => {
    try {
      const userResponse = await retrieveData('userResponse');
      
      if (userResponse) {
        setUser(userResponse);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  
  const handlePackageSelection = (pkg) => {
    setSelectedPackage(pkg); 
  };

  const initializeWebPayment = () => {
    const script = document.createElement('script');
    script.src = "https://js.paystack.co/v2/inline.js";
    script.onload = () => {

      const generateRandomAlphabets = (length) => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return result;
      };

      const tx_ref = `${selectedPackage.name.split(' ')[0]}${Date.now()}${generateRandomAlphabets(3)}`;
      // console.log('tx_ref', tx_ref)
    
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: selectedPackage.price * 100, // Convert to kobo
        currency: 'NGN',
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
        ref: tx_ref,
        metadata: {user_id: user.id, package_id: selectedPackage._id }, 
        firstname: user.name?.split(' ')[0] || '',
        lastname: user.name?.split(' ')[1] || '',
        onClose: () => {
          onPaymentCancel(); // This will trigger your existing Burnt toast
        },
        callback: (response) => {
          onPaymentSuccess(response); // This will trigger your existing Burnt toast and getProfile()
        }
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
  };

  // Handle payment
  const handlePayment = () => {
    if (selectedPackage && user.id) {
      // console.log("Metadata:", { user_id: user.id, package_id: selectedPackage._id });

      if (Platform.OS === 'web') {
        // console.log('Im here');
        initializeWebPayment();
      } else {
        paystackWebViewRef.current?.startTransaction();
      }
    }
  };

  // Handle payment success
  const onPaymentSuccess = (paystackResponse) => {
    getProfile();
    Burnt.toast({
      title: 'Payment Successful',
      preset: 'done',
      from: 'top',
    });
    // console.log('done')
  };

  // Handle payment cancellation
  const onPaymentCancel = (paystackResponse) => {
    Burnt.toast({
      title: 'Payment Cancelled',
      preset: 'error',
      from: 'top',
    });
  };

  // List header component
  const ListHeaderComponent = () => (
    <View className='p-6 pt-10'>
        <View className='flex-row justify-end '>
          <TouchableOpacity onPress={handleLogout} className='p-2 mb-4'>
            <Text className='font-MonaRegular text-lg text-primary'>Logout</Text>
          </TouchableOpacity>
        </View>
        <View className="items-center">
          <Text className="text-center font-MonaExpandedExtraBold text-3xl">Get Premium</Text>
          <Text className="text-center font-MonaRegular text-md mt-1 w-11/12">
            Unlock all the power of this mobile tool and enjoy a digital experience like never before!
          </Text>
        </View>

      <View className="py-10 web:mx-auto">
        <Image source={images.subImg} className="w-full h-48" resizeMode="contain" />
      </View>
    </View>
  );

  // List footer component
  const ListFooterComponent = () => (
    <View className='p-6'>
      <View className='flex-row mt-6 gap-x-3'>
        <CustomButton
          title="Pay with Paystack"
          onPress={handlePayment}
          disabled={!selectedPackage}
          className={'flex-1'}
          
        />

        <CustomButton
          title="Pay with Coupon"
          onPress={() => setIsModalVisible(true)}
          bgVariant='secondary'
          className={'bg-black px-8'}
        />

      </View>

      <View className="items-center mt-3">
        <Text className="text-center font-MonaLight w-11/12">
          By placing this order, you agree to the Terms of Service and Privacy Policy. Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
        </Text>
      </View>
    </View>
  );

  // List empty component
  const ListEmptyComponent = () => (
    <View className="items-center justify-center p-6 pt-16">
      <Text className="text-md font-MonaRegular">No packages found, please refresh</Text>
    </View>
  );

  // Render package item
  const renderPackageItem = ({ item }) => (
    <View className='px-6'>
      <PackageCard
        name={item.name}
        description={item.description || "No description available"}
        price={item.price}
        isSelected={selectedPackage?._id === item._id}
        onPress={() => handlePackageSelection(item)}
      />

    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <FlatList
          data={packages}
          renderItem={renderPackageItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
        />
      </View>

      {selectedPackage && user.id && ( // Ensure userID and selectedPackage are available before rendering Paystack
        <Paystack
          paystackKey={PAYSTACK_PUBLIC_KEY}
          amount={selectedPackage.price.toFixed(2)}
          currency="NGN"
          channels={['card', 'bank', 'ussd', 'qr', 'mobile_money']}
          billingName={user.name}
          billingEmail={user.email}
          metadata={{ user_id: user.id, package_id: selectedPackage._id }} 
          activityIndicatorColor="green"
          onCancel={onPaymentCancel}
          onSuccess={onPaymentSuccess}
          ref={paystackWebViewRef}
        />
      )}
      

      <Modal isVisible={isModalVisible} className="z-10" onBackdropPress={() => setIsModalVisible(false)}>
        <View className="bg-white p-6 rounded-lg">
          <Text className="text-2xl font-MonaExpandedSemiBold mb-1">Apply Coupon</Text>
          <Text className="font-MonaLight text-md mb-6">
            Enter your coupon code to get a discount
          </Text>

          <FormField
            title="Coupon Code"
            placeholder="e.g. 123SAVE20"
            iconBrand={MaterialCommunityIcons}
            iconName="ticket-percent" // Coupon-like icon
            size={20}
            value={code}
            handleChangeText={(value) => setCode(value)}
            autoCapitalize="characters"
          />

          <CustomButton 
            title={isModalLoading ? "Loading..." : "Apply"}
            onPress={handleSubmit}
            disabled={(!selectedPackage && !code) || isModalLoading }
          />
        </View>
      </Modal>

      {isLoading && <Loading />}
      
    </SafeAreaView>
  );
};

export default Subscription;