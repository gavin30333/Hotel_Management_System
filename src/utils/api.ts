const API_BASE_URL = 'http://localhost:3001/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  skipAuthRedirect?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  page?: number;
  pageSize?: number;
}

class ApiError extends Error {
  status: number;
  code?: string;
  
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

const getToken = (): string | null => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.token;
    } catch {
      return null;
    }
  }
  return null;
};

const clearAuth = (): void => {
  localStorage.removeItem('currentUser');
};

const redirectToLogin = (): void => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/register') {
      window.location.href = '/login';
    }
  }
};

const getErrorMessage = (status: number, message?: string): string => {
  const errorMessages: Record<number, string> = {
    400: '请求参数错误',
    401: '登录已过期，请重新登录',
    403: '没有权限执行此操作',
    404: '请求的资源不存在',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务暂时不可用',
    504: '网关超时',
  };
  
  return message || errorMessages[status] || `请求失败 (${status})`;
};

const request = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', body, headers = {}, skipAuthRedirect = false } = options;

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  headers['Content-Type'] = 'application/json';

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new ApiError(
        getErrorMessage(response.status, data.message),
        response.status,
        data.code
      );

      // 401 未授权，清除登录状态并跳转
      if (response.status === 401 && !skipAuthRedirect) {
        clearAuth();
        redirectToLogin();
      }

      throw error;
    }

    return data;
  } catch (error: any) {
    // 网络错误
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new ApiError('网络连接失败，请检查网络', 0, 'NETWORK_ERROR');
    }
    throw error;
  }
};

export const authApi = {
  login: (username: string, password: string) =>
    request('/auth/login', { 
      method: 'POST', 
      body: { username, password },
      skipAuthRedirect: true,
    }),

  register: (username: string, password: string, role?: string) =>
    request('/auth/register', { 
      method: 'POST', 
      body: { username, password, role },
      skipAuthRedirect: true,
    }),

  getProfile: () => request('/auth/profile'),

  updateProfile: (username: string) =>
    request('/auth/profile', { method: 'PUT', body: { username } }),

  changePassword: (oldPassword: string, newPassword: string) =>
    request('/auth/password', { method: 'PUT', body: { oldPassword, newPassword } }),

  logout: () => {
    clearAuth();
    redirectToLogin();
  },
};

export const hotelApi = {
  getList: (params: {
    page?: number;
    pageSize?: number;
    status?: string;
    starRating?: string;
    keyword?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.status) query.set('status', params.status);
    if (params.starRating) query.set('starRating', params.starRating);
    if (params.keyword) query.set('keyword', params.keyword);
    return request(`/hotels?${query.toString()}`);
  },

  getById: (id: string) => request(`/hotels/${id}`),

  create: (data: any) =>
    request('/hotels', { method: 'POST', body: data }),

  update: (id: string, data: any) =>
    request(`/hotels/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request(`/hotels/${id}`, { method: 'DELETE' }),

  submitForAudit: (id: string) =>
    request(`/hotels/${id}/submit`, { method: 'PUT' }),

  audit: (id: string, passed: boolean, reason?: string) =>
    request(`/hotels/${id}/audit`, { method: 'PUT', body: { passed, reason } }),

  toggleOnline: (id: string) =>
    request(`/hotels/${id}/toggle`, { method: 'PUT' }),

  getStats: () => request('/hotels/stats'),
};

export const uploadApi = {
  uploadSingle: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/upload/single`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
        redirectToLogin();
      }
      throw new ApiError(data.message || '上传失败', response.status);
    }

    return data.data;
  },

  uploadMultiple: async (files: File[]): Promise<{ url: string }[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
        redirectToLogin();
      }
      throw new ApiError(data.message || '上传失败', response.status);
    }

    return data.data;
  },
};

// 工具函数
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getCurrentUser = (): any => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  return null;
};

export { ApiError };
export default { authApi, hotelApi, uploadApi, isAuthenticated, getCurrentUser };
