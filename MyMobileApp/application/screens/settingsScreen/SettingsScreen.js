import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useDarkMode } from '../../context/DarkModeContext';

export default function SettingsScreen({ navigation }) {
  const { isDarkMode, toggleDarkMode, colors } = useDarkMode();
  const [deleting, setDeleting] = useState(false);

  // Performs the actual deletion — called after user confirms
  const performDelete = async () => {
    try {
      setDeleting(true);
      const querySnapshot = await getDocs(collection(db, 'workouts'));
      console.log(`Deleting ${querySnapshot.size} workouts...`);

      if (querySnapshot.empty) {
        alert('No workout data to remove.');
        setDeleting(false);
        return;
      }

      // Delete each document individually — most reliable across web + native
      const deletePromises = querySnapshot.docs.map((d) =>
        deleteDoc(doc(db, 'workouts', d.id))
      );
      await Promise.all(deletePromises);

      console.log('All workouts deleted successfully.');
      setDeleting(false);
      alert('All workout data has been removed.');
      navigation.navigate('Previous Workouts');
    } catch (err) {
      console.error('Error removing data:', err);
      setDeleting(false);
      alert(`Failed to remove workout data: ${err.message}`);
    }
  };

  // On web, Alert.alert is unreliable — use window.confirm as fallback
  const handleRemoveAllData = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete ALL workout data? This cannot be undone.'
      );
      if (confirmed) performDelete();
    } else {
      Alert.alert(
        'Remove All Data',
        'Are you sure you want to delete all previous workout data? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete All', style: 'destructive', onPress: performDelete },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>  
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>  
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="settings" size={28} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Settings Options */}
      <View style={styles.content}>
        {/* Dark Mode Toggle */}
        <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>  
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={24} color={colors.text} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#ccc', true: '#4cd964' }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Remove All Data */}
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border, opacity: deleting ? 0.5 : 1 }]}
          onPress={handleRemoveAllData}
          disabled={deleting}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="trash-outline" size={24} color="#ff3b30" />
            <Text style={[styles.settingLabel, { color: '#ff3b30' }]}>
              {deleting ? 'Deleting...' : 'Remove All Workout Data'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.subText} />
        </TouchableOpacity>

        {/* App Info */}
        <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>  
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle-outline" size={24} color={colors.text} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>App Version</Text>
          </View>
          <Text style={{ color: colors.subText, fontSize: 15 }}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 18,
    top: 50,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 12,
  },
});
