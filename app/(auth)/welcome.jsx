import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import { AntDesign } from '@expo/vector-icons';

import { images } from '@/constants';

export default function App() {
  const swiperRef = useRef(null); 
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      image: images.onboarding1,
      title: 'Earn Rewards for Everyday Tasks',
      description: 'Complete simple daily tasks on ViraShare and start earning points effortlessly. The more you engage, the more you earn!',
    },
    {
      image: images.onboarding2,
      title: 'Redeem Points for Exciting Rewards',
      description: 'Turn your earned points into real benefits. Redeem them for cash, gift cards, or exclusive deals on ViraShare!',
    },
    {
      image: images.onboarding3,
      title: 'Stay Motivated & Achieve More',
      description: 'Make productivity fun! ViraShare helps you stay engaged with daily challenges while rewarding you for your efforts.',
    },
  ];

  return (
    <SafeAreaView className="h-full w-full items-center justify-between bg-white">
      <View className="flex-1 w-full">
        <Swiper
          ref={swiperRef}
          loop={false}
          dot={<View className="w-2 h-2 bg-gray-300 rounded-full mx-1" />}
          activeDot={<View className="w-6 h-2 bg-primary rounded-full mx-1" />}
          onIndexChanged={(index) => setActiveIndex(index)}
          



        >
          {slides.map((slide, index) => (
            <View key={index} className="w-full items-center justify-center flex-1 px-6">
              <Image source={slide.image} resizeMode="contain" className="w-full h-[300px]" />
              <View className="mt-10 w-11/12">
                <Text className="font-MonaExpandedBold text-4xl text-primary">{slide.title}</Text>
                <Text className="font-MonaRegular text-lg text-gray-default mt-1">
                  {slide.description}
                </Text>
              </View>
            </View>
          ))}
        </Swiper>
      </View>

      <View className="px-6 w-full mb-5 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
          <Text className="font-MonaExpandedBold text-xl">Skip</Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={() => {
            if (activeIndex < slides.length - 1) {
              swiperRef.current.scrollBy(1);
            } else {
              router.push('/(auth)/sign-in'); 
            }
          }}
        >
          <AntDesign name="rightcircle" size={30} color="#DE4C73" />
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}