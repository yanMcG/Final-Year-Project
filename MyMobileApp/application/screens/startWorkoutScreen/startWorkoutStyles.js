import { StyleSheet } from 'react-native';
import globalStyles from '../../globalStyles';

const styles = StyleSheet.create({
  workoutList: {
    flex: 1,
  },
  workoutCard: {
    ...globalStyles.card,
    padding: 20,
    borderRadius: 15,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workoutInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
});

export default styles;
