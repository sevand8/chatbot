import React, { useState, useRef } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import ChatInput from '@/components/ChatInput';
import { PROMPT_SUGGESTIONS } from '@/lib/constants/PromptMessages';
import '@/global.css';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Debug: verificar que la API Key se está cargando
console.log('API Key cargada:', API_KEY ? 'Sí ✓' : 'No ✗');

interface Message {
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const payload = {
        contents: [
          {
            parts: [
              { text: text },
            ],
          },
        ],
      };

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY,
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error en la respuesta');
      }

      const content = data['candidates'][0]['content']['parts'][0]['text'];
      
      const botMessage: Message = {
        role: 'bot',
        text: content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'bot',
        text: '❌ Error: ' + (error.message || 'Verifica tu API key y conexión'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <View className="flex-1">
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-6xl mb-4">🤖</Text>
            <Text className="text-gray-800 text-2xl font-bold mb-2">¡Hola!</Text>
            <Text className="text-gray-500 text-center mb-6 px-4">
              Soy Gemini AI. Pregúntame lo que quieras
            </Text>
            
            {/* Sugerencias */}
            <View className="w-full px-2">
              <Text className="text-gray-700 font-semibold mb-3 text-center">
                Prueba estas preguntas:
              </Text>
              {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion)}
                  className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-2xl mb-3 border border-purple-200"
                >
                  <Text className="text-purple-700 font-medium">
                    💡 {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View
              key={index}
              className={`mb-4 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[80%] p-4 rounded-3xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 rounded-br-sm'
                    : 'bg-gray-100 rounded-bl-sm shadow-md'
                }`}
              >
                <Text
                  className={`text-base ${
                    msg.role === 'user' ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {msg.text}
                </Text>
                <Text
                  className={`text-xs mt-2 ${
                    msg.role === 'user' ? 'text-purple-200' : 'text-gray-400'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>
          ))
        )}

        {loading && (
          <View className="items-start mb-4">
            <View className="bg-gray-100 p-4 rounded-3xl rounded-bl-sm shadow-md">
              <View className="flex-row space-x-2">
                <View className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <View className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                <View className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <ChatInput onSend={sendMessage} disabled={loading} />
    </View>
  );
}
