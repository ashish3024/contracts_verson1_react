import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders DRAFT with correct label', () => {
    render(<StatusBadge status="DRAFT" />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders APPROVED with correct label', () => {
    render(<StatusBadge status="APPROVED" />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('renders REVIEW with correct label', () => {
    render(<StatusBadge status="REVIEW" />);
    expect(screen.getByText('In Review')).toBeInTheDocument();
  });

  it('renders REJECTED with correct label', () => {
    render(<StatusBadge status="REJECTED" />);
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders EXPIRED with correct label', () => {
    render(<StatusBadge status="EXPIRED" />);
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  it('applies correct CSS class for status', () => {
    const { container } = render(<StatusBadge status="APPROVED" />);
    expect((container.firstChild as HTMLElement).className).toMatch(/approved/);
  });
});
