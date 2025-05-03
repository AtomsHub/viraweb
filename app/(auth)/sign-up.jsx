import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";
import FormField from "@/components/FormField";
import { Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import * as Burnt from "burnt";
import api from "@/utils/api"; // Import your API instance
import Loading from "@/components/Loading";

const SignUp = () => {
  const [form, setForm] = useState({
    fullname: "",
    phoneNumber: "",
    email: "",
    password: "",
    confpassword: "",
    referral: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    phoneNumber: "",
    email: "",
    password: "",
    confpassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation functions
  const validatePhoneNumber = (phoneNumber) => {
    const nigeriaPhoneRegex = /^(070|080|081|090|091)\d{8}$/;
    return nigeriaPhoneRegex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  // Validate the form whenever the form state changes
  useEffect(() => {
    const newErrors = {};

    if (form.fullname.length > 0 && form.fullname.length <= 5) {
      newErrors.fullname = "Full name must be greater than 5 characters.";
    }

    if (form.phoneNumber.length > 0 && !validatePhoneNumber(form.phoneNumber)) {
      newErrors.phoneNumber = "Invalid Nigerian phone number.";
    }

    if (form.email.length > 0 && !validateEmail(form.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (form.password.length > 0 && !validatePassword(form.password)) {
      newErrors.password =
        "Password must be at least 6 characters, contain uppercase, lowercase, and a number.";
    }

    if (form.confpassword.length > 0 && form.password !== form.confpassword) {
      newErrors.confpassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    // Check if the form is valid (no errors and all fields are filled)
    const isFormComplete =
      form.fullname.length > 5 &&
      validatePhoneNumber(form.phoneNumber) &&
      validateEmail(form.email) &&
      validatePassword(form.password) &&
      form.password === form.confpassword;

    setIsFormValid(isFormComplete && Object.keys(newErrors).length === 0);
  }, [form]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignUp = async () => {
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
        "/api/auth/register",
        {
          name: form.fullname,
          email: lowerCaseEmail,
          password: form.password,
          phone: form.phoneNumber,
          referralCode: form.referral,
        },
        { requiresToken: false }
      );

      // console.log(response.data)
      if (response.data.status === "success") {
        if (response.data.message === "Email already verified.") {
          await Burnt.toast({
            title: response.data.message,
            preset: "success",
            from: "top",
          });
          router.push('sign-in');
          return;
        } else {
          await Burnt.toast({
            title: response.data.message,
            preset: "success",
            from: "top",
          });
          router.push({
            pathname: "/verify",
            params: { email: form.email },
          });
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      await Burnt.toast({
        title: error.response?.data?.message || "Signup failed. Please try again.",
        preset: "error",
        from: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full ">
        <Image source={images.auth} className="z-0 w-full" style={{width: '100%'}} resizeMethod="contain" />
          <Text className="text-4xl text-black font-MonaExpandedExtraBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>

        <View className="p-5">
          <FormField
            title="Full Name"
            placeholder="Enter your full name"
            iconBrand={FontAwesome5}
            iconName="user"
            size={18}
            handleChangeText={(value) => handleChange("fullname", value)}
            value={form.fullname}
            keyboardType="default"
            autoCapitalize="words"
            error={errors.fullname}
          />

          <FormField
            title="Phone Number"
            placeholder="Enter a valid Nigeria Phone Number"
            iconBrand={FontAwesome}
            iconName="phone"
            size={18}
            keyboardType="numeric"
            handleChangeText={(value) => handleChange("phoneNumber", value)}
            value={form.phoneNumber}
            autoCapitalize="none"
            maxLength={11}
            error={errors.phoneNumber}
          />

          <FormField
            title="Email"
            placeholder="Enter email"
            iconBrand={MaterialCommunityIcons}
            iconName="email-outline"
            size={18}
            keyboardType="email-address"
            handleChangeText={(value) => handleChange("email", value)}
            value={form.email}
            autoCapitalize="none"
            error={errors.email}
          />

          <FormField
            title="Referral Code (Optional)"
            placeholder="Enter your referral code"
            iconBrand={FontAwesome}
            iconName="gift"
            size={18}
            handleChangeText={(value) => handleChange("referral", value)}
            value={form.referral}
            autoCapitalize="none"
          />

          <FormField
            title="Password"
            placeholder="Enter your password"
            value={form.password}
            handleChangeText={(value) => handleChange("password", value)}
            iconBrand={MaterialIcons}
            iconName="lock-outline"
            iconColor="#000"
            size={18}
            password
            autoCapitalize="none"
            error={errors.password}
          />

          <FormField
            title="Confirm Password"
            placeholder="Confirm your password"
            value={form.confpassword}
            handleChangeText={(value) => handleChange("confpassword", value)}
            iconBrand={MaterialIcons}
            iconName="lock-outline"
            iconColor="#000"
            size={18}
            password
            autoCapitalize="none"
            error={errors.confpassword}
          />

          <CustomButton
            title={isSubmitting ? "Signing Up..." : "Sign Up"}
            onPress={handleSignUp}
            className="mt-6"
            disabled={!isFormValid || isSubmitting}
            IconRight={() => <Feather name="arrow-right" className="ms-3" size={16} color="white" />}
          />

          <Link href="/sign-in" className="text-lg font-Regular text-center text-general-200 mt-3">
            Already have an account?{" "}
            <Text className="text-primary-500">Sign in</Text>
          </Link>
        </View>
      </View>
      {isSubmitting && <Loading />}
    </ScrollView>
  );
};

export default SignUp;