import React, { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { router } from "expo-router";
import * as Burnt from "burnt";
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Loading from "@/components/Loading";
import CustomDropdown from "@/components/CustomDropdown";
import api, { retrieveData } from "@/utils/api";
import BackButton from "@/components/BackButton";

const Airtime = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ network: "", amount: "", service_id: "", phoneNumber: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [airtimeServices, setAirtimeServices] = useState([]);
  const [errors, setErrors] = useState({ network: "", amount: "", phoneNumber: "" });
  const [userData, setUserData] = useState(null);

  const validatePhoneNumber = (phoneNumber) => {
    const nigeriaPhoneRegex = /^(070|080|081|090|091)\d{8}$/;
    return nigeriaPhoneRegex.test(phoneNumber);
  };

  useEffect(() => {
    const newErrors = {};

    // Validate phone number
    if (form.phoneNumber.length > 0 && !validatePhoneNumber(form.phoneNumber)) {
      newErrors.phoneNumber = "Invalid Nigerian phone number.";
    }

    // Validate amount
    if (form.amount.length > 0 && (isNaN(form.amount) || parseFloat(form.amount) <= 0)) {
      newErrors.amount = "Amount must be a positive number.";
    }

    // Validate network type
    if (form.amount.length > 0 && form.phoneNumber.length > 0 && !form.network) {
      newErrors.network = "Please select a network type.";
    }

    setErrors(newErrors);

    // Check if the form is complete and valid
    const isFormComplete = form.network && form.amount && form.phoneNumber && !newErrors.phoneNumber && !newErrors.amount;
    setIsFormValid(isFormComplete);
  }, [form]);

  useEffect(() => {
    fetchData();
    getServices();
  }, []);

  const fetchData = async () => {
    try {
      const userResponse = await retrieveData('userResponse');
      if (userResponse) {
        setUserData(userResponse);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const getServices = async () => {
    setLoading(true);
    try {
      const response = await api.get("api/auth/services/");
      if (response.data.status === "success") {
        const formattedAirtimeServices = response.data.data.airtime.map((service) => ({
          id: service.code,
          title: service.provider,
          logo: service.logo,
        }));
        setAirtimeServices(formattedAirtimeServices); 
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelection = (selectedItem) => {
    if (selectedItem) {
      setForm((prevForm) => ({
        ...prevForm,
        network: selectedItem.title, 
        service_id: selectedItem.id, 
      }));
    }
  };

  const buyAirtime = async () => {
    setLoading(true);
    try {
      const payload = {
        service_id: form.service_id,
        service_type: form.network,
        phoneNumber: form.phoneNumber,
        amount: form.amount,
      };

      const response = await api.post("api/auth/airtime/", payload);

      if (response.data.status === "success") {
        Burnt.toast({
          title: 'Success',
          message: 'Airtime purchase successful!',
          preset: 'done',
        });
        router.replace('/(root)/(redeem)');
      }
    } catch (error) {
      // console.error("Error purchasing airtime:", error);
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
          <Text className='font-MonaExpandedBold text-3xl mb-10' numberOfLines={1}>Buy Airtime</Text>
          <View className="w-full flex-row items-center">
            <View className="flex-1">
              <View className="mb-7">
                <CustomDropdown
                  title={'Network Type'}
                  placeholder="Select Network Type"
                  dataSet={airtimeServices}
                  onSelectItem={handleServiceSelection}
                />
                {errors.network && <Text style={{ color: 'red' }}>{errors.network}</Text>}
              </View>

              <FormField
                title="Phone Number"
                placeholder="Enter Phone Number(080XXXXXXXX)"
                value={form.phoneNumber}
                handleChangeText={(text) => setForm((prevForm) => ({ ...prevForm, phoneNumber: text }))}
                error={errors.phoneNumber}
                otherStyles="mb-7"
                keyboardType="numeric"
                maxLength={11}
              />

              <FormField
                title="Amount"
                placeholder="Enter Airtime Amount"
                value={form.amount}
                handleChangeText={(text) => setForm((prevForm) => ({ ...prevForm, amount: text }))}
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
                  onPress={buyAirtime}
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

export default Airtime;