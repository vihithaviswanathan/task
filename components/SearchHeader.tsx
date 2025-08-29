import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import VoiceButton from './VoiceButton';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  onVoiceCommand: (transcript: string) => void;
}

export default function SearchHeader({ onSearch, onVoiceCommand }: SearchHeaderProps) {
  const [searchText, setSearchText] = useState('');
  const { isListening, transcript, error, startListening, clearTranscript } = useVoiceRecognition();

  React.useEffect(() => {
    if (transcript && !isListening) {
      setSearchText(transcript);
      onVoiceCommand(transcript);
      clearTranscript();
    }
  }, [transcript, isListening]);

  const handleSearch = () => {
    if (searchText.trim()) {
      onSearch(searchText);
    }
  };

  const handleSubmitEditing = () => {
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#6B7280" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products or say 'Show me breakfast items under 200'"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="search"
            multiline={false}
          />
        </View>
        
        <VoiceButton
          isListening={isListening}
          onPress={startListening}
          size={48}
        />
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {isListening && (
        <Text style={styles.listeningText}>
          🎤 Listening... Try saying "Show me breakfast items under 200"
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  listeningText: {
    color: '#8B5CF6',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});