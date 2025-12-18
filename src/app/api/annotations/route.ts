import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import type { Annotation } from '@/types/annotation';

const createId = (): string => randomUUID();
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = (): number => 500 + Math.floor(Math.random() * 301);

const annotations: Annotation[] = [];

const addAnnotation = (annotation: Annotation): Annotation => {
  annotations.push(annotation);
  return annotation;
};

const deleteAnnotationById = (id: string): Annotation | undefined => {
  const index = annotations.findIndex((item) => item.id === id);
  if (index === -1) {
    return undefined;
  }

  const [removed] = annotations.splice(index, 1);
  return removed;
};

const isValidTimestamp = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export async function GET(): Promise<NextResponse> {
  await delay(randomDelay());
  return NextResponse.json({ annotations });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const { timestamp, text } = body as Partial<Annotation>;

  if (!isValidTimestamp(timestamp)) {
    return NextResponse.json(
      { message: 'timestamp is required and must be a number (ms)' },
      { status: 400 }
    );
  }

  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json(
      { message: 'text is required and must be a non-empty string' },
      { status: 400 }
    );
  }

  const annotation: Annotation = {
    id: createId(),
    timestamp,
    text: text.trim(),
  };

  addAnnotation(annotation);

  await delay(randomDelay());
  return NextResponse.json({ annotation }, { status: 201 });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id')?.trim();

  if (!id) {
    return NextResponse.json(
      { message: 'id query parameter is required' },
      { status: 400 }
    );
  }

  const removed = deleteAnnotationById(id);
  if (!removed) {
    return NextResponse.json(
      { message: 'Annotation not found' },
      { status: 404 }
    );
  }

  await delay(randomDelay());
  return NextResponse.json({ id });
}
