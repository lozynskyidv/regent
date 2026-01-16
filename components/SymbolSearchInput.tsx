/**
 * Symbol Search Input Component
 * 
 * Searchable dropdown for stocks, crypto, ETFs, and commodities.
 * Shows popular symbols with instant search filtering.
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { Symbol } from '../constants/PopularSymbols';

interface SymbolSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  symbols: Symbol[];
  style?: any;
}

export default function SymbolSearchInput({
  value,
  onChangeText,
  placeholder,
  symbols,
  style,
}: SymbolSearchInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSymbols, setFilteredSymbols] = useState<Symbol[]>([]);

  // Filter symbols based on search query
  useEffect(() => {
    if (!value || value.length === 0) {
      setFilteredSymbols(symbols.slice(0, 10)); // Show top 10 by default
      return;
    }

    const query = value.toUpperCase();
    const filtered = symbols.filter(
      symbol =>
        symbol.ticker.toUpperCase().includes(query) ||
        symbol.name.toUpperCase().includes(query)
    );
    setFilteredSymbols(filtered.slice(0, 20)); // Show top 20 matches
  }, [value, symbols]);

  const handleSelect = (symbol: Symbol) => {
    onChangeText(symbol.ticker);
    setShowDropdown(false);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          placeholderTextColor={Colors.mutedForeground}
          autoCapitalize="characters"
        />
        <Search size={18} color={Colors.mutedForeground} style={styles.searchIcon} />
      </View>

      {/* Dropdown */}
      {showDropdown && filteredSymbols.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredSymbols}
            keyExtractor={item => item.ticker}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.ticker}>{item.ticker}</Text>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDropdown(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingRight: 40,
    fontSize: 16,
    color: Colors.foreground,
    backgroundColor: Colors.background,
  },
  searchIcon: {
    position: 'absolute',
    right: Spacing.md,
    top: 15,
  },
  dropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1001,
  },
  list: {
    maxHeight: 250,
  },
  dropdownItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ticker: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  closeButton: {
    padding: Spacing.sm,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.muted,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
