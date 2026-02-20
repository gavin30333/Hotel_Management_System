const API_BASE_URL = 'http://localhost:3001/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
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
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const getToken = (): string | null => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

const request = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', body, headers = {} } = options;

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || '请求失败', response.status);
  }

  return data;
};

export const authApi = {
  login: (username: string, password: string, role: string) =>
    request('/auth/login', { method: 'POST', body: { username, password, role } }),

  register: (username: string, password: string, role: string) =>
    request('/auth/register', { method: 'POST', body: { username, password, role } }),

  getProfile: () => request('/auth/profile'),

  updateProfile: (username: string) =>
    request('/auth/profile', { method: 'PUT', body: { username } }),

  changePassword: (oldPassword: string, newPassword: string) =>
    request('/auth/password', { method: 'PUT', body: { oldPassword, newPassword } }),
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
      throw new ApiError(data.message || '上传失败', response.status);
    }

    return data.data;
  },
};

export { ApiError };
export default { authApi, hotelApi, uploadApi };
