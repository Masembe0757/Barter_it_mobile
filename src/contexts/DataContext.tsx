import React, {createContext, useContext, useState, ReactNode} from 'react';

interface Asset {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  category: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  condition: string;
  created_at: string;
  updated_at: string;
  views: number;
  status: string;
  barter_preferences?: string[];
  negotiable: boolean;
  delivery_available: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  asset_id?: string;
}

interface DataContextType {
  userAssets: Asset[];
  addUserAsset: (asset: Omit<Asset, 'id' | 'created_at' | 'updated_at' | 'views'>) => void;
  updateUserAsset: (id: string, asset: Partial<Asset>) => void;
  deleteUserAsset: (id: string) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  getConversation: (userId: string) => Message[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial dummy assets
const INITIAL_USER_ASSETS: Asset[] = [
  {
    id: 'ua1',
    title: 'MacBook Pro 2021',
    description: 'M1 Pro chip, 16GB RAM, 512GB SSD. Excellent condition.',
    owner_id: 'currentUser',
    category: 'Electronics',
    price: 5000000,
    currency: 'UGX',
    location: 'Kampala, Uganda',
    images: ['https://picsum.photos/400/400?random=20'],
    condition: 'Excellent',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    views: 45,
    status: 'active',
    barter_preferences: ['iPhone', 'Camera'],
    negotiable: true,
    delivery_available: true,
  },
  {
    id: 'ua2',
    title: 'iPad Pro 12.9"',
    description: '2022 model with M2 chip, 256GB, Space Gray.',
    owner_id: 'currentUser',
    category: 'Electronics',
    price: 3000000,
    currency: 'UGX',
    location: 'Kampala, Uganda',
    images: ['https://picsum.photos/400/400?random=21'],
    condition: 'Good',
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z',
    views: 23,
    status: 'active',
    negotiable: false,
    delivery_available: true,
  },
];

// Sample chat messages
const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender_id: 'user1',
    receiver_id: 'currentUser',
    content: 'Hi, is the iPhone still available?',
    timestamp: '2024-01-15T10:00:00Z',
    asset_id: '1',
  },
  {
    id: 'm2',
    sender_id: 'currentUser',
    receiver_id: 'user1',
    content: 'Yes, it is! Are you interested?',
    timestamp: '2024-01-15T10:05:00Z',
    asset_id: '1',
  },
  {
    id: 'm3',
    sender_id: 'user1',
    receiver_id: 'currentUser',
    content: 'Yes, can we negotiate the price?',
    timestamp: '2024-01-15T10:10:00Z',
    asset_id: '1',
  },
];

export const DataProvider = ({children}: {children: ReactNode}) => {
  const [userAssets, setUserAssets] = useState<Asset[]>(INITIAL_USER_ASSETS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const addUserAsset = (assetData: Omit<Asset, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: `ua${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      owner_id: 'currentUser',
    };
    setUserAssets(prev => [newAsset, ...prev]);
  };

  const updateUserAsset = (id: string, assetData: Partial<Asset>) => {
    setUserAssets(prev => prev.map(asset =>
      asset.id === id
        ? {...asset, ...assetData, updated_at: new Date().toISOString()}
        : asset
    ));
  };

  const deleteUserAsset = (id: string) => {
    setUserAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `m${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getConversation = (userId: string) => {
    return messages.filter(msg =>
      (msg.sender_id === userId && msg.receiver_id === 'currentUser') ||
      (msg.sender_id === 'currentUser' && msg.receiver_id === userId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  return (
    <DataContext.Provider value={{
      userAssets,
      addUserAsset,
      updateUserAsset,
      deleteUserAsset,
      messages,
      addMessage,
      getConversation,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};