import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ScifiClock } from '../ScifiClock';

describe('ScifiClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-22T14:30:45'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders hours, minutes, and seconds', () => {
    render(<ScifiClock />);
    expect(screen.getByText('14:30')).toBeInTheDocument();
    expect(screen.getByText(':45')).toBeInTheDocument();
  });

  it('renders the date', () => {
    render(<ScifiClock />);
    expect(screen.getByText(/Mar/)).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it('updates every second', () => {
    render(<ScifiClock />);
    expect(screen.getByText(':45')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText(':46')).toBeInTheDocument();
  });
});
