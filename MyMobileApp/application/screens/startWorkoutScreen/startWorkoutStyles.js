import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Outer page wrapper
  container: {
    flex: 1,
  },
  // Dark gradient-style header
  header: {
    width: '100%',
    paddingTop: 54,
    paddingBottom: 22,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // Scrollable list area
  workoutList: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  // Individual workout card
  workoutCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  // Big workout title inside card
  workoutName: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  // Thin divider below title
  divider: {
    height: 1.5,
    width: '90%',
    marginBottom: 18,
  },
  // Each exercise label
  exerciseItem: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 4,
    letterSpacing: 0.2,
  },
  // Start button
  startButton: {
    marginTop: 24,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default styles;
