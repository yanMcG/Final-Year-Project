import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import globalStyles from '../../globalStyles';


//predefined data that the user can see
let sampleWorkouts = [
  {
    id: 1,
    date: '2023-10-01',
    type: 'Full Body',
    duration: '45 min',
    exercises: [
      { id: 1, name: 'Barbell Bench Press', sets: 1, reps: 10 },
      { id: 2, name: 'Barbell Squat', sets: 1, reps: 12 },
      { id: 3, name: 'Pull Up', sets: 1, reps: 8 },
    ],
  },
  {
    id: 2,
    date: '2023-10-02',
    type: 'Full Body',
    duration: '30 min',
    exercises: [
      { id: 1, name: 'Barbell Bench Press', sets: 1, reps: 8 },
      { id: 2, name: 'Barbell Squat', sets: 1, reps: 10 },
      { id: 3, name: 'Pull Up', sets: 1, reps: 6 },
    ],
  },
  { id: 3, date: '2023-10-03', type: 'Full Body', duration: '40 min' }
];

// Determine if we can use SQLite based on the platform. Expo SQLite is not supported on web, so we'll use sample data there.
let useSQLite = Platform.OS !== 'web';

// If we're on a platform that supports SQLite, set it up. Otherwise, we'll just use the sample data.
let SQLite, db;
if (useSQLite) {
  SQLite = require('expo-sqlite');
  db = SQLite.openDatabase('workouts.db');
}


// Initialize the database and load workouts. If SQLite is not available, use sample data.
function initializeDatabase(setWorkouts, setLoading, setError) {
  if (!useSQLite) {
    setWorkouts(sampleWorkouts);
    setLoading(false);
    return;
  }
  db.transaction((tx) => {
    // Create workouts table
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, type TEXT, duration TEXT);'
    );
    // Create exercises table
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, workout_id INTEGER, name TEXT, sets INTEGER, reps INTEGER, FOREIGN KEY(workout_id) REFERENCES workouts(id));'
    );
    // Fetch all workouts
    tx.executeSql(
      'SELECT * FROM workouts ORDER BY id DESC;',
      [],
      (_, { rows }) => {
        const workouts = rows._array;
        if (workouts.length === 0) {
          setWorkouts([]);
          setLoading(false);
          return;
        }
        // Fetch all exercises for these workouts
        const workoutIds = workouts.map(w => w.id);
        if (workoutIds.length === 0) {
          setWorkouts([]);
          setLoading(false);
          return;
        }
        tx.executeSql(
          `SELECT * FROM exercises WHERE workout_id IN (${workoutIds.map(() => '?').join(',')});`,
          workoutIds,
          (_, { rows: exRows }) => {
            const exercisesByWorkout = {};
            exRows._array.forEach(ex => {
              if (!exercisesByWorkout[ex.workout_id]) exercisesByWorkout[ex.workout_id] = [];
              exercisesByWorkout[ex.workout_id].push(ex);
            });
            // Attach exercises to workouts
            const workoutsWithExercises = workouts.map(w => ({ ...w, exercises: exercisesByWorkout[w.id] || [] }));
            setWorkouts(workoutsWithExercises);
            setLoading(false);
          },
          (_, error) => {
            setError('Failed to load exercises.');
            setLoading(false);
            return true;
          }
        );
      },
      (_, error) => {
        setError('Failed to load workouts.');
        setLoading(false);
        return true;
      }
    );
  });
}

export default function PreviousWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeDatabase(setWorkouts, setLoading, setError);
  }, []);

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Previous Workouts</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Previous Workouts</Text>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Previous Workouts</Text>
      {workouts.length === 0 ? (
        <Text>No workouts found.</Text>
      ) : (
        <ScrollView style={styles.workoutList}>
          {workouts.map((workout) => (
            <View key={workout.id} style={styles.workoutItem}>
              <Text style={styles.workoutDate}>{workout.date || 'No date'}</Text>
              <Text style={styles.workoutType}>{workout.type || 'No type'}</Text>
              <Text style={styles.workoutDuration}>{workout.duration || 'No duration'}</Text>
              {workout.exercises && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Exercises:</Text>
                  {workout.exercises.map((ex) => (
                    <Text key={ex.id} style={{ marginLeft: 10 }}>
                      {ex.name} - Sets: {ex.sets}, Reps: {ex.reps}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  workoutList: {
    flex: 1,
  },
  workoutItem: {
    ...globalStyles.card,
    padding: 15,
    borderRadius: 10,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  workoutType: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#666',
  },
});
