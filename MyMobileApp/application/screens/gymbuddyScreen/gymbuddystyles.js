import { StyleSheet } from 'react-native';
import globalStyles from '../../globalStyles';

let styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    backgroundColor: '#f5f5f5',
  },
  title: {
    ...globalStyles.title,
    color: '#333',
    paddingTop: 20,
    paddingBottom: 10,
  },
  chatContainer: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 15,
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#34C759',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  botText: {
    color: '#fff',
  },
  userText: {
    color: '#fff',
  },
  quickTipsContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  quickTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  quickTipButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  quickTipText: {
    color: '#007AFF',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    ...globalStyles.button,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    ...globalStyles.buttonText,
    fontSize: 16,
  },
});

export default styles;
