import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as Burnt from 'burnt';

import api, { checkToken } from '@/utils/api';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import Loading from '@/components/Loading';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '@/components/BackButton';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

    // Password validation test function
  const validatePasswords = () => {
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    let hasErrors = false;

    // Validate old password
    if (oldPassword.length > 0 && oldPassword.length < 6) {
      newErrors.oldPassword = 'Password must be at least 6 characters';
      hasErrors = true;
    }

    // Validate new password
    if (newPassword.length > 0) {
      if (newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
        hasErrors = true;
      } else if (newPassword === oldPassword) {
        newErrors.newPassword = 'New password must be different from old password';
        hasErrors = true;
      }
    }

    // Validate confirm password
    if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    setErrors(newErrors);
    
    // Check if all fields are filled and there are no errors
    const allFieldsFilled = oldPassword.length >= 6 && 
                          newPassword.length >= 6 && 
                          confirmPassword.length >= 6;
    
    setIsButtonDisabled(hasErrors || !allFieldsFilled);
  };

  useEffect(() => {
    validatePasswords();
  }, [oldPassword, newPassword, confirmPassword]);

  const handleSubmit = async () => {
    // console.log("old password", oldPassword)
    // console.log("new password", newPassword)
    setLoading(true);
    try {
      const response = await api.post('/api/auth/change-password', {
        oldPassword,
        newPassword,
      });
      // console.log(response.data.status)
      if (response.data.status === 'success') {
        await Burnt.toast({
          title: response.data.message,
          preset: 'success',
          from: 'top',
        });
        router.replace('/account');
      }
    } catch (error) {
      // Handle error here
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
          
          <Text className="text-3xl mb-4 font-MonaExpandedSemiBold text-primary">Change Password</Text>

          <FormField
            title="Old Password"
            placeholder="Enter your password"
            handleChangeText={(text) => setOldPassword(text)}
            error={errors.oldPassword}
            value={oldPassword}
            iconBrand={MaterialIcons}
            iconName="lock-outline"
            iconColor="#000"
            size={18}
            password
            autoCapitalize="none"
          />

          <FormField
            title="New password"
            placeholder="Enter your new password"
            handleChangeText={(text) => setNewPassword(text)}
            error={errors.newPassword}
            value={newPassword}
            iconBrand={MaterialIcons}
            iconName="lock-outline"
            iconColor="#000"
            size={18}
            password
            autoCapitalize="none"
          />

          <FormField
            title="Verify New password"
            placeholder="Verify your new password"
            handleChangeText={(text) => setConfirmPassword(text)}
            error={errors.confirmPassword}
            value={confirmPassword}
            iconBrand={MaterialIcons}
            iconName="lock-outline"
            iconColor="#000"
            size={18}
            password
            autoCapitalize="none"
          />
        </View>
      </ScrollView>

      <View className="w-full px-6 mb-5 mt-2">
        <CustomButton
          title={loading ? 'Loading...' : 'Continue'}
          containerStyles="bg-primary mb-4"
          textStyles="text-gray"
          onPress={handleSubmit}
          disabled={isButtonDisabled || loading}
        />
      </View>
      {loading && <Loading />}
    </>
  );
};

export default ChangePassword;