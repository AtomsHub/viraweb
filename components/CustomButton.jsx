// import { TouchableOpacity, View, Text } from 'react-native'
// import React from 'react'

// const CustomButton = ({ additionalStyles,  handlePress, title, containerStyles, textStyles, disabled, }) => {
//   return (
//     <TouchableOpacity 
//         onPress={handlePress}
//         disabled={disabled}
//         activeOpacity={0.8}
//         className={`min-h-[40px] justify-center items-center rounded-lg ${containerStyles} ${disabled ? ' bg-primary-200' : ""}`}>
        
        
//         <View className={`flex-row gap-x-2 ${additionalStyles} items-center justify-center`}>
//             <Text className={` font-Mona-Bold text-[15px] ${textStyles}`}>{title}</Text>
//         </View>
//     </TouchableOpacity>
//   )
// }

// export default CustomButton
import { TouchableOpacity, Text } from "react-native";

const getBgVariantStyle = (variant) => {
  switch (variant) {
    case "secondary":
      return "bg-secondary";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "black":
      return "bg-black"
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-primary";
  }
};

const getTextVariantStyle = (variant) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

const CustomButton = ({
  onPress,
  disabled,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={`rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${disabled ? `${getBgVariantStyle(bgVariant)}-200` : getBgVariantStyle(bgVariant)}  ${className}`}
      {...props}
    >
      {IconLeft && <IconLeft />}
      <Text className={`text-lg font-MonaExpandedBold ${getTextVariantStyle(textVariant)}`}>
        {title}
      </Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

export default CustomButton;