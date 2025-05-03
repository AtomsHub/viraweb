import {View, Text, Image, ScrollView, Linking} from 'react-native';
import { Octicons, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import { images } from '@/constants';
import Coin from '@/assets/icons/coin';
import AccountList from '@/components/AccountList';
import { handleLogout, retrieveData } from '@/utils/api';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const Account = () => {
  const [userData, setUserData] = useState(null); // Move useState inside the component

  const fetchUserData = async () => {
    try {
      const userResponse = await retrieveData('userResponse');
      // console.log(userResponse);
      if (userResponse) {
        setUserData(userResponse); // Set the entire userResponse object
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>

      <ScrollView>
        <View className='bg-secondary p-6 pt-20 flex-row items-center gap-x-5'>
          <View className='bg-white rounded-full overflow-hidden'>
            <Image source={images.avatar} className='h-24 w-24'style={{height: 96, width: 96}} />
          </View>

          <View className=''>
            <Text className='font-MonaExpandedSemiBold text-2xl'>
              {userData ? userData.name : "Loading..."} {/* Safely access userData.name */}
            </Text>
            <Text className='font-MonaRegular text-sm text-gray-default'>
              {userData ? userData.email : "Loading..."} {/* Safely access userData.email */}
            </Text>
            <View className='bg-orange-600 p-1 px-2 mt-1 rounded-md flex-row gap-x-2 items-center'>
              <Coin width={16} height={16} />
              <Text className='font-MonaRegular text-sm text-white'>{userData ? userData.package.name : "Loading"}</Text>
            </View>
          </View>
        </View>

        <View className='pt-10 p-8 bg-white'>
          <View className='shadow-md rounded-lg bg-secondary-100 p-3'>
            <AccountList title="Profile Info" icon={Octicons} name={"person"} size={20} handlePress={()=> router.push('(other)/profileDetails')} />
            <AccountList title="Redeem" icon={MaterialIcons} name={"card-giftcard"} size={24} handlePress={()=> router.push('(redeem)')}/>
            <AccountList title="Social Media" icon={Feather} name={"lock"} size={20} handlePress={()=> router.push('(other)/socialMedia')} />
            <AccountList title="Change Password" icon={Feather} name={"lock"} size={20} handlePress={()=> router.push('(other)/changePassword')} />
            <AccountList title="Contact Us" icon={Feather} name={"mail"} size={20} handlePress={() => Linking.openURL('mailto:support@virashare.io')} />
            <AccountList title="About US" icon={Feather} name={"info"} size={20} handlePress={()=> router.push('(other)/about')} />
            <AccountList title="Sign Out" icon={Entypo} name={"log-out"} size={20} handlePress={handleLogout} />
          </View>
          <View className='my-20' />

        </View>
        <StatusBar style="dark" backgroundColor='#ffffff' />
      </ScrollView>
    </>
  );
};

export default Account;