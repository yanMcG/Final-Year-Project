import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';

import { db } from '../../../firebase/firebase';
import styles from './wokroutInProgressStyles';
import { useDarkMode } from '../../../context/DarkModeContext';



export default function WorkoutInProgress({ route, navigation }) {
  const { colors, isDarkMode } = useDarkMode();
  // If no exercises are passed via route params, use default exercises
  const defaultExercises = [
    { id: 1, name: 'Barbell Bench Press', sets: 1 },
    { id: 2, name: 'Barbell Squat', sets: 1 },
    { id: 3, name: 'Pull Up', sets: 1 },
  ];

  // Get exercises from route params or use defaults
  const exercises = route?.params?.exercises ?? defaultExercises;
  const workoutTitle = 'Full Body';

  // Initialize reps and weight state keyed by "exerciseId_setIndex"
  // so each set row has its own independent value
  const initialReps = exercises.reduce((acc, ex) => {
    Array.from({ length: ex.sets || 1 }).forEach((_, i) => {
      acc[`${ex.id}_${i}`] = '';
    });
    return acc;
  }, {});
  const initialWeights = exercises.reduce((acc, ex) => {
    Array.from({ length: ex.sets || 1 }).forEach((_, i) => {
      acc[`${ex.id}_${i}`] = '';
    });
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



  // Handle changes to reps input — keyed by "exerciseId_setIndex"
  const handleChange = (exId, setIdx, value) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    setReps((prev) => ({ ...prev, [`${exId}_${setIdx}`]: sanitized }));
  };

  // Handle changes to weight input — keyed by "exerciseId_setIndex"
  const handleWeightChange = (exId, setIdx, value) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    setWeights((prev) => ({ ...prev, [`${exId}_${setIdx}`]: sanitized }));
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

    // Prepare workout data — each exercise stores an array of per-set results
    const results = exercises.map((ex) => ({
      name: ex.name,
      sets: ex.sets,
      // Build one entry per set so each set's weight/reps is stored independently
      setData: Array.from({ length: ex.sets || 1 }).map((_, i) => ({
        set: i + 1,
        reps: reps[`${ex.id}_${i}`] === '' ? 0 : parseInt(reps[`${ex.id}_${i}`], 10),
        weight: weights[`${ex.id}_${i}`] === '' ? 0 : parseFloat(weights[`${ex.id}_${i}`]),
      })),
      // Top-level reps/weight kept for backwards compatibility with ViewPreviousWorkout
      reps: reps[`${ex.id}_0`] === '' ? 0 : parseInt(reps[`${ex.id}_0`], 10),
      weight: weights[`${ex.id}_0`] === '' ? 0 : parseFloat(weights[`${ex.id}_0`]),
    }));

    // simple validation: at least one rep entered across any set
    const anyEntered = results.some((r) => r.setData.some((s) => s.reps > 0));
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Dark Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workoutTitle}</Text>
      </View>

      {/* Timer and Discard Row */}
      <View style={[styles.timerRow, { backgroundColor: colors.background }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="time-outline" size={20} color={colors.text} />
          <Text style={[styles.timerText, { color: colors.text }]}>{formatTime(elapsed)}</Text>
        </View>
        <TouchableOpacity onPress={() => {
          Alert.alert('Discard Workout', 'Are you sure you want to discard this workout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          ]);
        }}>
          <Ionicons name="trash-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        {/* Exercise Cards */}
        {exercises.map((ex) => (
          <View key={ex.id} style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.exerciseName, { color: colors.text }]}>{ex.name}</Text>
            <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { color: colors.subText }]}>set</Text>
              <Text style={[styles.tableHeader, { color: colors.subText }]}>weight</Text>
              <Text style={[styles.tableHeader, { color: colors.subText }]}>reps</Text>
            </View>
            {/* One row per set */}
            {Array.from({ length: ex.sets || 1 }).map((_, setIdx) => (
              <View key={setIdx} style={styles.tableRow}>
                <Text style={[styles.tableCell, { color: colors.text }]}>{setIdx + 1}</Text>
                <View style={styles.tableCellInput}>
                  <TextInput
                    style={[styles.cellInput, { color: colors.text, borderBottomColor: colors.inputBorder }]}
                    keyboardType="numeric"
                    value={weights[`${ex.id}_${setIdx}`]}
                    onChangeText={(text) => handleWeightChange(ex.id, setIdx, text)}
                    placeholder="0"
                    placeholderTextColor={colors.subText}
                    maxLength={5}
                    editable={!workoutEnded}
                  />
                  <Text style={[styles.cellUnit, { color: colors.subText }]}>kg</Text>
                </View>
                <TextInput
                  style={[styles.cellInput, { color: colors.text, borderBottomColor: colors.inputBorder }]}
                  keyboardType="numeric"
                  value={reps[`${ex.id}_${setIdx}`]}
                  onChangeText={(text) => handleChange(ex.id, setIdx, text)}
                  placeholder="0"
                  placeholderTextColor={colors.subText}
                  maxLength={3}
                  editable={!workoutEnded}
                />
              </View>
            ))}
          </View>
        ))}

        {/* Finish Workout Button */}
        {!workoutEnded && (
          <TouchableOpacity style={[styles.finishButton, { backgroundColor: isDarkMode ? '#fff' : '#232526' }]} onPress={handleEndWorkout} disabled={saving}>
            <Text style={[styles.finishButtonText, { color: isDarkMode ? '#232526' : '#fff' }]}>{saving ? 'Saving...' : 'Finish Workout'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}