import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the DevEx simulator', () => {
  render(<App />);
  expect(screen.getByText(/Set Your Baseline Metrics/i)).toBeInTheDocument();
});
