import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  AnnotationsListResponse,
  CreateAnnotationPayload,
  CreateAnnotationResponse,
  DeleteAnnotationResponse,
  createAnnotation,
  deleteAnnotation,
  fetchAnnotations,
} from '@/services/annotations.service';
import { NormalizedApiError } from '@/services/api';

const annotationsKey = ['annotations'];

export type UseAnnotationsResult = {
  annotationsQuery: UseQueryResult<AnnotationsListResponse, NormalizedApiError>;
  createAnnotationMutation: UseMutationResult<
    CreateAnnotationResponse,
    NormalizedApiError,
    CreateAnnotationPayload
  >;
  deleteAnnotationMutation: UseMutationResult<
    DeleteAnnotationResponse,
    NormalizedApiError,
    string
  >;
};

export const useAnnotations = (): UseAnnotationsResult => {
  const queryClient = useQueryClient();

  const annotationsQuery = useQuery<AnnotationsListResponse, NormalizedApiError>({
    queryKey: annotationsKey,
    queryFn: fetchAnnotations,
  });

  const createAnnotationMutation = useMutation<
    CreateAnnotationResponse,
    NormalizedApiError,
    CreateAnnotationPayload
  >({
    mutationFn: createAnnotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: annotationsKey });
    },
  });

  const deleteAnnotationMutation = useMutation<
    DeleteAnnotationResponse,
    NormalizedApiError,
    string
  >({
    mutationFn: (id: string) => deleteAnnotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: annotationsKey });
    },
  });

  return {
    annotationsQuery,
    createAnnotationMutation,
    deleteAnnotationMutation,
  };
};

export default useAnnotations;
