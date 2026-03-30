import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './gymbuddystyles';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useDarkMode } from '../../context/DarkModeContext';
/*
How it would work:

Fetch the user's workout data from Firestore (e.g., their last workout or workout history).
Format this data as a summary or structured text.
Send this summary as part of the user message (or as a system prompt) to the Ollama API, asking for feedback or analysis.
Display the AI-generated feedback in the chat.
Example Flow:

User presses a button Get Feedback on My Last Workout.
The app fetches the last workout from Firestore.
The app sends a message to Ollama like:
"Here is my last workout: [workout summary]. Please give me feedback, tips, or motivation based on this."
Ollama responds with personalized feedback.
What you need to implement:

A function to fetch the latest workout from Firestore.
A button in GymBuddy to trigger this.

*/
export default function GymBuddy({ openMenu }) {

  const { colors, isDarkMode } = useDarkMode();
  const scrollViewRef = useRef(null);

  // useState for chat messages, initialized with a welcome message from the bot
  let [messages, setMessages] = useState([
    { id: 1, text: "Hey! I'm your GYM Buddy! 💪 How can I help you today?", isBot: true },
    { id: 2, text: "I can help you with workout tips, form guidance, and motivation!", isBot: true },
  ]);


  // useState for input text and loading state
  let [inputText, setInputText] = useState('');
  let [isLoading, setIsLoading] = useState(false);
  let [latestWorkout, setLatestWorkout] = useState(null);


  // Ollama API Configuration to localhost
  let OLLAMA_API_URL = 'http://localhost:11434/api/chat';


  //installed model
  let OLLAMA_MODEL = 'gemma2:2b'; // or gemma2


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

      // If there's an error with the API call, log it and return a fallback response
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



  // Function to check if Ollama and the model are available
  async function checkOllamaAndModel() {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      const data = await response.json();
      const hasGemma = data.models.some(model => model.name === 'gemma2:2b');
      if (!hasGemma) {
        Alert.alert('Ollama is running, but the gemma2:2b model is not pulled. Please run: ollama pull gemma2:2b');
      }
      return hasGemma;
    } catch (e) {
      Alert.alert('Ollama is not running or not installed. Please install Ollama and run: ollama pull gemma2:2b');
      return false;
    }
  }




  // Function to fetch the latest workout from Firestore
  async function fetchLatestWorkout() {
    const querySnapshot = await getDocs(collection(db, 'workouts'));
    let latest = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!latest || new Date(data.date) > new Date(latest.date)) {
        latest = { id: doc.id, ...data };
      }
    });
    return latest;
  }



  // Button handler to get feedback on last workout
  let getFeedbackOnLastWorkout = async () => {
    setIsLoading(true);

    // Check Ollama/model
    const ollamaReady = await checkOllamaAndModel();
    if (!ollamaReady) {
      setIsLoading(false);
      return;
    }


    // Fetch latest workout
    const workout = await fetchLatestWorkout();
    setLatestWorkout(workout);
    if (!workout) {
      setMessages(prev => [...prev, { id: messages.length + 1, text: 'No workout data found.', isBot: true }]);
      setIsLoading(false);
      return;
    }


    // Format workout summary
    let summary = `Workout Title: ${workout.workoutTitle || 'N/A'}\nDate: ${workout.date || 'N/A'}\nDuration: ${workout.duration || 'N/A'} seconds\nExercises:`;
    if (Array.isArray(workout.exercises)) {
      summary += '\n' + workout.exercises.map(ex => `- ${ex.name}: ${ex.reps} reps, ${ex.sets} sets`).join('\n');
    }


    // Send to Ollama LLM context aware of workout data and ask for feedback
    let prompt = `Here is my last workout:\n${summary}\nPlease give me feedback, tips, or motivation based on this. you are a personal trainer and should provide feedback on the workout, suggest improvements, and motivate me to keep going!`;
    let botResponse = await callOllamaAPI(prompt);
    setMessages(prev => [...prev, { id: messages.length + 1, text: prompt, isBot: false }]);
    setMessages(prev => [...prev, { id: messages.length + 2, text: botResponse, isBot: true }]);
    setIsLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Dark "Gym Buddy" Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        {openMenu && (
          <TouchableOpacity style={{ position: 'absolute', left: 18, top: 50, zIndex: 10 }} onPress={openMenu}>
            <Ionicons name="menu" size={26} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>Gym Buddy</Text>
      </View>

      {/* Generate Report Button */}
      <View style={styles.feedbackBar}>
        <TouchableOpacity
          style={[styles.feedbackButton, { backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0' }]}
          onPress={getFeedbackOnLastWorkout}
          disabled={isLoading}
        >
          <Ionicons name="bar-chart-outline" size={16} color={isDarkMode ? '#aaa' : '#555'} />
          <Text style={[styles.feedbackButtonText, { color: isDarkMode ? '#ccc' : '#333' }]}>
            Generate Report from Last Workout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
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
            <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 4 }} />
            <Text style={[styles.messageText, styles.botText]}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Quick tip chips */}
      <View style={[styles.quickTipsContainer, { backgroundColor: colors.background }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickTips.map((tip, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickTipButton, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
              onPress={() => sendMessage(tip)}
            >
              <Text style={[styles.quickTipText, { color: colors.subText }]}>{tip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input bar */}
      <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.inputBg, color: colors.text }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="ask anything"
          placeholderTextColor={colors.subText}
          multiline
          onSubmitEditing={() => sendMessage(inputText)}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: isDarkMode ? '#fff' : '#1a1a1a' }]}
          onPress={() => sendMessage(inputText)}
          disabled={isLoading}
        >
          <Ionicons name="paper-plane-outline" size={19} color={isDarkMode ? '#1a1a1a' : '#fff'} />
        </TouchableOpacity>
      </View>

    </View>
  );
}



