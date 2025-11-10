import ChatInput from '@/components/ChatInput';
import '@/global.css';
import { PROMPT_SUGGESTIONS } from '@/lib/constants/PromptMessages';
import React, { useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

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

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
      
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
        text: '❌ Error: ' + ("No se pudo completar esta accion"),
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
            
            <View className="w-full px-2">
              <Text className="text-gray-700 font-semibold mb-3 text-center">
                Prueba estas preguntas:
              </Text>
              {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion)}
                  style={styles.suggestionCard}
                  className="p-4 rounded-2xl mb-3"
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
                style={msg.role === 'user' ? styles.userBubble : undefined}
                className={`max-w-[80%] p-4 rounded-3xl ${
                  msg.role === 'user'
                    ? 'rounded-br-sm'
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
              <LoadingDots />
            </View>
          </View>
        )}
      </ScrollView>

      <ChatInput onSend={sendMessage} disabled={loading} />
    </View>
  );
}

// Componente para los puntos animados
function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View className="flex-row space-x-2">
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionCard: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  userBubble: {
    backgroundColor: '#8B5CF6',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#A78BFA',
    borderRadius: 4,
    marginHorizontal: 2,
  },
});