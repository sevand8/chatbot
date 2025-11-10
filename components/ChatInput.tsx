import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import '@/global.css';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <View className="flex-row items-center bg-gray-50 rounded-full px-4 py-2 shadow-sm">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-gray-800 text-base py-2"
            multiline
            maxLength={500}
            editable={!disabled}
            onSubmitEditing={handleSend}
          />
          
          <TouchableOpacity
            onPress={handleSend}
            disabled={disabled || !text.trim()}
            style={[
              styles.sendButton,
              (disabled || !text.trim()) ? styles.sendButtonDisabled : styles.sendButtonActive
            ]}
          >
            <Text className="text-white text-xl font-bold">➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  sendButton: {
    marginLeft: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendButtonActive: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});