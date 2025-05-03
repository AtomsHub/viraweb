import { View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FormField = ({
  iconBrand: NameIcon,
  iconName,
  iconColor,
  value,
  otherStyles,
  placeholder,
  color,
  title,
  editable = true,
  error = null,
  titleStyle,
  handleChangeText,
  keyboardType,
  size,
  textInputBgStyles,
  textFocus,
  height,
  autoCapitalize,
  maxLength,
  password = false, // Default to false for normal fields
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secureEntryState, setSecureEntryState] = useState(password); // Only enable secure entry if it's a password field

  const toggleSecureEntry = () => setSecureEntryState(!secureEntryState);

  return (
    // <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
    //   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-3 w-full ${otherStyles}`}>
          {title && (
            <Text className={`text-lg font-MonaSemiBold mb-2 ${titleStyle}`}>
              {title}
            </Text>
          )}

          <View
            className={`flex flex-row h-[52] justify-start items-center relative bg-secondary-100/55 rounded-md border ${
              error ? 'border-primary' : isFocused ? 'border-secondary-600' : 'border-secondary-300'
            } ${textInputBgStyles}`}
          >
            <View className={`flex-row items-center flex-1 w-full ${NameIcon ? "px-4" : "px-2"}`}>
              {NameIcon && (
                <View className="mr-2">
                  <NameIcon name={iconName} size={size} color={iconColor} />
                </View>
              )}

              <TextInput
                className="px-4 font-MonaRegular text-[15px] flex-1"
                placeholder={placeholder}
                value={value}
                placeholderTextColor="#c2c2c2"
                keyboardType={keyboardType}
                returnKeyType="done"
                selectionColor="#605d55"
                onChangeText={handleChangeText}
                secureTextEntry={password ? secureEntryState : false} 
                onFocus={() => {
                  setIsFocused(true);
                  textFocus?.();
                }}
                onBlur={() => setIsFocused(false)}
                editable={editable}
                autoCapitalize={autoCapitalize}
                maxLength={maxLength}
                {...props}
              />

              {password && ( // Only show the eye icon for password fields
                <TouchableOpacity
                  onPress={toggleSecureEntry}
                  className="flex-shrink-0 items-center justify-center ml-2"
                >
                  {secureEntryState ? (
                    <MaterialCommunityIcons name="eye-outline" size={20} color="#c2c2c2" />
                  ) : (
                    <MaterialCommunityIcons name="eye-off-outline" size={20} color="#c2c2c2" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          {error && <Text className={`text-xs font-pRegular text-error-500`}>{error}</Text>}
        </View>
      //</TouchableWithoutFeedback>
    //</KeyboardAvoidingView>
  );
};

export default FormField;