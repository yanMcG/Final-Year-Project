import React, { useState } from 'react';
import { db } from '../../../firebase/firebase';
// Now you can use Firebase services, e.g. Firestore, Auth, etc.
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from './wokroutInProgressStyles';

export default function WorkoutInProgress({ route, navigation }) {
  const defaultExercises = [
    { id: 1, name: 'Barbell Bench Press', sets: 1 },
    { id: 2, name: 'Barbell Squat', sets: 1 },
    { id: 3, name: 'Pull Up', sets: 1 },
  ];

  const exercises = route?.params?.exercises ?? defaultExercises;

  const initialReps = exercises.reduce((acc, ex) => {
    acc[ex.id] = '';
    return acc;
  }, {});

  const [reps, setReps] = useState(initialReps);

  const handleChange = (id, value) => {
    // allow only numbers
    const sanitized = value.replace(/[^0-9]/g, '');
    setReps((prev) => ({ ...prev, [id]: sanitized }));
  };

  const handleEndWorkout = async () => {
    const results = exercises.map((ex) => ({
      id: ex.id,
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

    // Save workout to a database
    try {
      let response = await fetch('https://example.com/api/saveworkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let data = await response.json();
      console.log('Workout saved successfully:', data);
      alert('Workout saved successfully!');
    } catch (error) {
      console.error('Error saving workout:', error);
    }

    // For now just show a summary alert and go back
    const summary = results.map((r) => `${r.name}: ${r.reps} reps`).join('\n');

    Alert.alert('Workout Results', summary, [
      { text: 'OK', onPress: () => navigation.navigate('Start Workout') },
    ]);
  };

  return (
    <View style={styles.container}>
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

        <TouchableOpacity style={styles.endButton} onPress={handleEndWorkout}>
          <Text style={styles.endButtonText}>Save & End Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}