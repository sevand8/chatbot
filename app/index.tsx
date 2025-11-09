import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDTTrjgkTvLmdzYIVcKdA1OWW1qnIRkpXo';
const genAI = new GoogleGenerativeAI(API_KEY);

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(input);
      const response = await result.response;
      const botMessage = { role: 'bot', text: response.text() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Error: ' + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-4 px-4">
        <Text className="text-white text-2xl font-bold">Gemini Chat</Text>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 px-4 py-4">
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`mb-3 p-3 rounded-2xl max-w-[80%] ${
              msg.role === 'user'
                ? 'bg-blue-500 self-end'
                : 'bg-white self-start shadow-sm'
            }`}
          >
            <Text className={msg.role === 'user' ? 'text-white' : 'text-gray-800'}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View className="bg-white self-start p-3 rounded-2xl shadow-sm">
            <Text className="text-gray-400">Escribiendo...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View className="flex-row p-4 bg-white border-t border-gray-200">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-2"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={loading}
          className={`bg-blue-600 rounded-full w-12 h-12 items-center justify-center ${
            loading ? 'opacity-50' : ''
          }`}
        >
          <Text className="text-white text-xl">➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}