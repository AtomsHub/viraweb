import { TouchableOpacity, View, Text } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';


const AccountList = ({title, containerStyle, icon: IconName, name, size, handlePress, }) => {
  return (
    <TouchableOpacity className={` p-5 rounded-lg flex-row items-center justify-between ${containerStyle}`} activeOpacity={0.5} onPress={handlePress}>
      <View className={`flex-row  items-center`} >
        {IconName && (
          <View className={`h-12 w-12 items-center justify-center rounded-full bg-secondary`} >
              <IconName name={name} size={size} color="#5B7D83"/>
          </View>
        )}
          <Text className={` ${IconName ? "ml-4" : "font-MonaSemiBold"} text-xl font-MonaRegular"`}>{title}</Text>
    </View>
    <AntDesign name="right" size={18} color="#747783" />
  </TouchableOpacity>
  )
}

export default AccountList