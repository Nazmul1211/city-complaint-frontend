import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  type CreateCategoryPayload,
  createCategory,
  createCategorySla,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getCategorySla,
  type SlaPolicyPayload,
  type UpdateCategoryPayload,
  updateCategory,
  updateCategorySla,
} from "@/api";

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

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => updateCategory(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", id] });
    },
  });
}

export function useGetCategorySla(categoryId: string) {
  return useQuery({
    queryKey: ["sla", categoryId],
    queryFn: () => getCategorySla(categoryId),
    enabled: !!categoryId,
  });
}

export function useCreateCategorySla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: SlaPolicyPayload;
    }) => createCategorySla(categoryId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sla", variables.categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategorySla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: Partial<SlaPolicyPayload>;
    }) => updateCategorySla(categoryId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sla", variables.categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
