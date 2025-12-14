import api from './api';

export type Annotation = {
  id: string;
  timestamp: number;
  text: string;
};

export type CreateAnnotationPayload = {
  timestamp: number;
  text: string;
};

export type CreateAnnotationResponse = {
  annotation: Annotation;
};

export type DeleteAnnotationResponse = {
  id: string;
};

export type AnnotationsListResponse = {
  annotations: Annotation[];
};

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
