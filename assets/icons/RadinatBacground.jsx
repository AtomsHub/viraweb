import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const RadialBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Base Background Color */}
      <View style={[styles.backgroundBase, { backgroundColor: '#cbe7eb' }]} />

      {/* Radial Gradients */}
      <LinearGradient
        colors={['#0000', '#b1dce3', '#0000']}
        locations={[0.52, 0.54, 0.59]}
        start={{ x: -0.333, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.gradient, styles.gradient1]}
      />
      <LinearGradient
        colors={['#0000', '#b1dce3', '#0000']}
        locations={[0.52, 0.54, 0.59]}
        start={{ x: 0.5, y: 1.333 }}
        end={{ x: 0.5, y: 0 }}
        style={[styles.gradient, styles.gradient2]}
      />
      <LinearGradient
        colors={['#0000', '#b1dce3', '#0000']}
        locations={[0.52, 0.54, 0.59]}
        start={{ x: 1.333, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={[styles.gradient, styles.gradient3]}
      />
      <LinearGradient
        colors={['#0000', '#b1dce3', '#0000']}
        locations={[0.52, 0.54, 0.59]}
        start={{ x: 0.5, y: -0.333 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.gradient, styles.gradient4]}
      />

      {/* Children (Content) */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient1: {
    transform: [{ translateX: -28 }, { translateY: 28 }], // Adjust based on your needs
  },
  gradient2: {
    transform: [{ translateX: 28 }, { translateY: -28 }], // Adjust based on your needs
  },
  gradient3: {
    transform: [{ translateX: 28 }, { translateY: 28 }], // Adjust based on your needs
  },
  gradient4: {
    transform: [{ translateX: -28 }, { translateY: -28 }], // Adjust based on your needs
  },
});

export default RadialBackground;