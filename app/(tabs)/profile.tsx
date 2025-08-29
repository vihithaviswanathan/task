import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, LogOut, Settings, Bell, CircleHelp as HelpCircle } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from '@/components/AuthScreen';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', error.message);
            }
          }
        },
      ]
    );
  };

  if (!user) {
    return <AuthScreen />;
  }

  const menuItems = [
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences and configuration',
      onPress: () => Alert.alert('Settings', 'Settings screen coming soon!'),
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => Alert.alert('Notifications', 'Notification settings coming soon!'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Help', 'Support screen coming soon!'),
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <User color="white" size={40} />
          </View>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>
      </LinearGradient>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuIcon}>
              <item.icon color="#8B5CF6" size={24} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut color="#EF4444" size={24} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  email: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  signOutButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});