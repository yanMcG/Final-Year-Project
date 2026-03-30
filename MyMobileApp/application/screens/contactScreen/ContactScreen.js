import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDarkMode } from '../../context/DarkModeContext';

// ─── Update these details with your own ───────────────────────────────────────
const CONTACT = {
  name: 'Ryan Mc Glynn',
  role: 'Computer Scientist',
  email: 'ryanmcglynnwork@gmail.com',
  phone: '+353 83 042 2366',
  github: 'https://github.com/yanMcG',
  linkedin: 'https://www.linkedin.com/in/ryan-mc-glynn-8a0a84254/',
  // Paste the direct link to your CV/resume (Google Drive, Dropbox, personal site, etc.)
  cvUrl: 'https://example.com/your-cv.pdf',
};
// ─────────────────────────────────────────────────────────────────────────────

const openLink = (url) => {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open URL: ${url}`);
      }
    })
    .catch(() => Alert.alert('Error', 'Failed to open link.'));
};

export default function ContactScreen({ navigation }) {
  const { colors, isDarkMode } = useDarkMode();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar & Name */}
        <View style={[styles.avatarCircle, { backgroundColor: isDarkMode ? '#444' : '#e8e8e8' }]}>
          <Ionicons name="person" size={64} color={isDarkMode ? '#ccc' : '#555'} />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{CONTACT.name}</Text>
        <Text style={[styles.role, { color: colors.subText }]}>{CONTACT.role}</Text>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Contact rows */}
        <ContactRow
          icon="mail-outline"
          label="Email"
          value={CONTACT.email}
          onPress={() => openLink(`mailto:${CONTACT.email}`)}
          colors={colors}
        />
        <ContactRow
          icon="call-outline"
          label="Phone"
          value={CONTACT.phone}
          onPress={() => openLink(`tel:${CONTACT.phone}`)}
          colors={colors}
        />
        <ContactRow
          icon="logo-github"
          label="GitHub"
          value={CONTACT.github}
          onPress={() => openLink(CONTACT.github)}
          colors={colors}
        />
        <ContactRow
          icon="logo-linkedin"
          label="LinkedIn"
          value={CONTACT.linkedin}
          onPress={() => openLink(CONTACT.linkedin)}
          colors={colors}
        />

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* CV / Resume Button */}
        <TouchableOpacity
          style={[styles.cvButton, { backgroundColor: isDarkMode ? '#fff' : '#1a1a1a' }]}
          onPress={() => openLink(CONTACT.cvUrl)}
          activeOpacity={0.85}
        >
          <Ionicons
            name="document-text-outline"
            size={22}
            color={isDarkMode ? '#1a1a1a' : '#fff'}
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.cvButtonText, { color: isDarkMode ? '#1a1a1a' : '#fff' }]}>
            View My CV / Resume
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Reusable row component ───────────────────────────────────────────────────
function ContactRow({ icon, label, value, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Ionicons name={icon} size={22} color={colors.subText} style={styles.rowIcon} />
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.subText }]}>{label}</Text>
        <Text style={[styles.rowValue, { color: colors.text }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.subText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingTop: 54,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 18,
    top: 54,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 30,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  role: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1.5,
    width: '100%',
    marginVertical: 18,
    borderRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  rowIcon: {
    marginRight: 14,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  cvButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 32,
    marginTop: 6,
  },
  cvButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
});
