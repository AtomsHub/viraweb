import { View, Text, StyleSheet, Image, FlatList, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient';

import CustomButton from '@/components/CustomButton';
import Coin from '@/assets/icons/coin';
import { images } from '@/constants';
import TaskView from '@/components/TaskView';
import api, { retrieveData, storeData } from '@/utils/api';
import Loading from '@/components/Loading';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [points, setPoints] = useState(0); // Points from mainBalance
  const totalPoints = 3500; // Total points required
  const progress = points / totalPoints;
  const remainingPoints = Math.max(0, totalPoints - points);

  // Fetch data on focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      getProfile();
    }, [])
  );
  

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("api/auth/profile");
      if (response.data.status === "success") {
        const profileData = response.data.data;
        // console.log(response.data.data)
        await storeData(profileData);
        setUserData(profileData.userResponse);
        setTasks(profileData.tasks);
        setPoints(profileData.userResponse.mainBalance); // Set points from mainBalance
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const userResponse = await retrieveData('userResponse');
      const tasks = await retrieveData('tasks');
      if (userResponse && tasks) {
        setUserData(userResponse);
        setTasks(tasks);
        setPoints(userResponse.mainBalance); // Set points from mainBalance
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  return (
    <SafeAreaView className='bg-white flex-1'>
      <ScrollView className='bg-white flex-1 p-6 pt-10'>
        <Text className='font-MonaExpandedBold text-3xl mb-6' numberOfLines={1}>
          Hello {userData?.name || 'User'} 👋
        </Text>

        {/* Points Section */}
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradientContainer} className='p-5 shadow-md rounded-lg'>
          <Text className='text-white font-MonaLight'>Your point</Text>

          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-x-2'>
              <Text className='text-white font-MonaExpandedBold text-[4rem]'>{points}</Text>
              <Text className='text-white font-MonaSemiBold text-xl'>/ {totalPoints}</Text>
            </View>
            <CustomButton title='Convert' onPress={()=>{router.push('/(root)/(redeem)')}} bgVariant='secondary' />
          </View>

          <Progress.Bar
            progress={progress}
            width={null}
            height={10}
            color='#DE4C73'
            unfilledColor='#E0E0E0'
            borderWidth={0}
            borderRadius={5}
            style={styles.progressBar}
          />
          <Text className='text-white font-MonaMedium pt-3'>{remainingPoints} points left to earn before withdrawal</Text>
        </LinearGradient>

        {/* Earn More Section */}
        <View className='bg-primary-200 p-5 rounded-lg shadow-md mt-6'>
          <Text className='font-MonaRegular text-md'>Earn more</Text>
          <View className='mb-5 mt-3'>
            <Text className='font-MonaExtraBold text-2xl'>Play and Earn more Points!</Text>
            <View className='flex-row p-1 gap-x-1'>
              <Coin width={20} height={20} />
              <Text className='font-MonaMedium text-lg'>Gain up to 200 point</Text>
            </View>
          </View>

          <Image source={images.gameController} className='absolute bottom-100 end-0 h-[200] w-[110]' style={{height: 200, width: 110}} resizeMode='contain' />
          <CustomButton title="Start Playing" className="w-2/5" />
        </View>

        {/* Priority Task Section */}
        <View className='bg-gray-50 p-5 mt-10 rounded-lg shadow-md'>
          <Text className='font-MonaExpandedSemiBold text-xl mb-4'>Priority Task</Text>
          {isLoading ? (
            <Text className='font-MonaMedium text-center'>Loading tasks...</Text>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskView
                key={task._id}
                taskId={task._id}
                taskLink={task.taskLink}
                title={task.title}
                description={task.description}
                engagementType={task.engagementType}
                socialPlatform={task.socialPlatform || 'NA'}
                point={task.taskPrice}
                date={new Date(task.createdAt).toLocaleDateString()}
                imageSource={task.image}
              />
            ))
          ) : (
            <Text className='font-MonaMedium text-center'>No tasks available</Text>
          )}
        </View>

        <View className='my-24' />
        <StatusBar style="dark" />
      </ScrollView>
      {isLoading && <Loading />}
      <StatusBar style="dark" backgroundColor='#ffffff' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  progressBar: {
    marginTop: 16,
  },
});

export default Home;