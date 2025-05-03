import { View, Text, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import Coin from '@/assets/icons/coin';
import { useState } from 'react';
import * as Burnt from 'burnt';
import api from '@/utils/api';

const TaskView = ({
    title,
    description,
    containerStyle,
    date,
    point,
    taskLink,
    engagementType,
    socialPlatform,
    taskId,
    imageSource // Add image prop
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTaskPress = async () => {
    setIsLoading(true);
    try {
      // Perform the task request
      const response = await api.post(`api/tasks/perform/${taskId}`);
      // console.log('Task perform response:', response.data); // Debugging

      if (response.data.status === 'success') {
        Burnt.toast({
          title: response.data.message || 'Task performed successfully!',
          preset: 'done',
        });
        // Open the task link after successful request
        Linking.openURL(taskLink);
      } else {
        Burnt.toast({
          title: response.data.message || 'Failed to perform task',
          preset: 'error',
        });
      }
    } catch (error) {
      console.error('Error performing task:', error); // Debugging
      Burnt.toast({
        title: 'An error occurred',
        preset: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      className={`rounded-md border border-secondary bg-white shadow-md gap-x-3 my-2 overflow-hidden ${containerStyle}`}
      onPress={handleTaskPress}
      disabled={isLoading}
    >
      {/* Use the image from the API response */}
      <Image source={{ uri: imageSource }} className='h-[150] w-full' resizeMode='cover' />
      <View className='gap-x-3 flex-1 p-2 px-4 flex-row justify-between items-center'>
        <View className=''>
          <Text className={`text-primary font-MonaSemiBold text-xl`}>{title}</Text>
          <Text className='font-MonaRegular text-end text-xs'>{engagementType}</Text>
          
          <View className='flex gap-x-1 mt-1'>
            <Text className='font-MonaRegular text-xs'>
              <Text className='font-MonaMedium text-primary-700'>Social Media Platform: </Text>{socialPlatform}
            </Text>
            <Text className='font-MonaRegular text-xs'>
              <Text className='font-MonaMedium text-primary-700'>Created: </Text>{date}
            </Text>

          </View>
        </View>

        <View className='items-center'>
          <View className='flex-row p-1 gap-x-1'>
            <Coin width={16} height={16} />
            <Text className='font-MonaMedium text-md'>{point}</Text>
          </View>

          <TouchableOpacity 
            className='p-2 bg-primary rounded-md' 
            onPress={handleTaskPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className='flex-row gap-x-1 items-center'>
                <ActivityIndicator color="#ffffff" size='small' />
                <Text className='text-white font-MonaRegular text-xs'>Loading...</Text>
              </View>
            ) : (
              <Text className='text-white font-MonaRegular text-xs'>Check now</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TaskView;
// import { View, Text, TouchableOpacity } from 'react-native'
// import Octicons from '@expo/vector-icons/Octicons';
// import Coin from '@/assets/icons/coin';

// const TaskView = ({
//     title,
//     description,
//     status,
//     date,
//     point,
// }) => {
//   return (
//     <TouchableOpacity className='p-4 rounded-md flex-row gap-x-3 justify-between items-center my-2'>
//         <View className='flex-row items-center gap-x-3 flex-1'>
            
//             <View className='bg-primary h-10 w-10 justify-center items-center rounded-full'>
//                 <Octicons name="unverified" size={18} color="white" />
//             </View> 
            
//             <View>
//                 <Text className={`${status === 'success' ? 'text-success-500' : 'text-primary'} font-MonaSemiBold text-lg`}>{title}</Text>
//                 <Text className='font-MonaRegular text-xs'>{description}</Text>
//                 <Text className='font-MonaRegular text-end text-xs'>Created: {date}</Text>
//             </View>
            
//         </View>

//         <View className=''>
//             <View className='flex-row p-1 gap-x-1'>
//               <Coin width={16} height={16} />
//               <Text className='font-MonaMedium text-md'>{point}</Text>
//             </View>

//         </View>
//     </TouchableOpacity>
//   )
// }

// export default TaskView