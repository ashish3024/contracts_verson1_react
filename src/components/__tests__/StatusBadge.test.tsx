import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders DRAFT status with correct label', () => {
    render(<StatusBadge status="DRAFT" />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders APPROVED status with correct label', () => {
    render(<StatusBadge status="APPROVED" />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('renders REVIEW status with correct label', () => {
    render(<StatusBadge status="REVIEW" />);
    expect(screen.getByText('In Review')).toBeInTheDocument();
  });

  it('renders REJECTED status with correct label', () => {
    render(<StatusBadge status="REJECTED" />);
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('renders EXPIRED status with correct label', () => {
    render(<StatusBadge status="EXPIRED" />);
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  it('applies the correct CSS class for each status', () => {
    const { container } = render(<StatusBadge status="APPROVED" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toMatch(/approved/);
  });
});
