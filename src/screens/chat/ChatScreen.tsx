import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {useData} from '../../contexts/DataContext';
import moment from 'moment';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  asset_id?: string;
  isTyping?: boolean;
}

const ChatScreen = ({route, navigation}: any) => {
  const {userId = 'user1', userName = 'John Kamau', assetId, assetTitle, assetImage} = route.params || {};
  const {messages, addMessage, getConversation} = useData();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Load conversation with this user
    const conversation = getConversation(userId);
    setLocalMessages(conversation);

    // Set header title
    navigation.setOptions({
      headerTitle: userName,
    });
  }, [userId, messages]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (localMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [localMessages]);

  const simulateAutoReply = (messageContent: string) => {
    // Simulate typing indicator
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      // Generate contextual reply based on message content
      let replyContent = '';
      const lowerContent = messageContent.toLowerCase();

      if (lowerContent.includes('price') || lowerContent.includes('how much')) {
        replyContent = 'The price is negotiable. What would you offer for it?';
      } else if (lowerContent.includes('available') || lowerContent.includes('still have')) {
        replyContent = 'Yes, it\'s still available! Would you like to see more pictures?';
      } else if (lowerContent.includes('condition') || lowerContent.includes('quality')) {
        replyContent = 'It\'s in excellent condition, barely used. I can send you detailed photos if you\'re interested.';
      } else if (lowerContent.includes('meet') || lowerContent.includes('location')) {
        replyContent = 'We can meet at a public place in Kampala. When would be convenient for you?';
      } else if (lowerContent.includes('trade') || lowerContent.includes('barter')) {
        replyContent = 'I\'m open to trades. What do you have to offer?';
      } else if (lowerContent.includes('hello') || lowerContent.includes('hi')) {
        replyContent = `Hello! Thanks for your interest${assetTitle ? ` in the ${assetTitle}` : ''}. How can I help you?`;
      } else {
        const replies = [
          'That sounds good. Let me know if you have any other questions.',
          'Sure, I can work with that. When would you like to proceed?',
          'Thanks for your interest! Feel free to ask anything else.',
          'I understand. Let me know what works best for you.',
        ];
        replyContent = replies[Math.floor(Math.random() * replies.length)];
      }

      // Add the auto-reply
      addMessage({
        sender_id: userId,
        receiver_id: 'currentUser',
        content: replyContent,
        asset_id: assetId,
      });
    }, 1500 + Math.random() * 1500); // Random delay between 1.5-3 seconds
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    // Add user's message
    addMessage({
      sender_id: 'currentUser',
      receiver_id: userId,
      content: inputText.trim(),
      asset_id: assetId,
    });

    // Simulate auto-reply
    simulateAutoReply(inputText);

    // Clear input
    setInputText('');
  };

  const renderMessage = ({item}: {item: Message}) => {
    const isCurrentUser = item.sender_id === 'currentUser';

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.sentBubble : styles.receivedBubble,
          ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.sentText : styles.receivedText,
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.timestamp,
            isCurrentUser ? styles.sentTimestamp : styles.receivedTimestamp,
          ]}>
            {moment(item.timestamp).format('h:mm A')}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.receivedMessage]}>
        <View style={[styles.messageBubble, styles.receivedBubble, styles.typingBubble]}>
          <ActivityIndicator size="small" color="#666" />
          <Text style={styles.typingText}>typing...</Text>
        </View>
      </View>
    );
  };

  const renderAssetPreview = () => {
    if (!assetTitle || !assetId) return null;

    return (
      <TouchableOpacity
        style={styles.assetPreview}
        onPress={() => navigation.navigate('AssetDetails', {assetId})}>
        {assetImage && (
          <Image source={{uri: assetImage}} style={styles.assetImage} />
        )}
        <View style={styles.assetInfo}>
          <Text style={styles.assetTitle} numberOfLines={1}>{assetTitle}</Text>
          <Text style={styles.assetSubtitle}>Tap to view details</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>

        {renderAssetPreview()}

        <FlatList
          ref={flatListRef}
          data={localMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          ListFooterComponent={renderTypingIndicator}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline
            maxHeight={100}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}>
            <Icon
              name="send"
              size={24}
              color={inputText.trim() ? '#FF6B35' : '#ccc'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: '#FF6B35',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedTimestamp: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
    marginBottom: 90, // Space for tab bar
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  assetPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  assetImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  assetSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});

export default ChatScreen;
