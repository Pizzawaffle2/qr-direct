import useSWR from 'swr';
import {Team, TeamMember, TeamUsage } from '@/types/team';

interface UseTeamReturn {
  team: Team | null;
  members: TeamMember[];
  teamUsage: TeamUsage | null;
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

export function useTeam(slug?: string): UseTeamReturn {
  const { data, error, mutate } = useSWR(
    slug ? `/api/teams/${slug}` : '/api/teams/current',
    async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch team');
      return res.json();
    }
  );

  return {
    team: data?.team || null,
    members: data?.members || [],
    teamUsage: data?.usage || null,
    isLoading: !error && !data,
    error,
    mutate,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
