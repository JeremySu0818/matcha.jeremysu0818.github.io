import { createRoot, type Root } from 'react-dom/client';
import App from './App';
import './index.css';

declare global {
  interface Window {
    __MATCHA_ROOT__?: Root;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Matcha root element is missing.');
}

const root = window.__MATCHA_ROOT__ ?? createRoot(rootElement);
window.__MATCHA_ROOT__ = root;

root.render(<App />);
