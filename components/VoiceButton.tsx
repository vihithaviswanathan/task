import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';

interface VoiceButtonProps {
  isListening: boolean;
  onPress: () => void;
  size?: number;
}

export default function VoiceButton({ isListening, onPress, size = 60 }: VoiceButtonProps) {
  const pulseAnimation = new Animated.Value(1);

  React.useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [isListening]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Animated.View
        style={[
          styles.button,
          {
            width: size,
            height: size,
            transform: [{ scale: pulseAnimation }],
            backgroundColor: isListening ? '#EF4444' : '#8B5CF6',
          },
        ]}
      >
        {isListening ? (
          <MicOff color="white" size={size * 0.4} />
        ) : (
          <Mic color="white" size={size * 0.4} />
        )}
      </Animated.View>
      
      {isListening && (
        <View style={styles.listeningIndicator}>
          <View style={styles.wave} />
          <View style={[styles.wave, styles.wave2]} />
          <View style={[styles.wave, styles.wave3]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  listeningIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  wave: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderRadius: 50,
    width: 80,
    height: 80,
    opacity: 0.6,
  },
  wave2: {
    width: 100,
    height: 100,
    animationDelay: '0.5s',
  },
  wave3: {
    width: 120,
    height: 120,
    animationDelay: '1s',
  },
});