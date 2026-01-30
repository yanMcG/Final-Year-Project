import { StyleSheet } from 'react-native';
import globalStyles from '../../../globalStyles';

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    ...globalStyles.title,
    color: '#111',
    marginBottom: 12,
  },
  list: {
    flex: 1,
  },
  card: {
    ...globalStyles.card,
    padding: 16,
    borderRadius: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  exerciseInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#111',
  },
  input: {
    width: 80,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    backgroundColor: '#fafafa',
  },
  endButton: {
    ...globalStyles.button,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  endButtonText: {
    ...globalStyles.buttonText,
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#111',
    fontSize: 15,
  },
});

export default styles;
