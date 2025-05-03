import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import FormField from '@/components/FormField';
import { retrieveData } from '@/utils/api';
import BackButton from '@/components/BackButton';

const ProfileDetails = () => {
 
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userResponse = await retrieveData('userResponse');
            if (userResponse) {
                setUserData(userResponse);
                // console.log(userResponse)
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    };

  return (
    <>
        <View className='pt-14 web:pt-8 bg-primary-700 px-6 pb-6'>
            <BackButton navigateTo="/account"/>
        </View>
        <ScrollView className="h-full w-full">
            <View className="px-6 pt-6">
            
                
                <Text className="text-3xl mb-4 font-MonaExpandedSemiBold text-primary">Personal Details</Text>
                

                <FormField title="Name" value={userData?.name} editable={false} />
                <FormField title="Email" value={userData?.email} editable={false} />
                <FormField title="Plan" value={userData?.package?.name} editable={false} />
                <FormField title="Referral Code" value={userData?.referralCode} editable={false} />
            </View>
        </ScrollView>
    </>
  );
};

export default ProfileDetails;