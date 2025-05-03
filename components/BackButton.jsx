import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { router } from 'expo-router'

const BackButton = ({ color = 'white', text = 'Back', navigateTo = null }) => {
  const navigation = useNavigation()

  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else if (navigateTo) {
      router.push(navigateTo)
    }
  }

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      className='flex-row items-center gap-x-2 mt-0 pt-0 bg-primary-700 w-full'
    >
      <Ionicons 
        name="arrow-back" 
        size={24} 
        color={color} 
      />
      <Text className='text-lg font-MonaExpandedSemiBold text-white'>
        {text}
      </Text>
    </TouchableOpacity>
  )
}

export default BackButton
