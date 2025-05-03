import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as Burnt from "burnt";
import api from "@/utils/api"; // Import your API instance
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "@/components/Loading";
import Modal from 'react-native-modal';

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetCodeField, setResetCodeField] = useState(false);

  const [isForgotPasswordValid, setIsForgotPasswordValid] = useState(false);
  const [forgottenPasswordEmail, setForgottenPasswordEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  // Validate sign-in form
  useEffect(() => {
    const newErrors = {};

    if (form.email.length > 0 && !validateEmail(form.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (form.password.length > 0 && !validatePassword(form.password)) {
      newErrors.password =
        "Password must be at least 6 characters, contain uppercase, lowercase, and a number.";
    }

    setErrors(newErrors);
    setIsFormValid(
      Object.keys(newErrors).length === 0 && form.email.length > 0 && form.password.length > 0
    );
  }, [form.email, form.password]);

  // Validate forgot password form
  useEffect(() => {
    if (resetCodeField) {
      // Validate reset code and new password
      const isResetCodeValid = resetCode.length === 6;
      const isNewPasswordValid = validatePassword(newPassword) && newPassword.length > 6;
      setIsForgotPasswordValid(isResetCodeValid && isNewPasswordValid);
    } else {
      // Validate email for forgot password
      setIsForgotPasswordValid(validateEmail(forgottenPasswordEmail));
    }
  }, [forgottenPasswordEmail, resetCode, newPassword, resetCodeField]);

  // Handle forgot password request
  const handleForgotPassword = async () => {
    setModalLoading(true);
    try {
      const response = await api.post("api/auth/forgot-password", { email: forgottenPasswordEmail });

      if (response.data.status === "success") {
        setResetCodeField(true);
        Burnt.toast({
          title: 'Success',
          message: response.data.message,
          preset: 'done',
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle reset password request
  const handleResetPassword = async () => {
    setModalLoading(true);
    try {
      const response = await api.post("api/auth/reset-password", {
        email: forgottenPasswordEmail,
        otp: resetCode,
        newPassword: newPassword,
      });

      if (response.data.status === "success") {
        setIsModalVisible(false);
        setResetCodeField(false);
        setForgottenPasswordEmail('');
        setResetCode('');
        setNewPassword('');
        Burnt.toast({
          title: 'Success',
          message: response.data.message,
          preset: 'done',
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setModalLoading(false);
    }
  };

  // Handle sign-in
  const handleSignIn = async () => {
    if (!isFormValid) {
      await Burnt.toast({
        title: "Please fix the errors in the form.",
        preset: "error",
        from: "top",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const lowerCaseEmail = form.email.toLowerCase();

      const response = await api.post(
        "api/auth/login",
        {
          email: lowerCaseEmail,
          password: form.password,
        },
        { requiresToken: false }
      );

      if (response.data.status === "success") {
        const data = response.data.data;
        // console.log(data);

        for (const [key, value] of Object.entries(data)) {
          if (typeof value === "object") {
            // Serialize objects/arrays before storing
            await AsyncStorage.setItem(key, JSON.stringify(value));
          } else {
            await AsyncStorage.setItem(key, value);
          }
        }

        if (data.userResponse.package && data.emptyField !== "bankDetails") {
          await Burnt.toast({
            title: 'Login Successfully',
            preset: "success",
          });
          router.replace("/(root)/(tabs)");
          return;
        }

        if (data.userResponse.package && data.emptyField === "bankDetails") {
          await Burnt.toast({
            title: 'Login Successfully',
            preset: "success",
          });
          router.replace("/(other)/bankDetails");
          return;
        } else {
          await Burnt.toast({
            title: 'Login Successfully, please subscribe to continue',
            preset: "success",
            from: "top",
          });
          router.replace("/(auth)/subscription");
          return;
        }
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        <View className="relative w-full">
          <Image source={images.auth} className="z-0 w-full" style={{width: '100%'}} resizeMethod="contain" />
          <Text className="text-4xl text-black font-MonaExpandedExtraBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <FormField
            title="Email"
            placeholder="Enter email"
            iconBrand={FontAwesome}
            iconName="envelope-o"
            size={18}
            keyboardType="email-address"
            handleChangeText={(value) => setForm({ ...form, email: value })}
            value={form.email}
            error={errors.email}
            autoCapitalize="none"
          />

          <FormField
            title="Password"
            placeholder="Enter your password"
            error={errors.password}
            value={form.password}
            handleChangeText={(value) => setForm({ ...form, password: value })}
            iconBrand={MaterialIcons}
            iconName="lock-outline"
            iconColor="#000"
            size={18}
            password
            autoCapitalize="none"
          />

          <CustomButton
            title={isSubmitting ? "Signing In..." : "Sign In"}
            onPress={handleSignIn}
            disabled={!isFormValid || isSubmitting}
            className="mt-6"
            IconRight={() => <Feather name="arrow-right" size={16} color="white" />}
          />

          <TouchableOpacity onPress={() => setIsModalVisible(true)} className="mt-2">
            <Text className="text-gray-500 text-right">Forgot Password?</Text>
          </TouchableOpacity>

          <Link href="/sign-up" className="text-lg font-Regular text-center text-general-200 mt-4">
            Don't have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </ScrollView>

      <Modal isVisible={isModalVisible} className="z-10" onBackdropPress={() => setIsModalVisible(false)}>
        <View className="bg-white p-6 rounded-lg">
          <Text className="text-2xl font-MonaExpandedSemiBold mb-1">Forgot Password</Text>
          <Text className="font-MonaLight text-md mb-6">
            {resetCodeField ? "Enter the reset code and new password." : "Enter your email to reset your password."}
          </Text>

          <FormField
            title="Email"
            placeholder="Enter email"
            iconBrand={FontAwesome}
            value={forgottenPasswordEmail}
            handleChangeText={(value) => setForgottenPasswordEmail(value)}
            iconName="envelope-o"
            size={18}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!resetCodeField}
          />

          {resetCodeField && (
            <>
              <FormField
                title="Reset Code"
                placeholder="Enter the reset code"
                value={resetCode}
                handleChangeText={(value) => setResetCode(value)}
                keyboardType="numeric"
                iconBrand={MaterialIcons}
                iconName="lock-outline"
                iconColor="#000"
                size={18}
                maxLength={6}
              />

              <FormField
                title="New Password"
                placeholder="Enter your new password"
                value={newPassword}
                handleChangeText={(value) => setNewPassword(value)}
                iconBrand={MaterialIcons}
                iconName="lock-outline"
                iconColor="#000"
                size={18}
                password
                autoCapitalize="none"
              />
            </>
          )}
          <View className="flex-row mt-4 gap-3">
            <CustomButton
              title={
                modalLoading ? (
                  <>
                    Loading <ActivityIndicator size="small" color="#ffffff" />
                  </>
                ) : resetCodeField ? (
                  'Verify Reset Code'
                ) : (
                  'Reset Password'
                )
              }
              className="bg-primary flex-1"
              textStyles="text-white"
              disabled={(resetCodeField ? !(resetCodeField && newPassword && newPassword.length > 5 && resetCode.length === 6) : !isForgotPasswordValid) || modalLoading}
              onPress={resetCodeField ? handleResetPassword : handleForgotPassword}
            />

            {resetCodeField && 
              <CustomButton 
                className={'bg-secondary-500 px-6'} 
                title={'Back'} 
                disabled={false}
                onPress={()=>{
                  setResetCodeField(false)
                  setResetCode('');
                  setNewPassword('');
                  }} 
              />
            }

            

          </View>
        </View>
      </Modal>

      {isSubmitting && <Loading />}
    </View>
  );
};

export default SignIn;