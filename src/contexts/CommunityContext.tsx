import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  category: 'achievement' | 'question' | 'inspiration' | 'support';
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  userLevel: number;
  userMood?: string;
  isLiked?: boolean;
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  image: string;
  isJoined?: boolean;
  posts: Post[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  points: number;
  joinedAt: string;
  bio?: string;
  interests: string[];
  achievements: string[];
}

interface CommunityContextType {
  posts: Post[];
  groups: Group[];
  userProfile: UserProfile;
  loading: boolean;
  error: string | null;
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked'>) => Promise<void>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'isLiked'>) => Promise<void>;
  likeComment: (postId: string, commentId: string) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  createGroup: (group: Omit<Group, 'id' | 'members' | 'isJoined' | 'posts'>) => Promise<void>;
  getPostsByCategory: (category: Post['category']) => Post[];
  getPostsByTag: (tag: string) => Post[];
  searchPosts: (query: string) => Post[];
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'current-user',
    name: 'Você',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    level: 10,
    points: 1500,
    joinedAt: new Date().toISOString(),
    bio: 'Entusiasta do desenvolvimento pessoal',
    interests: ['Produtividade', 'Bem-estar', 'Tecnologia'],
    achievements: ['Primeiro Post', '10 Curtidas', 'Membro Ativo']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedPosts = localStorage.getItem('community_posts');
        const savedGroups = localStorage.getItem('community_groups');
        const savedUserProfile = localStorage.getItem('community_user_profile');

        if (savedPosts) {
          setPosts(JSON.parse(savedPosts));
        } else {
          // Initialize with sample posts
          const samplePosts: Post[] = [
            {
              id: '1',
              userId: '1',
              userName: 'Ana Silva',
              userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
              content: 'Acabei de completar meu desafio de 30 dias de meditação! 🎉 Nunca pensei que conseguiria manter a consistência, mas aqui estamos. Alguém mais está na jornada da meditação?',
              category: 'achievement',
              likes: 24,
              comments: [],
              timestamp: new Date().toISOString(),
              userLevel: 15,
              userMood: 'happy',
              tags: ['meditação', 'consistência', 'bem-estar']
            },
            {
              id: '2',
              userId: '2',
              userName: 'Carlos Santos',
              userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
              content: 'Alguém tem dicas para manter o foco durante longas sessões de estudo? Estou tendo dificuldade em manter a concentração por mais de 30 minutos.',
              category: 'question',
              likes: 12,
              comments: [],
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              userLevel: 8,
              userMood: 'neutral',
              tags: ['estudo', 'foco', 'produtividade']
            }
          ];
          setPosts(samplePosts);
        }

        if (savedGroups) {
          setGroups(JSON.parse(savedGroups));
        } else {
          // Initialize with sample groups
          const sampleGroups: Group[] = [
            {
              id: '1',
              name: 'Mindfulness & Meditação',
              description: 'Grupo para praticantes e interessados em mindfulness',
              members: 1240,
              category: 'Bem-estar',
              image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
              posts: []
            },
            {
              id: '2',
              name: 'Desenvolvimento Pessoal',
              description: 'Compartilhe sua jornada de crescimento',
              members: 890,
              category: 'Desenvolvimento',
              image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
              posts: []
            }
          ];
          setGroups(sampleGroups);
        }

        if (savedUserProfile) {
          setUserProfile(JSON.parse(savedUserProfile));
        }
      } catch (err) {
        console.error('Error loading community data:', err);
        setError('Erro ao carregar dados da comunidade');
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('community_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('community_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('community_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const addPost = async (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked'>) => {
    try {
      setLoading(true);
      const newPost: Post = {
        ...postData,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
        isLiked: false
      };

      setPosts(prev => [newPost, ...prev]);
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      setLoading(true);
      setPosts(prev => prev.map(post => 
        post.id === id ? { ...post, ...updates } : post
      ));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      setLoading(true);
      setPosts(prev => prev.filter(post => post.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (id: string) => {
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          };
        }
        return post;
      }));
    } catch (err) {
      setError('Erro ao curtir post');
      throw err;
    }
  };

  const addComment = async (postId: string, commentData: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'isLiked'>) => {
    try {
      setLoading(true);
      const newComment: Comment = {
        ...commentData,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false
      };

      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar comentário');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likeComment = async (postId: string, commentId: string) => {
    try {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                  isLiked: !comment.isLiked
                };
              }
              return comment;
            })
          };
        }
        return post;
      }));
    } catch (err) {
      setError('Erro ao curtir comentário');
      throw err;
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      setLoading(true);
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.isJoined ? group.members - 1 : group.members + 1,
            isJoined: !group.isJoined
          };
        }
        return group;
      }));
      setError(null);
    } catch (err) {
      setError('Erro ao entrar no grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveGroup = async (groupId: string) => {
    try {
      setLoading(true);
      setGroups(prev => prev.map(group => {
        if (group.id === groupId && group.isJoined) {
          return {
            ...group,
            members: group.members - 1,
            isJoined: false
          };
        }
        return group;
      }));
      setError(null);
    } catch (err) {
      setError('Erro ao sair do grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData: Omit<Group, 'id' | 'members' | 'isJoined' | 'posts'>) => {
    try {
      setLoading(true);
      const newGroup: Group = {
        ...groupData,
        id: uuidv4(),
        members: 1,
        isJoined: true,
        posts: []
      };

      setGroups(prev => [...prev, newGroup]);
      setError(null);
    } catch (err) {
      setError('Erro ao criar grupo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPostsByCategory = (category: Post['category']) => {
    return posts.filter(post => post.category === category);
  };

  const getPostsByTag = (tag: string) => {
    return posts.filter(post => post.tags.includes(tag));
  };

  const searchPosts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return posts.filter(post => 
      post.content.toLowerCase().includes(lowerQuery) ||
      post.userName.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setUserProfile(prev => ({ ...prev, ...updates }));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommunityContext.Provider value={{
      posts,
      groups,
      userProfile,
      loading,
      error,
      addPost,
      updatePost,
      deletePost,
      likePost,
      addComment,
      likeComment,
      joinGroup,
      leaveGroup,
      createGroup,
      getPostsByCategory,
      getPostsByTag,
      searchPosts,
      updateUserProfile
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};