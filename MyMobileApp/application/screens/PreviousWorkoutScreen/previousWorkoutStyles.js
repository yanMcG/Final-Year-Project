import { StyleSheet } from 'react-native';
import globalStyles from '../../globalStyles';

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
  gradientHeader: {
    width: '100%',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#232526', // fallback for linear-gradient
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 38,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 28,
    color: '#3a3d42',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
  sectionUnderline: {
    height: 3,
    width: 120,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 18,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    marginVertical: 18,
    width: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
    color: '#232526',
    textAlign: 'center',
  },
  cardDivider: {
    height: 2,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginVertical: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  pill: {
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  pillLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'center',
  },
  pillValue: {
    fontSize: 16,
    color: '#232526',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exerciseText: {
    fontSize: 16,
    color: '#232526',
    marginVertical: 2,
    textAlign: 'center',
  },
  viewButton: {
    backgroundColor: '#232526',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
