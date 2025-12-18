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
