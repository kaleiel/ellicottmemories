import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stockImages, textures } from './assets';
import { sponsoringBusinesses } from './businesses';

const getRandomBusiness = () => sponsoringBusinesses[Math.floor(Math.random() * sponsoringBusinesses.length)];

export interface Comment {
  id: string;
  user: string;
  text: string;
}

export interface Post {
  id: string;
  user: string;
  image: string;
  retroImage?: string;
  retroLocation?: string;
  recreatedLocation?: string;
  likes: number;
  comments: Comment[];
  description: string;
  isLiked?: boolean;
}

export interface User {
  username: string;
  contact: string; // email or phone
}

export interface Transaction {
  id: string;
  store: string;
  points: number;
  date: number;
}

export interface UserRewards {
  username: string;
  points: number;
  transactions: Transaction[];
}

type PageType = 'landing' | 'login' | 'feed' | 'submit' | 'wall' | 'rewards';

interface AppState {
  user: User | null;
  posts: Post[];
  wallOfFame: Post[];
  currentPage: PageType;
  userRewards: UserRewards | null;
  setCurrentPage: (page: PageType) => void;
  login: (username: string, contact: string) => void;
  logout: () => void;
  resetCache: () => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addPost: (image: string, description: string, retroImage?: string, retroLocation?: string, recreatedLocation?: string) => void;
}

// Dummy Data Initialization
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    user: 'HistoricFan22',
    retroImage: stockImages[2],
    image: stockImages[0],
    retroLocation: getRandomBusiness(),
    recreatedLocation: getRandomBusiness(),
    likes: 45,
    comments: [{ id: 'c1', user: 'SarahJ', text: 'Love the lighting in this one!' }],
    description: 'Morning mist over the bridge. #OldEllicottCity',
  },
  {
    id: '2',
    user: 'CoffeeLover',
    retroImage: textures[1],
    image: stockImages[3],
    retroLocation: getRandomBusiness(),
    recreatedLocation: getRandomBusiness(),
    likes: 28,
    comments: [],
    description: 'My favorite spot to write. The stone walls are so inspiring.',
  },
  {
    id: '3',
    user: 'RiverWalker',
    retroImage: textures[2],
    image: textures[3],
    retroLocation: getRandomBusiness(),
    recreatedLocation: getRandomBusiness(),
    likes: 12,
    comments: [],
    description: 'The colors of the river today were unmatched.',
  },
];

const WALL_OF_FAME: Post[] = [
  {
    id: 'w1',
    user: 'Winner_Sept',
    image: stockImages[1],
    likes: 150,
    comments: [],
    description: 'September Winner: The Old Mill',
  },
  {
    id: 'w2',
    user: 'Winner_Aug',
    image: stockImages[2],
    likes: 142,
    comments: [],
    description: 'August Winner: Main Street Sunset',
  },
  {
    id: 'w3',
    user: 'Winner_July',
    image: textures[0],
    likes: 130,
    comments: [],
    description: 'July Winner: Red Brick Textures',
  },
];

const generateUserRewards = (username: string): UserRewards => {
  const randomPoints = Math.floor(Math.random() * 401) + 100;
  const stores = [sponsoringBusinesses[Math.floor(Math.random() * sponsoringBusinesses.length)], 
                   sponsoringBusinesses[Math.floor(Math.random() * sponsoringBusinesses.length)],
                   sponsoringBusinesses[Math.floor(Math.random() * sponsoringBusinesses.length)]];
  
  const pointsPerStore = [
    Math.floor(randomPoints * 0.3),
    Math.floor(randomPoints * 0.35),
    Math.floor(randomPoints * 0.35)
  ];
  
  const transactions: Transaction[] = stores.map((store, idx) => ({
    id: Math.random().toString(),
    store,
    points: pointsPerStore[idx],
    date: Date.now() - (idx * 86400000)
  }));
  
  return { username, points: randomPoints, transactions };
};

export const useStore = create<AppState>((set) => ({
  user: null,
  posts: INITIAL_POSTS,
  wallOfFame: WALL_OF_FAME,
  currentPage: 'landing',
  userRewards: null,
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  login: (username, contact) => {
    const userData = { username, contact };
    localStorage.setItem('voting-app-user', JSON.stringify(userData));
    set({ user: userData, currentPage: 'feed', userRewards: generateUserRewards(username) });
  },
  logout: () => {
    localStorage.removeItem('voting-app-user');
    set({ user: null, posts: INITIAL_POSTS, currentPage: 'landing', userRewards: null });
  },
  resetCache: () => {
    localStorage.removeItem('voting-app-user');
    set({ user: null, posts: INITIAL_POSTS, currentPage: 'landing', userRewards: null });
  },
  
  toggleLike: (postId) => set((state) => {
    const post = state.posts.find(p => p.id === postId);
    if (post && post.user === state.user?.username) {
      return { posts: state.posts };
    }
    return {
      posts: state.posts.map((p) => 
        p.id === postId 
          ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
          : p
      )
    };
  }),
  
  addComment: (postId, text) => set((state) => ({
    posts: state.posts.map((p) =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id: Math.random().toString(), user: state.user?.username || 'Guest', text }] }
        : p
    )
  })),

  addPost: (image, description, retroImage, retroLocation, recreatedLocation) => set((state) => ({
    posts: [
      {
        id: Math.random().toString(),
        user: state.user?.username || 'Anonymous',
        image,
        retroImage,
        retroLocation,
        recreatedLocation,
        likes: 0,
        comments: [],
        description,
      },
      ...state.posts
    ]
  }))
}));

export const initializeStoreFromLocalStorage = () => {
  try {
    const storedUser = localStorage.getItem('voting-app-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser) as User;
      useStore.setState({ user: userData });
    }
  } catch (error) {
    console.error('Failed to load user from localStorage:', error);
    localStorage.removeItem('voting-app-user');
  }
};
