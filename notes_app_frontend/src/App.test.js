import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header and New Note button', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /simple notes/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /new note/i })).toBeInTheDocument();
});
