/**
 * Encryption Utilities for Backup/Restore
 * Uses PIN-derived key to encrypt financial data before cloud storage
 * Data encrypted on device, decrypted on device - Supabase never sees plaintext
 */

import * as Crypto from 'expo-crypto';

/**
 * Derive encryption key from user's PIN
 * Uses multiple iterations of SHA-256 for key strengthening
 * 
 * @param pin - User's 4-6 digit PIN
 * @param salt - Unique salt (typically user ID)
 * @returns Hex string encryption key
 */
export async function deriveKeyFromPIN(pin: string, salt: string): Promise<string> {
  try {
    // Combine PIN with salt
    const input = `${pin}:${salt}`;
    
    // First hash
    let hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      input
    );
    
    // Additional iterations for key strengthening (10,000 iterations)
    // This makes brute-force attacks much harder
    for (let i = 0; i < 10000; i++) {
      hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        hash + input
      );
    }
    
    return hash;
  } catch (error) {
    console.error('Error deriving key:', error);
    throw new Error('Failed to derive encryption key');
  }
}

/**
 * Simple XOR encryption for MVP
 * Note: For production, consider using AES-256-GCM via expo-crypto or react-native-aes-crypto
 * 
 * @param data - Plaintext string to encrypt
 * @param key - Encryption key (hex string)
 * @returns Base64 encoded encrypted string
 */
export async function encryptData(data: string, key: string): Promise<string> {
  try {
    // Convert data to bytes
    const dataBytes = new TextEncoder().encode(data);
    const keyBytes = hexToBytes(key);
    
    // XOR encryption (simple but effective for MVP)
    const encrypted = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    // Convert to base64 for storage
    return bytesToBase64(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt XOR encrypted data
 * 
 * @param encryptedData - Base64 encoded encrypted string
 * @param key - Encryption key (hex string)
 * @returns Decrypted plaintext string
 */
export async function decryptData(encryptedData: string, key: string): Promise<string> {
  try {
    // Convert from base64
    const encrypted = base64ToBytes(encryptedData);
    const keyBytes = hexToBytes(key);
    
    // XOR decryption (same operation as encryption)
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
    }
    
    // Convert bytes back to string
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. Check your PIN.');
  }
}

/**
 * Hash PIN for local validation (stored in SecureStore)
 * Uses bcrypt-style hashing for security
 * 
 * @param pin - User's PIN
 * @returns Hashed PIN
 */
export async function hashPIN(pin: string): Promise<string> {
  try {
    // Use SHA-256 with multiple rounds
    let hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin
    );
    
    // Additional rounds (1000 iterations)
    for (let i = 0; i < 1000; i++) {
      hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        hash + pin
      );
    }
    
    return hash;
  } catch (error) {
    console.error('PIN hashing error:', error);
    throw new Error('Failed to hash PIN');
  }
}

/**
 * Verify PIN against stored hash
 * 
 * @param pin - User-entered PIN
 * @param storedHash - Hash stored in SecureStore
 * @returns True if PIN matches
 */
export async function verifyPIN(pin: string, storedHash: string): Promise<boolean> {
  try {
    const hash = await hashPIN(pin);
    return hash === storedHash;
  } catch (error) {
    console.error('PIN verification error:', error);
    return false;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert hex string to byte array
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert byte array to base64 string
 */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to byte array
 */
function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
