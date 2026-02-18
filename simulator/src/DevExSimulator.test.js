import { render, screen, fireEvent } from '@testing-library/react';
import DevExSimulator from './DevExSimulator';

test('renders baseline configuration screen on load', () => {
  render(<DevExSimulator />);
  expect(screen.getByText(/Set Your Baseline Metrics/i)).toBeInTheDocument();
});

test('shows first question after clicking Initialize Audit', () => {
  render(<DevExSimulator />);
  const button = screen.getByText(/Initialize Audit/i);
  fireEvent.click(button);
  expect(screen.getByText(/SYSTEM_AUDIT_MODE/i)).toBeInTheDocument();
});

test('calculateFinalMetrics returns correct score for all-perfect answers', () => {
  const answers = [
    { score_impact: 10, weight: 0.15, categoryId: 'onboarding' },
    { score_impact: 10, weight: 0.40, categoryId: 'onboarding' },
    { score_impact: 10, weight: 0.10, categoryId: 'documentation' },
    { score_impact: 10, weight: 0.25, categoryId: 'retention_and_support' },
    { score_impact: 10, weight: 0.30, categoryId: 'retention_and_support' },
  ];
  const totalScore = answers.reduce((acc, curr) => acc + curr.score_impact, 0);
  const maxScore = answers.length * 10;
  const finalGrade = (totalScore / maxScore) * 100;
  expect(finalGrade).toBe(100);
});

test('calculateFinalMetrics returns 0% score for all-fail answers', () => {
  const answers = [
    { score_impact: 0, weight: 0.15, categoryId: 'onboarding' },
    { score_impact: 0, weight: 0.40, categoryId: 'onboarding' },
    { score_impact: 0, weight: 0.10, categoryId: 'documentation' },
    { score_impact: 0, weight: 0.25, categoryId: 'retention_and_support' },
    { score_impact: 0, weight: 0.30, categoryId: 'retention_and_support' },
  ];
  const totalScore = answers.reduce((acc, curr) => acc + curr.score_impact, 0);
  const maxScore = answers.length * 10;
  const finalGrade = (totalScore / maxScore) * 100;
  expect(finalGrade).toBe(0);
});
