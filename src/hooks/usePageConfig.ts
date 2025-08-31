import { useQuery } from '@tanstack/react-query';
import { getPageConfig } from '@/utils/wordpress';

export function usePageConfig(slug: string) {
  return useQuery({
    queryKey: ['page-config', slug],
    queryFn: () => getPageConfig(slug),
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
    enabled: !!slug
  });
}