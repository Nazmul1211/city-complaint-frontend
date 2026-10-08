import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAllCategories, getCategoryById } from "@/api";

export function useGetCategories(departmentId?: string) {
  return useQuery({
    queryKey: ["categories", departmentId],
    queryFn: () => getAllCategories(departmentId),
  });
}

export function useSuspenseGetCategories(departmentId?: string) {
  return useSuspenseQuery({
    queryKey: ["categories", departmentId],
    queryFn: () => getAllCategories(departmentId),
  });
}

export function useGetCategoryById(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
}
