import { View, Text, TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import { useState, useEffect } from 'react';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { getSupabaseClient } from '../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ShareInviteCardProps {
  userId: string;
  onRemindLater?: () => void;
}

/**
 * SHARE INVITE CARD
 * 
 * Positioned under Net Worth card on HomeScreen
 * Shows user's invite codes and ability to share with one tap
 * 
 * Features:
 * - Displays invites remaining (5/5, 4/5, etc.)
 * - Native share functionality (iOS share sheet)
 * - "Remind me later" to hide card temporarily
 * - Card disappears when 0 invites remain
 */
export default function ShareInviteCard({ userId, onRemindLater }: ShareInviteCardProps) {
  const [inviteCodes, setInviteCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  // Load user's invite codes
  useEffect(() => {
    loadInviteCodes();
  }, [userId]);

  const loadInviteCodes = async () => {
    try {
      setIsLoading(true);
      
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('invite_codes')
        .select('code, used_by_user_id')
        .eq('created_by_user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error loading invite codes:', error);
        return;
      }

      // Filter to only unused codes
      const unusedCodes = data?.filter(c => !c.used_by_user_id).map(c => c.code) || [];
      setInviteCodes(unusedCodes);
      
      console.log('🎟️ Loaded invite codes:', { total: data?.length, unused: unusedCodes.length });
    } catch (err) {
      console.error('❌ Error loading invite codes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (inviteCodes.length === 0) {
      Alert.alert('No Invites', 'You have no invite codes remaining.');
      return;
    }

    try {
      setIsSharing(true);
      
      // Get the first unused code
      const code = inviteCodes[0];
      
      const message = `Join me on Regent – exclusive net worth tracking for professionals.

Use my invite code: ${code}

Regent is invite-only during private beta.`;

      const result = await Share.share({
        message,
        title: 'Join Regent',
      });

      if (result.action === Share.sharedAction) {
        console.log('✅ Invite shared successfully');
        
        // Show success feedback
        Alert.alert(
          'Shared!',
          'Your invite code has been shared. When someone uses it, you\'ll have one less invite remaining.',
          [{ text: 'OK' }]
        );
      } else if (result.action === Share.dismissedAction) {
        console.log('❌ Share dismissed');
      }
    } catch (err) {
      console.error('❌ Error sharing:', err);
      Alert.alert('Error', 'Could not share invite code. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemindLater = async () => {
    if (onRemindLater) {
      onRemindLater();
    } else {
      // Default behavior: hide card for 24 hours
      await AsyncStorage.setItem('@regent_hide_invite_card_until', 
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      );
      Alert.alert('Reminder Set', 'We\'ll remind you tomorrow to share your invites.');
    }
  };

  // Don't show card if no invites remaining (only after loading completes)
  if (!isLoading && inviteCodes.length === 0) {
    return null;
  }

  const invitesRemaining = inviteCodes.length;

  return (
    <View style={styles.card}>
      {/* Header with scarcity badge */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Invite New Members</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {isLoading ? '...' : `${invitesRemaining} left`}
          </Text>
        </View>
      </View>

      {/* Value prop */}
      <Text style={styles.description}>
        Share your exclusive invite code. Your name will appear as their referrer.
      </Text>

      {/* Share button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        disabled={isSharing || isLoading}
        activeOpacity={0.7}
      >
        <Text style={styles.shareButtonText}>
          {isLoading ? 'Loading...' : isSharing ? 'Sharing...' : 'Share Invite'}
        </Text>
      </TouchableOpacity>

      {/* Remind later */}
      {onRemindLater && (
        <TouchableOpacity
          style={styles.remindButton}
          onPress={handleRemindLater}
          activeOpacity={0.6}
        >
          <Text style={styles.remindButtonText}>Remind me later</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerText: {
    fontSize: 15,
    color: Colors.mutedForeground,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.mutedForeground,
    letterSpacing: 0.2,
  },
  
  // Description
  description: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 21,
    marginBottom: Spacing.lg,
    letterSpacing: 0.05,
  },
  
  // Share button
  shareButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.foreground,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 15,
    color: Colors.foreground,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  
  // Remind later
  remindButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  remindButtonText: {
    fontSize: 13,
    color: Colors.mutedForeground,
    opacity: 0.5,
    letterSpacing: 0.1,
  },
});
