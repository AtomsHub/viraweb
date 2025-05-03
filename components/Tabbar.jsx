import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import TabBarButton from './TabBarButton';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { usePathname } from 'expo-router';

export function MyTabBar({ state, descriptors, navigation }) {
    const pathname = usePathname();
    const screenWidth = Dimensions.get('window').width;
    const tabBarWidth = Math.min(screenWidth - 80, 500);
    const buttonWidth = tabBarWidth / state.routes.length;
    
    const tabPositionX = useSharedValue(0);
    
    useEffect(() => {
        const currentIndex = state.routes.findIndex(route => 
            pathname.includes(route.name.toLowerCase())
        );
        if (currentIndex >= 0) {
            tabPositionX.value = withSpring(currentIndex * buttonWidth, { 
                damping: 15, 
                stiffness: 150 
            });
        }
    }, [pathname, state.routes]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: tabPositionX.value }],
        width: buttonWidth * 0.6,
    }));

    return (
        <View style={[styles.tabBarContainer, { width: tabBarWidth, height: 72 }]}>
            <Animated.View
                style={[
                    animatedStyle,
                    styles.tabIndicator,
                    { 
                        height: 48,
                        bottom: 12,
                        left: buttonWidth * 0.2,
                    }
                ]}
            />

            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel || options.title || route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    tabPositionX.value = withSpring(index * buttonWidth);
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                return (
                    <TabBarButton
                        key={route.name}
                        onPress={onPress}
                        isFocused={isFocused}
                        routeName={route.name}
                        activeColor="#DE4C73"
                        inactiveColor="#79A6AE"
                        label={label}
                        width={buttonWidth}
                        indicatorWidth={buttonWidth * 0.6}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: Platform.select({ ios: 30, android: 20, web: 20 }),
        flexDirection: 'row',
        backgroundColor: '#F2F9FA',
        borderRadius: 36,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    tabIndicator: {
        position: 'absolute',
        backgroundColor: '#DE4C73',
        borderRadius: 24,
    },
});