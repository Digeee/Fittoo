import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, MessageCircle, Heart, Share2, MoreHorizontal, Search } from 'lucide-react-native';
import Card from '../components/Card';
import Colors from '../constants/colors';
import { useUser } from '../contexts/UserContext';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastActive: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Alex Johnson',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'Just completed my first 5K run! Feeling amazing 🏃‍♂️💪 #RunningGoals',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop',
    likes: 24,
    comments: 8,
    timestamp: '2 hours ago',
    liked: false
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Miller',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: 'Morning yoga session done! Starting the day with positive energy ✨🧘‍♀️',
    likes: 42,
    comments: 12,
    timestamp: '4 hours ago',
    liked: true
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Mike Chen',
    userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    content: 'Hit a new PR at the gym today - 225lb bench press! 🔥💪 #StrengthTraining',
    likes: 67,
    comments: 15,
    timestamp: '6 hours ago',
    liked: false
  }
];

const mockFriends: Friend[] = [
  {
    id: 'friend1',
    name: 'Emma Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    status: 'online',
    lastActive: 'now'
  },
  {
    id: 'friend2',
    name: 'David Brown',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
    status: 'online',
    lastActive: '5 min ago'
  },
  {
    id: 'friend3',
    name: 'Lisa Garcia',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    status: 'offline',
    lastActive: '2 hours ago'
  }
];

export default function SocialScreen() {
  const { profile } = useUser();
  const [activeTab, setActiveTab] = useState<'feed' | 'friends'>('feed');
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const renderPost = ({ item }: { item: Post }) => (
    <Card style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreHorizontal size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleLike(item.id)}
        >
          <Heart 
            size={20} 
            color={item.liked ? Colors.error : Colors.textLight} 
            fill={item.liked ? Colors.error : 'none'} 
          />
          <Text style={[styles.actionText, item.liked && styles.likedText]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color={Colors.textLight} />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color={Colors.textLight} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderFriend = ({ item }: { item: Friend }) => (
    <Card style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <View style={styles.friendHeader}>
          <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
          <View style={styles.friendDetails}>
            <Text style={styles.friendName}>{item.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator, 
                { backgroundColor: item.status === 'online' ? Colors.success : Colors.textLight }
              ]} />
              <Text style={styles.statusText}>
                {item.status === 'online' ? 'Online' : `Active ${item.lastActive}`}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.messageButton}>
          <MessageCircle size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Social</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={24} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Users size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
            onPress={() => setActiveTab('feed')}
          >
            <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
              Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
            onPress={() => setActiveTab('friends')}
          >
            <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
              Friends
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'feed' ? (
            <>
              {/* Create Post Card */}
              <Card style={styles.createPostCard}>
                <View style={styles.createPostHeader}>
                  <Image 
                    source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} 
                    style={styles.currentUserAvatar} 
                  />
                  <TouchableOpacity style={styles.createPostInput}>
                    <Text style={styles.createPostPlaceholder}>
                      What's your fitness journey today?
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.postOptions}>
                  <TouchableOpacity style={styles.postOption}>
                    <Text style={styles.postOptionText}>📷 Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postOption}>
                    <Text style={styles.postOptionText}>📊 Workout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postOption}>
                    <Text style={styles.postOptionText}>🍎 Meal</Text>
                  </TouchableOpacity>
                </View>
              </Card>

              {/* Posts Feed */}
              <View style={styles.postsContainer}>
                {posts.map(post => (
                  <View key={post.id} style={styles.postWrapper}>
                    {renderPost({ item: post })}
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Friends Header */}
              <Card style={styles.friendsHeader}>
                <Text style={styles.friendsTitle}>Your Connections</Text>
                <Text style={styles.friendsCount}>{mockFriends.length} friends</Text>
              </Card>

              {/* Friends List */}
              <View style={styles.friendsContainer}>
                {mockFriends.map(friend => (
                  <View key={friend.id} style={styles.friendWrapper}>
                    {renderFriend({ item: friend })}
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: Colors.primary + '20',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  createPostCard: {
    marginBottom: 24,
    padding: 20,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  createPostInput: {
    flex: 1,
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  createPostPlaceholder: {
    color: Colors.textLight,
    fontSize: 14,
  },
  postOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  postOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.grayLight,
  },
  postOptionText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  postsContainer: {
    gap: 16,
  },
  postWrapper: {
    marginBottom: 16,
  },
  postCard: {
    padding: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textLight,
  },
  postContent: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  likedText: {
    color: Colors.error,
  },
  friendsHeader: {
    marginBottom: 24,
    padding: 20,
    alignItems: 'center',
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  friendsCount: {
    fontSize: 14,
    color: Colors.textLight,
  },
  friendsContainer: {
    gap: 16,
  },
  friendWrapper: {
    marginBottom: 16,
  },
  friendCard: {
    padding: 16,
  },
  friendInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendDetails: {
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
});