import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
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
            className={`ml-2 w-12 h-12 rounded-full items-center justify-center ${
              disabled || !text.trim()
                ? 'bg-gray-300'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg'
            }`}
          >
            <Text className="text-white text-xl font-bold">➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
