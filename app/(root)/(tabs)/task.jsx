import { View, Text, FlatList, ImageBackground, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { images } from '@/constants';
import TaskView from '@/components/TaskView';
import api from '@/utils/api';
import React, { useState, } from 'react';
import Loading from '@/components/Loading';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      getTask();
    }, [])
  );

  const getTask = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("api/tasks/");
      if (response.data.status === "success") {
        // console.log(response.data.data[0])
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TaskView 
      key={item._id}
      title={item.title}
      description={item.description}
      point={item.taskPrice}
      engagementType={item.engagementType}
      socialPlatform={item.socialPlatform || 'NA'}
      date={new Date(item.createdAt).toLocaleDateString()}
      taskLink={item.taskLink}
      taskId={item._id}
      imageSource={item.image}
      containerStyle={'mx-5'}
    />
  );

  return (
    <SafeAreaView className="flex-1 h-full w-full bg-gray-50">
      

      {isLoading ? (
        <Loading /> // Use the Loading component for the entire screen
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            <ImageBackground source={images.bgGradient} className="w-full h-[300px] overflow-hidden justify-center items-center mb-5" style={{height: 300, width: '100%'}}>
              <View className="items-center w-full mt-10">
                <View className="w-[7rem] h-[7rem]">
                  <Image source={images.task} className='w-full rounded-full h-full' style={{height: '100%', width: '100%'}} resizeMode="contain" />
                </View>
                <Text className="text-3xl font-MonaExpandedBold mt-2">ViraShare Tasks</Text>
                <Text className="text-sm font-MonaMedium text-gray-default mt-1 bg-secondary-00 p-2 px-3 rounded-md text-center ">
                  Manage your tasks, reminders, and schedules all in one place.
                </Text>
              </View>
            </ImageBackground>
          }
          ListFooterComponent={
            <View className='py-16' />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center">
              <Text className="text-lg font-MonaMedium">No tasks available</Text>
            </View>
          }
          // contentContainerStyle={{ padding: 20 }}
        />
      )}

    </SafeAreaView>
  );
};

export default Task;