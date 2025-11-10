import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import  Chat from '@/components/Chat';
import '@/global.css';

export default function Index() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" translucent={false} />
      <SafeAreaView className="flex-1 bg-purple-600">
        <View className="flex-1">
          {/* Header */}
          <View className="px-6 pt-4 pb-6 bg-purple-600">
            <Text className="text-white text-4xl font-bold mb-2">✨ Gemini AI</Text>
            <Text className="text-purple-200 text-base">Tu asistente inteligente</Text>
          </View>
          
          {/* Chat Container */}
          <View className="flex-1 bg-white rounded-t-3xl shadow-2xl">
            <Chat />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}



