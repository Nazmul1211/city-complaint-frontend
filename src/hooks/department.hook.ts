import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  type CreateDepartmentPayload,
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  type UpdateDepartmentPayload,
  updateDepartment,
} from "@/api";

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

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDepartmentPayload;
    }) => updateDepartment(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", variables.id] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department", id] });
    },
  });
}
