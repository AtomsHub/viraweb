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

const Data = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ network: "", amount: "", code: "", phoneNumber: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [dataServices, setDataServices] = useState([]);
  const [errors, setErrors] = useState({ network: "", amount: "", phoneNumber: "", code: "" });
  const [userData, setUserData] = useState(null);
  const [dataPackage, setDataPackage] = useState([]);

  const validatePhoneNumber = (phoneNumber) => {
    const nigeriaPhoneRegex = /^(070|080|081|090|091)\d{8}$/;
    return nigeriaPhoneRegex.test(phoneNumber);
  };

  // Validate form fields
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
    if (!form.network) {
      newErrors.network = "Please select a network type.";
    }

    // Validate data package
    if (!form.code) {
      newErrors.code = "Please select a data package.";
    }

    setErrors(newErrors);

    // Check if the form is complete and valid
    const isFormComplete = form.network && form.amount && form.phoneNumber && form.code && !newErrors.phoneNumber && !newErrors.amount;
    setIsFormValid(isFormComplete);
  }, [form]);

  // Fetch user data and services on component mount
  useEffect(() => {
    fetchData();
    getServices();
  }, []);

  // Fetch data packages when network type changes
  useEffect(() => {
    if (form.network) {
        setForm((prevForm) => ({...prevForm, code: '', amount: '', phoneNumber: ''}));
        setDataPackage([])
        getDataPackage();
    }
  }, [form.network]);

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
        const formattedDataServices = response.data.data.data.map((service) => ({
          id: service.code,
          title: service.provider,
          logo: service.logo,
        }));
        setDataServices(formattedDataServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDataPackage = async () => {
    setLoading(true);
    try {
      const payload = {
        service_id: form.network,
        requestType: "SME",
      };
      const response = await api.post("api/auth/data-packages", payload);
      if (response.data.status === "success") {
        // Filter only available packages
        const availablePackages = response.data.data.details.filter(
          (pkg) => pkg.status === "Available"
        );
        // console.log(availablePackages.length)
        setDataPackage(availablePackages);
        if (availablePackages.length < 1) {
            await Burnt.toast({
                title: "No available data packages for selected network.",
                preset: "warning",
                from: "top",
            });
        }
      }
    } catch (error) {
      console.error("Error fetching data packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelection = (selectedItem) => {
    if (selectedItem) {
      setForm((prevForm) => ({
        ...prevForm,
        network: selectedItem.id,
      }));
    }
  };

  const handlePackageSelection = (selectedItem) => {
    if (selectedItem) {
      setForm((prevForm) => ({
        ...prevForm,
        code: selectedItem.id,
        amount: selectedItem.price.toString(), // Auto-fill amount based on package price
      }));

      // Clear the error for data package selection
      setErrors((prevErrors) => ({
        ...prevErrors,
        code: "",
      }));
    }
  };

  const buyData = async () => {
    setLoading(true);
    try {
      const payload = {
        service_id: form.network,
        service_type: 'SME',
        phoneNumber: form.phoneNumber,
        code: form.code,
        amount: form.amount,
      };

      const response = await api.post("api/auth/datapurchase/", payload);

      if (response.data.status === "success") {
        Burnt.toast({
          title: 'Success',
          message: 'Data purchase successful!',
          preset: 'done',
        });
        router.replace('/(root)/(redeem)');
      }
    } catch (error) {
      console.error("Error purchasing data:", error);
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
          <Text className='font-MonaExpandedBold text-3xl mb-10' numberOfLines={1}>Buy Data</Text>
          <View className="w-full flex-row items-center">
            <View className="flex-1">
              <View className="mb-7">
                <CustomDropdown
                  title={'Network Type'}
                  placeholder="Select Network Type"
                  dataSet={dataServices}
                  onSelectItem={handleServiceSelection}
                  error={errors.network}
                />
              </View>

              {dataPackage.length > 0 && (
                <>
                  <FormField
                    title="Phone Number"
                    placeholder="Enter Phone Number"
                    value={form.phoneNumber}
                    handleChangeText={(text) => setForm((prevForm) => ({ ...prevForm, phoneNumber: text }))}
                    error={errors.phoneNumber}
                    otherStyles="mb-7"
                    keyboardType="numeric"
                    maxLength={11}
                  />

                  <View className="mb-7">
                    <CustomDropdown
                      title={'Data Package'}
                      placeholder="Select Data Package"
                      dataSet={dataPackage.map((pkg) => ({
                        id: pkg.productCode,
                        title: pkg.name,
                        price: pkg.price,
                      }))}
                      onSelectItem={handlePackageSelection}
                      error={errors.code}
                    />
                  </View>

                  <FormField
                    title="Amount"
                    placeholder="Enter Amount"
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
                      onPress={buyData}
                      disabled={!isFormValid || loading}
                    />
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {loading && <Loading />}
    </>
  );
};

export default Data;