/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import fs from 'fs';
import path from 'path';

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult => {
  const view = render(ui, options);

  // tailwindcss 적용
  const style = document.createElement('style');
  style.innerHTML = fs.readFileSync(path.resolve(__dirname, './globals.css'), 'utf8');
  const { container } = view;
  container.append(style);

  // portal 적용
  const portal = document.createElement('div');
  portal.id = 'modal-root';
  container.appendChild(portal);

  return view;
};

export * from '@testing-library/react';
export { customRender as render };
