import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../constants';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Regent</Text>
        <Text style={styles.subtitle}>Home Screen - Coming Soon</Text>
        <Text style={styles.body}>
          This is a placeholder for the Home screen.{'\n\n'}
          Week 2 will build:{'\n'}
          • Net Worth Card{'\n'}
          • Assets List{'\n'}
          • Liabilities List{'\n'}
          • Add Asset/Liability buttons
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['2xl'],
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.h3,
    color: Colors.mutedForeground,
    marginBottom: Spacing.xl,
  },
  body: {
    ...Typography.body,
    color: Colors.foreground,
    lineHeight: 24,
  },
});
