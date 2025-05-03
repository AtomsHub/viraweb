import { View, Text, ScrollView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Burnt from 'burnt'
import Transaction from '@/components/Transaction'
import api from '@/utils/api'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router';
import Loading from '@/components/Loading'
import { StatusBar } from 'expo-status-bar'

const History = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactionHistory()
    }, [])
  );

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true)
      const response = await api.get('api/tasks/getMyTaskLog')
      // console.log(response.data)
      if (response.data.status === 'success') {
        setTransactions(response.data.data)
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  return (
    <SafeAreaView className="h-full w-full pt-12 justify-between bg-white">
      <ScrollView className="h-full w-full web:py-12">
      <View className="flex-1 px-6">
        <Text className='font-MonaExpandedBold text-3xl mb-10' numberOfLines={1}>Task Log</Text>
        {transactions.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-gray-500">No transactions found</Text>
          </View>
        ) : (
          transactions.map((transaction) => {
            return (
              <View>
                <Transaction
                  key={transaction._id}
                  title={transaction.taskId.title}
                  type={'task'}
                  date={formatDate(transaction.createdAt)}
                  amount={`₦${transaction.amount?.toLocaleString(2) || '0'}`}
                  status={transaction.status}
                />
              </View>
            )
          })
        )}
      </View>
      </ScrollView>
      {loading && <Loading />}
      <StatusBar style="dark" backgroundColor='#ffffff' />
    </SafeAreaView>
  )
}

export default History