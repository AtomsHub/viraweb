import { View, Text } from 'react-native'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

const Transaction = ({
  title = "Transaction",
  type = "other",
  date = "05/01/2023",
  amount = "₦0",
  status = "pending",
}) => {
  // Determine icon based on transaction type
  const getTransactionIcon = () => {
    switch (type.toLowerCase()) {
      case 'airtime':
        return { icon: Ionicons, name: 'call', bgColor: 'bg-blue-400' }
      case 'data':
        return { icon: Ionicons, name: 'wifi', bgColor: 'bg-purple-400' }
      case 'bank':
      case 'bank transfer':
        return { icon: MaterialCommunityIcons, name: 'bank-outline', bgColor: 'bg-green-400' }
      case 'task':
        return { icon: MaterialCommunityIcons, name: 'checkbox-marked-circle-outline', bgColor: 'bg-yellow-400' }
      case 'subscription':
      case 'membership':
        return { icon: MaterialIcons, name: 'card-membership', bgColor: 'bg-indigo-400' }
      default:
        return { icon: MaterialCommunityIcons, name: 'swap-horizontal', bgColor: 'bg-gray-400' }
    }
  }

  // Determine status color and text
  const getStatusInfo = () => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return { color: 'text-green-500', text: 'Completed' }
      case 'pending':
        return { color: 'text-yellow-500', text: 'Pending' }
      case 'failed':
        return { color: 'text-red-500', text: 'Failed' }
      case 'cancelled':
        return { color: 'text-red-400', text: 'Cancelled' }
      case 'processing':
        return { color: 'text-blue-500', text: 'Processing' }
      case 'active':
        return { color: 'text-green-400', text: 'Active' }
      case 'expired':
        return { color: 'text-red-300', text: 'Expired' }
      default:
        return { color: 'text-gray-500', text: status }
    }
  }

  const { icon: IconComponent, name: iconName, bgColor } = getTransactionIcon()
  const { color: statusColor, text: statusText } = getStatusInfo()

  return (
    <View className='flex-row items-center justify-between bg-secondary-100/70 p-4 rounded-md mb-3'>
      <View className='flex-row items-center flex-1'>
        <View className={`${bgColor} rounded-lg mr-3 h-10 w-10 items-center justify-center`}>
          <IconComponent name={iconName} size={20} color="white" />
        </View>
        <View className='flex-1'>
          <Text className='font-MonaMedium text-md text-secondary-800' numberOfLines={1}>
            {title}
          </Text>
          <View className='flex-row items-center gap-x-3 mt-1'>
            <Text className='font-MonaLight text-xs text-gray-500 capitalize'>{type}</Text>
            <Text className='font-MonaLight text-xs text-gray-500'>{date}</Text>
          </View>
        </View>
      </View>

      <View className='items-end ms-3'>
        <Text className={`font-MonaBold text-end text-lg ${statusColor}`}>
          {amount}
        </Text>
        <Text className={`font-MonaMedium text-end text-xs ${statusColor}`}>
          {statusText}
        </Text>
      </View>
    </View>
  )
}

export default Transaction