import React, { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Burnt from "burnt";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Loading from "@/components/Loading";
import CustomDropdown from "@/components/CustomDropdown";
import api, { handleLogout } from "@/utils/api";

const BankDetails = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ accountNumber: "",  bankName: "", bankCode: "" });
  const [isFormValid, setIsFormValid] = useState(false);
  const [bankOptions, setBankOptions] = useState([]); // Array of { id: bank.code, title: bank.name }
  const [accountName, setAccountName] = useState("");
  const [errors, setErrors] = useState({ accountNumber: "" });

  // Fetch all banks on component mount
  useEffect(() => {
    getAllBanks();
  }, []);

  // Fetch all banks from the API
  const getAllBanks = async () => {
    setLoading(true);
    try {
      const response = await api.get("api/auth/getBank");
      // console.log(response.data.status);
      if (response.data.status === 'success') {
        // Format the data to match the expected structure
        const formattedBanks = response.data.data.map((bank) => ({
          id: bank.code, 
          title: bank.name, 
        }));
        setBankOptions(formattedBanks);
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle bank selection from the dropdown
  const handleBankSelection = (selectedItem) => {
    if (selectedItem) {
      setForm((prevForm) => ({
        ...prevForm,
        bankName: selectedItem.title, // Use title for bank name
        bankCode: selectedItem.id, // Use id for bank code
      }));
    }
  };

  // Validate input fields (e.g., numeric only)
  const validateInput = (field, value) => {
    let error = "";
    if (!/^[0-9]*$/.test(value)) {
      error = "Only numeric values are allowed.";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  // Verify bank account when account number and bank code are valid
  useEffect(() => {
    if (form.accountNumber.length === 10 && form.bankCode !== "" && errors.accountNumber === "") {
      if (accountName === "") {
        verifyBank();
      }
    }

    // Check if the form is complete and valid
    const isFormComplete = form.accountNumber.length === 10 && form.bankCode !== "" &&  accountName !== "";
    setIsFormValid(isFormComplete);
  }, [form, bankOptions, accountName]);

  // Verify bank account details
  const verifyBank = async () => {
    setLoading(true);
    try {
      const response = await api.post("api/auth/verify-account", {
        account_number: form.accountNumber,
        bank_code: form.bankCode,
      });

      if (response.data.status === "success") {
        setAccountName(response.data.data.account_name);
      }
    } catch (error) {
      console.error("Error verifying bank account:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post("api/auth/account-details", {
        accountNumber: form.accountNumber,
        bankName: form.bankName,
        bankCode: form.bankCode,
        accountName
      });

      if (response.data.status === 'success') {
        await Burnt.toast({
          title: response.data.message,
          preset: "success",
        });
        router.replace('/(root)/(tabs)/');
      }
    } catch (error) {
      console.error("Error submitting bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full w-full pt-12 justify-between bg-white">
      <ScrollView className="h-[80vh] w-full">
        <View className="flex-1 px-6 web:pt-12">
        <Text className='font-MonaExpandedBold text-3xl mb-6' numberOfLines={1}>Verify your Account</Text>
          <View className="w-full flex-row items-center">
            <View className="flex-1">
              <FormField
                title="Account Number"
                placeholder="Enter Bank Account Number"
                value={form.accountNumber}
                handleChangeText={(text) => {
                  validateInput("accountNumber", text);
                  setForm((prevForm) => ({ ...prevForm, accountNumber: text }));
                  setAccountName("")
                }}
                error={errors.accountNumber}
                otherStyles="mb-7"
                keyboardType="numeric"
                maxLength={10}
              />

              <View className="mb-7">
                <CustomDropdown
                  title="Bank"
                  onSelectItem={handleBankSelection}
                  dataSet={bankOptions} // Pass the formatted bankOptions here
                  placeholder="Select Bank"
                />
              </View>

              {accountName && <FormField title="Account Name" placeholder="" value={accountName} otherStyles="mb-7" editable={false} />}

              <View className='flex-row mt-6 gap-x-3'>
                <CustomButton
                title="Continue"
                className={'flex-1'}
                onPress={handleSubmit}
                disabled={!isFormValid || loading}
                />

                <CustomButton
                  title="Log Out"
                  onPress={handleLogout}
                  bgVariant="black"
                  className={'bg-black px-8'}
                />

              </View>

            </View>
          </View>
        </View>
      </ScrollView>


      {loading && <Loading />}
    </SafeAreaView>
  );
};

export default BankDetails;