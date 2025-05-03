import React, { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { router } from "expo-router";
import * as Burnt from "burnt";
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Loading from "@/components/Loading";
import api, { retrieveData } from "@/utils/api";
import BackButton from "@/components/BackButton";

const BankTransafer = () => {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [bankDetails, setBankDetails] = useState(null);
    const [errors, setErrors] = useState({});
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      if (amount.length > 0 && (isNaN(amount) || parseFloat(amount) <= 0)) {
        setErrors({ ...errors, amount: "Amount must be a positive number." });
      } else {
        setErrors({ ...errors, amount: "" });
      }
      const isFormComplete = amount && !errors.amount;
      setIsFormValid(isFormComplete);
    }, [amount]);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const userResponse = await retrieveData('userResponse');
        if (userResponse) {
          setUserData(userResponse);
          setBankDetails(userResponse.bankDetails);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    const transferMoney = async () => {
      setLoading(true);
      try {
        const response = await api.post("api/auth/transfer", { amount });
  
        if (response.data.status === "success") {
          Burnt.toast({
            title: 'Success',
            message: response.data.message,
            preset: 'done',
          });
          router.replace('/(root)/(redeem)');
        }
      } catch (error) {
        console.error("Transfer failed:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>
        <View className='pt-14 web:pt-8 bg-primary-700 px-6 pb-6'>
          <BackButton navigateTo="/account"/>
        </View>
        <ScrollView className="h-full w-full">
          <View className="px-6 pt-6">
            <Text className='font-MonaExpandedBold text-3xl mb-10' numberOfLines={1}>Bank Transfer</Text>
            <View className="w-full flex-row items-center">
              <View className="flex-1">
  
                <FormField
                  title="Bank Account Number"
                  value={bankDetails?.accountNumber}
                  editable={false}
                  otherStyles="mb-7"
                />

                <FormField
                  title="Bank Name"
                  value={bankDetails?.bankName}
                  editable={false}
                  otherStyles="mb-7"
                />

                <FormField
                  title="Account Name"
                  value={bankDetails?.accountName}
                  editable={false}
                  otherStyles="mb-7"
                />
  
                <FormField
                  title="Amount"
                  placeholder="Enter Amount"
                  value={amount}
                  handleChangeText={(text) => setAmount(text)}
                  error={errors.amount}
                  otherStyles="mb-7"
                  keyboardType="numeric"
                  maxLength={11}
                />
  
                <View className="mt-4">
                  <CustomButton
                    title="Continue"
                    containerStyles="bg-primary"
                    textStyles="text-gray"
                    onPress={transferMoney}
                    disabled={!isFormValid || loading}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
  
        {loading && <Loading />}
      </>
    );
  };
  
  export default BankTransafer;