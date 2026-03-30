import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';

import { db } from '../../../firebase/firebase';
import styles from './wokroutInProgressStyles';



export default function WorkoutInProgress({ route, navigation }) {
  // If no exercises are passed via route params, use default exercises
  const defaultExercises = [
    { id: 1, name: 'Barbell Bench Press', sets: 1 },
    { id: 2, name: 'Barbell Squat', sets: 1 },
    { id: 3, name: 'Pull Up', sets: 1 },
  ];

  // Get exercises from route params or use defaults
  const exercises = route?.params?.exercises ?? defaultExercises;
  const workoutTitle = 'Full Body';

  // Initialize reps state for each exercise using their IDs as keys
  const initialReps = exercises.reduce((acc, ex) => {
    acc[ex.id] = '';
    return acc;
  }, {});


  // State variables for reps, timer, and workout status
  const [reps, setReps] = useState(initialReps);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [workoutEnded, setWorkoutEnded] = useState(false);
  const timerRef = useRef(null);



  // Live timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [startTime]);



  // Handle changes to reps input, ensuring only numbers are allowed
  const handleChange = (id, value) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    setReps((prev) => ({ ...prev, [id]: sanitized }));
  };



  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };



  // When user presses "End Workout", I want to save the workout data to Firestore
  const handleEndWorkout = async () => {
    // Stop the timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }


    // Prepare workout data to save - map exercises to include entered reps
    const results = exercises.map((ex) => ({
      name: ex.name,
      sets: ex.sets,
      reps: reps[ex.id] === '' ? 0 : parseInt(reps[ex.id], 10),
    }));


    // simple validation: at least one rep entered
    const anyEntered = results.some((r) => r.reps > 0);
    if (!anyEntered) {
      Alert.alert('No reps entered', 'Please enter reps for at least one exercise or press End Workout to cancel.');
      return;
    }


    // Save workout to Firestore
    try {
      // Add a new document with a generated ID to the 'workouts' collection
      const docRef = await addDoc(collection(db, 'workouts'), {
        date: new Date().toString(),
        exercises: results,
        duration: elapsed, // in seconds
        workoutTitle: workoutTitle,
      });
      console.log('Workout saved with ID:', docRef.id);
      Alert.alert('Success', 'Workout saved successfully!');
      navigation.navigate('Previous Workouts'); // Route immediately after save
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', `Failed to save workout: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Timer at the top */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <MaterialIcons name="timer" size={24} color="#007AFF" />
        <Text style={{ fontSize: 18, marginLeft: 6, fontWeight: 'bold' }}>{formatTime(elapsed)}</Text>
      </View>
      <Text style={styles.title}>Workout In Progress</Text>
      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 40 }}>
        {exercises.map((ex) => (
          <View key={ex.id} style={styles.card}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseInfo}>Sets: {ex.sets}</Text>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Reps completed</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={reps[ex.id]}
                onChangeText={(text) => handleChange(ex.id, text)}
                placeholder="0"
                maxLength={3}
              />
            </View>
          </View>
        ))}

        {!workoutEnded && (
          <TouchableOpacity style={styles.endButton} onPress={handleEndWorkout}>
            <Text style={styles.endButtonText}>Save & End Workout</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}