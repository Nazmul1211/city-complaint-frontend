import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAllDepartments, getDepartmentById } from "@/api";

export function useGetDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
  });
}

export function useSuspenseGetDepartments() {
  return useSuspenseQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
  });
}

export function useGetDepartmentById(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });
}
