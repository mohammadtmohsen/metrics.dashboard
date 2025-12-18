import { HTMLAttributes, JSX } from 'react';

export default function Card(
  props: HTMLAttributes<HTMLDivElement>
): JSX.Element {
  return <div {...props} />;
}
