import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const PackageCard = ({ name, description, price, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      className={`border mb-3 rounded-md p-6 ${isSelected ? 'bg-primary-100 border-primary-500' : 'bg-secondary-100 border-secondary-500'} flex-row justify-between items-center`}
      onPress={onPress}
    >
      <View className='flex-1'>
        <Text className={`font-MonaExpandedBold text-2xl ${isSelected ? 'text-primary-700' : 'text-secondary-700'}`}>{name}</Text>
        <Text className={`font-MonaRegular text-lg ${isSelected ? 'text-primary-600' : 'text-secondary-600'} mt-1`}>{description}</Text>
      </View>
      <Text className={`font-MonaExtraBold text-4xl ${isSelected ? 'text-primary-700' : 'text-secondary-700'}`}>₦{price}</Text>
    </TouchableOpacity>
  );
};

export default PackageCard;