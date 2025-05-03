import { PlatformPressable } from '@react-navigation/elements';
import React, { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text, StyleSheet } from 'react-native';

const TabBarButton = ({ 
    onPress, 
    isFocused, 
    routeName, 
    activeColor, 
    inactiveColor, 
    label, 
    width,
    indicatorWidth 
}) => {
    const icons = { 
        index: 'home', 
        task: 'check-square', 
        history: 'shopping-cart', 
        account: 'user' 
    };
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0);
    }, [isFocused]);

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: isFocused ? 0 : 1, // Make text completely transparent when active
        transform: [{ translateY: interpolate(scale.value, [0, 1], [0, 2]) }]
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.15]) }],
        backgroundColor: isFocused ? activeColor : 'transparent',
        marginTop: isFocused ? 10 : '',
        width: indicatorWidth,
        height: 48,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }));

    return (
        <PlatformPressable
            onPress={onPress}
            style={[styles.buttonContainer, { width }]}
            android_ripple={{ color: 'transparent' }}
        >
            <Animated.View style={animatedIconStyle}>
                <Feather 
                    name={icons[routeName] || 'help-circle'} 
                    size={24} 
                    color={isFocused ? "#fff" : inactiveColor} 
                />
            </Animated.View>
            
            <Animated.View style={[styles.labelContainer, animatedTextStyle]}>
                <Text style={[styles.labelText, { color: '#222' }]}>
                    {label}
                </Text>
            </Animated.View>
        </PlatformPressable>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // height: 72,
        paddingBottom: 8,
    },
    labelContainer: {
        marginTop: -8,
    },
    labelText: {
        fontSize: 12,
        fontFamily: 'Mona-Medium',
        includeFontPadding: false,
    },
});

export default TabBarButton;