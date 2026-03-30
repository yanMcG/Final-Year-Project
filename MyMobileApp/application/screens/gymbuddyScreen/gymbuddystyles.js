import { StyleSheet } from 'react-native';

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Dark header matching the Routines page style
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
  // Feedback button strip below header
  feedbackBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignSelf: 'center',
  },
  feedbackButtonText: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  // Scrollable chat area
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  // Base bubble style
  messageContainer: {
    marginVertical: 5,
    padding: 14,
    borderRadius: 20,
    maxWidth: '78%',
  },
  // Bot bubble — medium grey with white text (matching image left side)
  botMessage: {
    backgroundColor: '#6b7280',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  // User bubble — light lavender-grey with dark text (matching image right side)
  userMessage: {
    backgroundColor: '#d1d5db',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  botText: {
    color: '#fff',
  },
  userText: {
    color: '#1f2937',
  },
  // Quick tips horizontal scroll
  quickTipsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  quickTipButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  quickTipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  // Bottom input bar
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 11,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 10,
  },
  // Icon-only send button (paper plane)
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
