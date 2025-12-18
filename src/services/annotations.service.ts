import api from './api';
import type {
  CreateAnnotationPayload,
  CreateAnnotationResponse,
  DeleteAnnotationResponse,
  AnnotationsListResponse,
} from '@/types/annotation';
export type {
  Annotation,
  CreateAnnotationPayload,
  CreateAnnotationResponse,
  DeleteAnnotationResponse,
  AnnotationsListResponse,
} from '@/types/annotation';

export const fetchAnnotations = async (): Promise<AnnotationsListResponse> => {
  const response = await api.get<AnnotationsListResponse>('/annotations');
  return response.data;
};

export const createAnnotation = async (
  payload: CreateAnnotationPayload
): Promise<CreateAnnotationResponse> => {
  const response = await api.post<CreateAnnotationResponse>(
    '/annotations',
    payload
  );
  return response.data;
};

export const deleteAnnotation = async (
  id: string
): Promise<DeleteAnnotationResponse> => {
  const response = await api.delete<DeleteAnnotationResponse>('/annotations', {
    params: { id },
  });
  return response.data;
};

const annotationsService = {
  fetchAnnotations,
  createAnnotation,
  deleteAnnotation,
};

export default annotationsService;
