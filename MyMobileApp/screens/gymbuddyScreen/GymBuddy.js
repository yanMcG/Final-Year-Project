import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import styles from './gymbuddystyles';

export default function GymBuddy() {
  let [messages, setMessages] = useState([
    { id: 1, text: "Hey! I'm your GYM Buddy! 💪 How can I help you today?", isBot: true },
    { id: 2, text: "I can help you with workout tips, form guidance, and motivation!", isBot: true },
  ]);
  // useState for input text and loading state
  let [inputText, setInputText] = useState('');
  let [isLoading, setIsLoading] = useState(false);

  // Ollama API Configuration to localhost
  let OLLAMA_API_URL = 'http://localhost:11434/api/chat';

  //installed model
  let OLLAMA_MODEL = 'gemma2:2b';


  // Predefined quick tips/questions object
  let quickTips = [
    "What's a good warm-up routine?",
    "How many reps should I do?",
    "Best exercises for beginners?",
    "Motivate me!",
  ];


  // Function to call Ollama API that handles user messages and returns bot responses
  let callOllamaAPI = async (userMessage) => {
    try {
      //fetch request to Ollama API
      let response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //request body with model and messages
        body: JSON.stringify({
          // Specify the model and messages for the chat that i predefined already
          model: OLLAMA_MODEL,
          messages: [
            { 
              //System message to set the behavior of the assistant
              role: 'system',

              // Define the assistant's role and response style for training and context of chatbot
              content: 'You are a helpful and motivating gym buddy assistant. Provide concise, practical workout advice, form tips, and motivation. Keep responses short and energetic with emojis.',
            },
            {
              // User message containing the actual question or input from the user
              role: 'user',

              // Pass the user message received from the function parameter
              content: userMessage,
            },
          ],
          stream: false,
        }),
      });


      // Check if response is valid
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }
      let data = await response.json();

      // Return the content of the bot's message from the API response or a default message
      return data.message?.content || "I'm here to help! 💪";


    } catch (error) {
      console.error('Ollama API Error:', error);
      return getFallbackResponse(userMessage);
    }
  };


  // Function to provide fallback responses if Ollama API fails or is unreachable
  let getFallbackResponse = (text) => {
    let lowerText = text.toLowerCase();
    if (lowerText.includes('warm-up')) {
      return "Great warm-up: 5-10 min light cardio, dynamic stretches, and bodyweight movements like arm circles and leg swings! 🔥";
    } else if (lowerText.includes('reps')) {
      return "For beginners: 8-12 reps for strength, 12-15 for endurance. Listen to your body! 💪";
    } else if (lowerText.includes('beginner')) {
      return "Perfect beginner exercises: Push-ups, squats, planks, and walking! Start slow and build up gradually. You've got this! 🌟";
    } else if (lowerText.includes('motivate')) {
      return "You're stronger than you think! Every workout counts, every rep matters. Your future self will thank you! Let's go! 🚀💪";
    }
    return "That's a great question! Keep pushing yourself! 💪";
  };


  // Function to handle sending messages
  let sendMessage = async (text) => {
    // Prevent sending empty messages or if already loading
    if (!text.trim() || isLoading) return;


    // Add user message to chat
    let newUserMessage = {
      id: messages.length + 1,
      text: text,
      isBot: false,
    };

    // Update messages state with new user message
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);


    // Call Ollama API to get bot response
    let botResponse = await callOllamaAPI(text);


    // Add bot response to chat that we got from API
    let newBotMessage = {
      id: messages.length + 2,
      text: botResponse,
      isBot: true,
    };


    // Update messages state with new bot message
    setMessages(prev => [...prev, newBotMessage]);
    setIsLoading(false);
  };

  return (
    // Main container
    <View style={styles.container}>
      <Text style={styles.title}>GYM Buddy</Text>
      


      {/* Chat messages container */}
      <ScrollView style={styles.chatContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isBot ? styles.botMessage : styles.userMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isBot ? styles.botText : styles.userText,
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={[styles.messageContainer, styles.botMessage]}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={[styles.messageText, styles.botText]}>Thinking...</Text>
          </View>
        )}
      </ScrollView>





      {/* Quick questions container */}
      <View style={styles.quickTipsContainer}>
        <Text style={styles.quickTipsTitle}>Quick Questions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickTips.map((tip, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickTipButton}
              onPress={() => sendMessage(tip)}
            >
              <Text style={styles.quickTipText}>{tip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>





      {/* Input container for user messages */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask your GYM Buddy anything..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => sendMessage(inputText)}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



