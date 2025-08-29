import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <View style={[
      styles.container,
      message.isUser ? styles.userContainer : styles.botContainer
    ]}>
      <View style={[
        styles.bubble,
        message.isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.text,
          message.isUser ? styles.userText : styles.botText
        ]}>
          {message.text}
        </Text>
        
        <Text style={[
          styles.timestamp,
          message.isUser ? styles.userTimestamp : styles.botTimestamp
        ]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#8B5CF6',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  botTimestamp: {
    color: '#6B7280',
  },
});