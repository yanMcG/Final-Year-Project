import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function GymBuddy() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I'm your GYM Buddy! 💪 How can I help you today?", isBot: true },
    { id: 2, text: "I can help you with workout tips, form guidance, and motivation!", isBot: true },
  ]);
  const [inputText, setInputText] = useState('');

  const quickTips = [
    "What's a good warm-up routine?",
    "How many reps should I do?",
    "Best exercises for beginners?",
    "Motivate me!",
  ];

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: text,
      isBot: false,
    };

    let botResponse = "That's a great question! Keep pushing yourself! 💪";
    
    if (text.toLowerCase().includes('warm-up')) {
      botResponse = "Great warm-up: 5-10 min light cardio, dynamic stretches, and bodyweight movements like arm circles and leg swings! 🔥";
    } else if (text.toLowerCase().includes('reps')) {
      botResponse = "For beginners: 8-12 reps for strength, 12-15 for endurance. Listen to your body! 💪";
    } else if (text.toLowerCase().includes('beginner')) {
      botResponse = "Perfect beginner exercises: Push-ups, squats, planks, and walking! Start slow and build up gradually. You've got this! 🌟";
    } else if (text.toLowerCase().includes('motivate')) {
      botResponse = "You're stronger than you think! Every workout counts, every rep matters. Your future self will thank you! Let's go! 🚀💪";
    }

    const newBotMessage = {
      id: messages.length + 2,
      text: botResponse,
      isBot: true,
    };

    setMessages([...messages, newUserMessage, newBotMessage]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GYM Buddy 🤖💪</Text>
      
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
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 15,
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#34C759',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  botText: {
    color: '#fff',
  },
  userText: {
    color: '#fff',
  },
  quickTipsContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  quickTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  quickTipButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  quickTipText: {
    color: '#007AFF',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
