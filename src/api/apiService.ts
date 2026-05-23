const API_BASE_URL = 'http://localhost:3000/api';
const STORAGE_KEY_EVALUATIONS = 'viralwriter_evaluations';
const STORAGE_KEY_POLISH = 'viralwriter_polish';

interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

interface EvaluationRecord {
  id: string;
  content: string;
  platform: string;
  category: string;
  overallScore: number;
  result: any;
  createdAt: string;
}

interface PolishRecord {
  id: string;
  original: string;
  polished: string;
  style: string;
  platform: string;
  category: string;
  changes: any[];
  createdAt: string;
}

class ApiService {
  private useFallback = false;

  constructor() {
    this.checkBackendConnection();
  }

  private async checkBackendConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      this.useFallback = !response.ok;
    } catch {
      console.warn('Backend not available, using localStorage fallback');
      this.useFallback = true;
    }
    return !this.useFallback;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (this.useFallback) {
      throw new Error('Backend not available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      this.useFallback = true;
      throw error;
    }
  }

  // LocalStorage helpers
  private getLocalEvaluations(): EvaluationRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EVALUATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalEvaluations(evaluations: EvaluationRecord[]): void {
    localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(evaluations));
  }

  private getLocalPolish(): PolishRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_POLISH);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalPolish(polish: PolishRecord[]): void {
    localStorage.setItem(STORAGE_KEY_POLISH, JSON.stringify(polish));
  }

  // Save evaluation to backend or localStorage
  async saveEvaluation(
    content: string,
    platform: string,
    category: string,
    overallScore: number,
    result: any
  ): Promise<EvaluationRecord> {
    const record: EvaluationRecord = {
      id: Date.now().toString(),
      content,
      platform,
      category,
      overallScore,
      result,
      createdAt: new Date().toISOString(),
    };

    if (!this.useFallback) {
      try {
        const response = await this.request<{ id: string; createdAt: string }>(
          '/evaluation/history',
          {
            method: 'POST',
            body: JSON.stringify({
              content,
              platform,
              category,
              overallScore,
              result,
            }),
          }
        );

        if (response.code === 200 && response.data) {
          return {
            ...record,
            id: response.data.id,
            createdAt: response.data.createdAt || new Date().toISOString(),
          };
        }
      } catch {
        // Fall through to localStorage
      }
    }

    // Use localStorage as fallback
    const evaluations = this.getLocalEvaluations();
    evaluations.unshift(record);
    this.saveLocalEvaluations(evaluations);
    return record;
  }

  // Get evaluations from backend or localStorage
  async getEvaluations(page = 1, limit = 10): Promise<{
    evaluations: EvaluationRecord[];
    total: number;
  }> {
    if (!this.useFallback) {
      try {
        const response = await this.request<{
          evaluations: EvaluationRecord[];
          total: number;
        }>(`/evaluation/history?page=${page}&limit=${limit}`);

        if (response.code === 200 && response.data) {
          return response.data;
        }
      } catch {
        // Fall through to localStorage
      }
    }

    // Use localStorage as fallback
    const evaluations = this.getLocalEvaluations();
    const start = (page - 1) * limit;
    const paginated = evaluations.slice(start, start + limit);
    return {
      evaluations: paginated,
      total: evaluations.length,
    };
  }

  // Delete evaluation from backend or localStorage
  async deleteEvaluation(id: string): Promise<void> {
    if (!this.useFallback) {
      try {
        const response = await this.request(`/evaluation/history/${id}`, {
          method: 'DELETE',
        });

        if (response.code === 200) {
          return;
        }
      } catch {
        // Fall through to localStorage
      }
    }

    // Use localStorage as fallback
    const evaluations = this.getLocalEvaluations();
    const filtered = evaluations.filter((e) => e.id !== id);
    this.saveLocalEvaluations(filtered);
  }

  // Save polish to backend or localStorage
  async savePolish(
    original: string,
    polished: string,
    style: string,
    platform: string,
    category: string,
    changes: any[]
  ): Promise<PolishRecord> {
    const record: PolishRecord = {
      id: Date.now().toString(),
      original,
      polished,
      style,
      platform,
      category,
      changes,
      createdAt: new Date().toISOString(),
    };

    if (!this.useFallback) {
      try {
        const response = await this.request<{ id: string; createdAt: string }>(
          '/evaluation/polish',
          {
            method: 'POST',
            body: JSON.stringify({
              original,
              polished,
              style,
              platform,
              category,
              changes,
            }),
          }
        );

        if (response.code === 200 && response.data) {
          return {
            ...record,
            id: response.data.id,
            createdAt: response.data.createdAt || new Date().toISOString(),
          };
        }
      } catch {
        // Fall through to localStorage
      }
    }

    // Use localStorage as fallback
    const polishRecords = this.getLocalPolish();
    polishRecords.unshift(record);
    this.saveLocalPolish(polishRecords);
    return record;
  }

  // Get polish history from backend or localStorage
  async getPolishHistory(
    page = 1,
    limit = 10
  ): Promise<{ polishHistory: PolishRecord[]; total: number }> {
    if (!this.useFallback) {
      try {
        const response = await this.request<{
          polishHistory: PolishRecord[];
          total: number;
        }>(`/evaluation/polish?page=${page}&limit=${limit}`);

        if (response.code === 200 && response.data) {
          return response.data;
        }
      } catch {
        // Fall through to localStorage
      }
    }

    // Use localStorage as fallback
    const polishRecords = this.getLocalPolish();
    const start = (page - 1) * limit;
    const paginated = polishRecords.slice(start, start + limit);
    return {
      polishHistory: paginated,
      total: polishRecords.length,
    };
  }

  // Check if using backend
  isUsingBackend(): boolean {
    return !this.useFallback;
  }
}

export const apiService = new ApiService();
