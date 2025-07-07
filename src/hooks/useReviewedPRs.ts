import axios from 'axios';
import { useState, useEffect } from 'react';

const GITHUB_API_BASE_URL = 'https://api.github.com';

export interface PullRequest {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  number: number;
  updated_at: string;
  state: string; // ステータス情報を追加
}

// GitHub APIから今週コメントまたはレビューしたPRを取得する関数
export async function fetchReviewedPRs(token: string): Promise<PullRequest[]> {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 7); // 1週間前の日付を計算

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios.get<{ items: PullRequest[] }>(
      `${GITHUB_API_BASE_URL}/search/issues`,
      {
        headers,
        params: {
          q: `involves:@me is:pr updated:>${sinceDate.toISOString()}`,
        },
      }
    );

    return response.data.items;
  } catch (error) {
    console.error('Error fetching reviewed PRs:', error);
    return [];
  }
}

export function useReviewedPRs(token: string) {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchPRs = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchReviewedPRs(token);
        setPrs(result);
      } catch (error) {
        console.error('Failed to fetch PRs:', error);
        setError('Failed to fetch PRs');
      } finally {
        setLoading(false);
      }
    };

    fetchPRs();
  }, [token]);

  return { prs, loading, error };
}