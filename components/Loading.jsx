import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';

const Loading = () => {
  return (
    <View
      // intensity={20} 
      // tint="default"
      // experimentalBlurMethod="dimezisBlurView" 
      style={{zIndex: 1000000000}}
      className="absolute top-0 left-0 bg-black/80 right-0 bottom-0 justify-center items-center"
    >
      <View className='items-center justify-center p-5 rounded-lg bg-primary'>
        <ActivityIndicator size="large" color="white" />

      </View>
    </View>
  );
};

export default Loading;