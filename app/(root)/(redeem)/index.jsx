import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';
import { router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import CustomButton from '@/components/CustomButton';
import api, { retrieveData, storeData } from '@/utils/api';
import Loading from '@/components/Loading';
import AccountList from '@/components/AccountList';
import Transaction from '@/components/Transaction';
import BackButton from '@/components/BackButton';

const Subscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [points, setPoints] = useState(0);
  const totalPoints = 3500;
  const progress = points / totalPoints;
  const remainingPoints = Math.max(0, totalPoints - points);
  const [transactions, setTransactions] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      getTransactions();
    }, [])
  );

  const getTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("api/auth/transactions");
      // console.log("transactions",response.data.data)
      if (response.data.success) {
        setTransactions(response.data.data); 
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const userResponse = await retrieveData('userResponse');
      if (userResponse) {
        setUserData(userResponse);
        setPoints(userResponse.mainBalance);
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getTransactionType = (service) => {
    switch (service) {
      case 'fund_transfer':
        return 'Bank Transfer';
      case 'data_purchase':
        return 'Data';
      case 'airtime_purchase':
        return 'Airtime';
      case 'membership':
        return 'Membership';
      default:
        return 'Transaction';
    }
  };

  return (
    <>
        <View className='pt-14 web:pt-8 bg-primary-700 px-6 pb-6'>
          <BackButton navigateTo="/account"/>
        </View>
        <ScrollView className="h-full w-full">
          <View className="px-6 pt-6">
          <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradientContainer} className='p-5 shadow-md rounded-lg'>
            <Text className='text-white font-MonaLight'>Your point</Text>

            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center gap-x-2'>
                <Text className='text-white font-MonaExpandedBold text-[4rem]'>{points}</Text>
                <Text className='text-white font-MonaSemiBold text-xl'>/ {totalPoints}</Text>
              </View>
              <CustomButton title='Convert' bgVariant='secondary' />
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

          <View className='mt-8'>
            <Text className='font-MonaExtraBold text-2xl'>Redeem your Point</Text>
            <View className='gap-y-3 mt-5'>
              <AccountList
                title="Airtime"
                containerStyle={'bg-primary-200'}
                handlePress={() => router.push('/(root)/(redeem)/airtime')}
              />
              <AccountList
                title="Data"
                containerStyle={'bg-primary-200'}
                handlePress={() => router.push('/(root)/(redeem)/data')}
              />
              <AccountList
                title="Bank Transfer"
                containerStyle={'bg-primary-200'}
                handlePress={() => router.push('/(root)/(redeem)/bankTransfer')}
              />
            </View>
          </View>

          <View className='mt-8 mb-10'>
            <Text className='font-MonaExtraBold text-2xl mb-4'>Redeem History</Text>
            
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <Transaction
                  key={transaction._id}
                  title={transaction.details}
                  type={getTransactionType(transaction.transaction_services)}
                  date={formatDate(transaction.createdAt)}
                  amount={`₦${(transaction.amount/100).toLocaleString()}`}
                  status={transaction.status}
                />
              ))
            ) : (
              <Text className='font-MonaRegular text-center mt-8'>No History Found</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {isLoading && <Loading />}
    </>
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

export default Subscription;