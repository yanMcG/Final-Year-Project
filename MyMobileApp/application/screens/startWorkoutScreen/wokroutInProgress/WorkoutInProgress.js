import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
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

  // Initialize reps and weight state for each exercise using their IDs as keys
  const initialReps = exercises.reduce((acc, ex) => {
    acc[ex.id] = '';
    return acc;
  }, {});
  const initialWeights = exercises.reduce((acc, ex) => {
    acc[ex.id] = '';
    return acc;
  }, {});


  // State variables for reps, weight, timer, and workout status
  const [reps, setReps] = useState(initialReps);
  const [weights, setWeights] = useState(initialWeights);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [workoutEnded, setWorkoutEnded] = useState(false);
  const [saving, setSaving] = useState(false);
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

  // Handle changes to weight input, ensuring only numbers are allowed
  const handleWeightChange = (id, value) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    setWeights((prev) => ({ ...prev, [id]: sanitized }));
  };



  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };



  // When user presses "End Workout", I want to save the workout data to Firestore
  const handleEndWorkout = async () => {
    if (saving) return; // Prevent double-tap
    setSaving(true);

    // Stop the timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Prepare workout data to save - map exercises to include entered reps and weight
    const results = exercises.map((ex) => ({
      name: ex.name,
      sets: ex.sets,
      reps: reps[ex.id] === '' ? 0 : parseInt(reps[ex.id], 10),
      weight: weights[ex.id] === '' ? 0 : parseFloat(weights[ex.id]),
    }));

    // simple validation: at least one rep entered
    const anyEntered = results.some((r) => r.reps > 0);
    if (!anyEntered) {
      Alert.alert('No reps entered', 'Please enter reps for at least one exercise.');
      setSaving(false);
      return;
    }

    // Save workout to Firestore
    try {
      const docRef = await addDoc(collection(db, 'workouts'), {
        date: new Date().toString(),
        exercises: results,
        duration: elapsed, // in seconds
        workoutTitle: workoutTitle,
      });
      console.log('Workout saved with ID:', docRef.id);
      setWorkoutEnded(true);
      // Navigate immediately back to home page, then show success alert
      navigation.navigate('Previous Workouts');
      Alert.alert('Success', 'Workout saved successfully!');
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', `Failed to save workout: ${error.message}`);
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Dark Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workoutTitle}</Text>
      </View>

      {/* Timer and Discard Row */}
      <View style={styles.timerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="time-outline" size={20} color="#232526" />
          <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
        </View>
        <TouchableOpacity onPress={() => {
          Alert.alert('Discard Workout', 'Are you sure you want to discard this workout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          ]);
        }}>
          <Ionicons name="trash-outline" size={22} color="#232526" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        {/* Exercise Cards */}
        {exercises.map((ex) => (
          <View key={ex.id} style={styles.card}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <View style={styles.cardDivider} />
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>set</Text>
              <Text style={styles.tableHeader}>weight</Text>
              <Text style={styles.tableHeader}>reps</Text>
            </View>
            {/* One row per set */}
            {Array.from({ length: ex.sets || 1 }).map((_, setIdx) => (
              <View key={setIdx} style={styles.tableRow}>
                <Text style={styles.tableCell}>{setIdx + 1}</Text>
                <View style={styles.tableCellInput}>
                  <TextInput
                    style={styles.cellInput}
                    keyboardType="numeric"
                    value={weights[ex.id]}
                    onChangeText={(text) => handleWeightChange(ex.id, text)}
                    placeholder="0"
                    maxLength={5}
                    editable={!workoutEnded}
                  />
                  <Text style={styles.cellUnit}>kg</Text>
                </View>
                <TextInput
                  style={styles.cellInput}
                  keyboardType="numeric"
                  value={reps[ex.id]}
                  onChangeText={(text) => handleChange(ex.id, text)}
                  placeholder="0"
                  maxLength={3}
                  editable={!workoutEnded}
                />
              </View>
            ))}
          </View>
        ))}

        {/* Finish Workout Button */}
        {!workoutEnded && (
          <TouchableOpacity style={styles.finishButton} onPress={handleEndWorkout} disabled={saving}>
            <Text style={styles.finishButtonText}>{saving ? 'Saving...' : 'Finish Workout'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}