// API configuration and helper functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; path: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  count?: number;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  status: number;
  errors?: Array<{ msg: string; path: string }>;

  constructor(message: string, status: number, errors?: Array<{ msg: string; path: string }>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred',
      response.status,
      data.errors
    );
  }

  return data;
}

// Auth API functions
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'coach' | 'fan';
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'coach' | 'fan';
  avatar?: string;
  joinDate: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  trainingGoal?: 'Self-Defense' | 'Fitness' | 'Competition Preparation' | 'Professional Fighting';
  discipline?: 'MMA' | 'BJJ' | 'Muay Thai' | 'Boxing' | 'Karate' | 'Wrestling';
  weight?: string;
  height?: string;
  // Stats (returned as individual fields)
  predictionsMade?: number;
  trainingSessions?: number;
  accuracyRate?: number;
  daysActive?: number;
}

export interface ProfileUpdateData {
  name?: string;
  avatar?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  trainingGoal?: 'Self-Defense' | 'Fitness' | 'Competition Preparation' | 'Professional Fighting';
  discipline?: 'MMA' | 'BJJ' | 'Muay Thai' | 'Boxing' | 'Karate' | 'Wrestling';
  weight?: string;
  height?: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    }),

  register: (data: RegisterData) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  getMe: (token: string) =>
    apiRequest<{ user: UserData }>('/auth/me', {
      method: 'GET',
      token,
    }),

  updateProfile: (data: ProfileUpdateData, token: string) =>
    apiRequest<{ user: UserData }>('/auth/profile', {
      method: 'PUT',
      body: data,
      token,
    }),

  changePassword: (
    data: { currentPassword: string; newPassword: string },
    token: string
  ) =>
    apiRequest('/auth/password', {
      method: 'PUT',
      body: data,
      token,
    }),
};

// Fighter types
export interface Fighter {
  _id: string;
  url: string;
  name: string;
  nickname: string;
  wins: number;
  losses: number;
  draws: number;
  height: string;
  weight: string;
  reach: number | null;
  stance: string;
  dob: string | null;
  slpm: number;
  strikingAccuracy: number;
  sapm: number;
  strikingDefense: number;
  takedownAvg: number;
  takedownAccuracy: number;
  takedownDefense: number;
  submissionAvg: number;
}

export interface FightStats {
  _id: string;
  fightId: string;
  fighterName: string;
  fighterPosition: number;
  knockdowns: number;
  sigStrikes: { landed: number; attempted: number };
  sigStrikesPct: number;
  totalStrikes: { landed: number; attempted: number };
  takedowns: { landed: number; attempted: number };
  takedownPct: number;
  submissionAttempts: number;
  reversals: number;
  controlTime: string;
}

export interface FighterComparison {
  fighter1: {
    profile: Fighter;
    recentStats: FightStats[];
  };
  fighter2: {
    profile: Fighter;
    recentStats: FightStats[];
  };
}

// Fighter API functions
export const fighterApi = {
  getFighters: (page = 1, limit = 50) =>
    apiRequest<Fighter[]>(`/fighters?page=${page}&limit=${limit}`),

  getFighterById: (id: string) =>
    apiRequest<Fighter>(`/fighters/${id}`),

  getFighterByName: (name: string) =>
    apiRequest<Fighter>(`/fighters/name/${encodeURIComponent(name)}`),

  searchFighters: (query: string, limit = 20) =>
    apiRequest<Fighter[]>(`/fighters/search?q=${encodeURIComponent(query)}&limit=${limit}`),

  compareFighters: (fighter1: string, fighter2: string) =>
    apiRequest<FighterComparison>(`/fighters/compare?fighter1=${encodeURIComponent(fighter1)}&fighter2=${encodeURIComponent(fighter2)}`),

  getFighterStats: (id: string, limit = 20) =>
    apiRequest<{ fighter: Fighter; stats: FightStats[]; totalFights: number }>(
      `/fighters/${id}/stats?limit=${limit}`
    ),

  getTopFighters: (stat: string, limit = 10) =>
    apiRequest<Fighter[]>(`/fighters/top?stat=${stat}&limit=${limit}`),
};

// Event types
export interface Event {
  _id: string;
  url: string;
  eventId: string;
  name: string;
  date: string;
  location: string;
  status: 'upcoming' | 'completed';
}

export interface EventStats {
  totalEvents: number;
  upcomingCount: number;
  completedCount: number;
  latestEvent: Event | null;
  nextEvent: Event | null;
}

// Event API functions
export const eventApi = {
  getEvents: (page = 1, limit = 20, status?: 'upcoming' | 'completed') => {
    let url = `/events?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return apiRequest<Event[]>(url);
  },

  getEventById: (id: string) =>
    apiRequest<Event>(`/events/${id}`),

  getEventByEventId: (eventId: string) =>
    apiRequest<Event>(`/events/event/${eventId}`),

  getUpcomingEvents: (limit = 10) =>
    apiRequest<Event[]>(`/events/upcoming?limit=${limit}`),

  getRecentEvents: (limit = 10) =>
    apiRequest<Event[]>(`/events/recent?limit=${limit}`),

  searchEvents: (query: string, limit = 20) =>
    apiRequest<Event[]>(`/events/search?q=${encodeURIComponent(query)}&limit=${limit}`),

  getEventStats: () =>
    apiRequest<EventStats>('/events/stats'),

  getEventFights: (eventId: string) =>
    apiRequest<Array<{ fightId: string; fighters: FightStats[] }>>(`/events/${eventId}/fights`),
};

export { apiRequest, ApiError, API_BASE_URL };
