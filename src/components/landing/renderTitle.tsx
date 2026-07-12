import { Fragment, type ReactNode } from "react";

export function renderTitle(text: string): ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, index) => (
    <Fragment key={String(index)}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ));
}
