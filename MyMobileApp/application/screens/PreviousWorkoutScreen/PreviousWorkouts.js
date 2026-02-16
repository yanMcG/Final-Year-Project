import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import globalStyles from '../../globalStyles';

let sampleWorkouts = [
  { id: 1, date: '2026-02-01', type: 'Full Body', duration: '45 min' },
  { id: 2, date: '2026-02-05', type: 'Cardio', duration: '30 min' },
  { id: 3, date: '2026-02-10', type: 'Upper Body', duration: '40 min' }
];

let useSQLite = Platform.OS !== 'web';
let SQLite, db;
if (useSQLite) {
  SQLite = require('expo-sqlite');
  db = SQLite.openDatabase('workouts.db');
}

function initializeDatabase(setWorkouts, setLoading, setError) {
  if (!useSQLite) {
    setWorkouts(sampleWorkouts);
    setLoading(false);
    return;
  }
  db.transaction((tx) => {
    // Create table if it doesn't exist
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, type TEXT, duration TEXT);'
    );
    // Check if table is empty
    tx.executeSql(
      'SELECT COUNT(*) as count FROM workouts;',
      [],
      (_, { rows }) => {
        if (rows._array[0].count === 0) {
          // Insert sample data
          tx.executeSql(
            'INSERT INTO workouts (date, type, duration) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?);',
            [
              '2026-02-01', 'Full Body', '45 min',
              '2026-02-05', 'Cardio', '30 min',
              '2026-02-10', 'Upper Body', '40 min'
            ],
            () => {
              // Fetch workouts after inserting sample data
              tx.executeSql(
                'SELECT * FROM workouts;',
                [],
                (_, { rows }) => {
                  setWorkouts(rows._array);
                  setLoading(false);
                },
                (_, error) => {
                  setError('Failed to load workouts.');
                  setLoading(false);
                  return true;
                }
              );
            }
          );
        } else {
          // Fetch workouts if table is not empty
          tx.executeSql(
            'SELECT * FROM workouts;',
            [],
            (_, { rows }) => {
              setWorkouts(rows._array);
              setLoading(false);
            },
            (_, error) => {
              setError('Failed to load workouts.');
              setLoading(false);
              return true;
            }
          );
        }
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
