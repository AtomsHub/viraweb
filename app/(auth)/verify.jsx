import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { OtpInput } from "react-native-otp-entry";
import { images } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import * as Burnt from "burnt";
import api from "@/utils/api"; // Import your API instance

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useLocalSearchParams();
  const { email } = params;

  const handleVerifyOTP = async () => {
    setIsSubmitting(true);

    try {
      const lowerCaseEmail = email.toLowerCase();
      // console.log("Email:", lowerCaseEmail, "OTP:", otp);

      const payload = {
        email: lowerCaseEmail,
        verificationCode: otp,
      };
      // console.log("Payload:", payload);

      const response = await api.post("api/auth/verify-email", payload, {
        requiresToken: false,
      });

      // console.log("Response:", response.data);

      if (response.data.status === "success" && response.data.message === "Email verified successfully.") {
        await AsyncStorage.setItem("BearerToken", response.data.token);
        await Burnt.toast({
          title: response.data.message,
          preset: "success",
          from: "top",
        });
        router.replace("/(auth)/sign-in");
        return;
      }
    } catch (error) {
      console.error(
        "Error verifying OTP:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 h-full w-full bg-white">
      {/* Image Container */}
      <View className="h-[220px] overflow-hidden relative flex items-center justify-end">
        <Image source={images.auth} className="w-full" style={{width: '100%'}} resizeMode="cover" />
      </View>

      <View className="p-6 min-h-[70vh] justify-between">
        <View>
          <View>
            <Text className="text-4xl font-MonaExpandedExtraBold text-primary text-center mt-8">
              Verify OTP
            </Text>
            <Text className="text-gray-500 font-MonaMedium text-center mt-1">
              Enter the 6-digit code sent to your email
            </Text>
          </View>

          <View className="mt-10">
            <OtpInput
              numberOfDigits={6}
              focusColor="#DE4C73"
              focusStickBlinkingDuration={500}
              onTextChange={(text) => setOtp(text)} // Update OTP state
              // onFilled={handleVerifyOTP}
              theme={{
                containerStyle: { width: "85%", alignSelf: "center" },
                pinCodeContainerStyle: {
                  borderWidth: 1,
                  borderColor: "#F9D1DB",
                  borderRadius: 8,
                  width: 43,
                  height: 60,
                },
                pinCodeTextStyle: {
                  color: "#000",
                  fontSize: 20,
                },
                focusStickStyle: {
                  backgroundColor: "#79A6AE",
                },
                focusedPinCodeContainerStyle: {
                  borderColor: "#5B7D83",
                },
                filledPinCodeContainerStyle: {
                  borderColor: "#B1DCE3",
                  backgroundColor: "#F2F9FA",
                },
              }}
              secureTextEntry={false}
              // onFocus={() => console.log("Focused")}
              // onBlur={() => console.log("Blurred")}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
            />
          </View>
        </View>

        <CustomButton
          title={isSubmitting ? "Verifying..." : "Verify"}
          onPress={handleVerifyOTP}
          className="mt-10"
          bgVariant="primary"
          disabled={otp.length !== 6}
          IconRight={() => (
            <Feather
              name="arrow-right"
              size={16}
              color="white"
              style={{ marginLeft: 8 }}
            />
          )}
        />
        <View className="web:mt-3" />
      </View>
    </View>
  );
};

export default Verify;