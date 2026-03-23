import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailPanel } from '../DetailPanel';
import { useGitHubStore } from '@/stores/githubStore';
import { useSceneStore } from '@/stores/sceneStore';
import type { SatelliteData } from '@/types/github';

const mockSatellite: SatelliteData = {
  id: 1,
  name: 'test-project',
  description: 'A test project for testing',
  url: 'https://github.com/user/test-project',
  language: 'TypeScript',
  stars: 42,
  forks: 7,
  size: 1024,
  createdAt: new Date('2024-06-01'),
  updatedAt: new Date('2026-03-20'),
  pushedAt: new Date('2026-03-18'),
  orbitRadius: 6.5,
  orbitSpeed: 0.15,
  orbitOffset: 1.2,
  satelliteRadius: 0.3,
  color: '#3178C6',
};

describe('DetailPanel', () => {
  beforeEach(() => {
    useGitHubStore.setState({
      repos: [mockSatellite],
      selectedRepoId: null,
      loading: false,
      error: null,
      username: 'user',
    });
    useSceneStore.setState({ mode: 'orbit' });
  });

  it('renders nothing when no repo is selected', () => {
    const { container } = render(<DetailPanel />);
    expect(container.innerHTML).toBe('');
  });

  it('renders repo details when selected', () => {
    useGitHubStore.setState({ selectedRepoId: 1 });
    render(<DetailPanel />);

    expect(screen.getByText('test-project')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('A test project for testing')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    useGitHubStore.setState({ selectedRepoId: 1 });
    render(<DetailPanel />);

    const link = screen.getByText('VIEW ON GITHUB →');
    expect(link).toHaveAttribute('href', 'https://github.com/user/test-project');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders orbital data', () => {
    useGitHubStore.setState({ selectedRepoId: 1 });
    render(<DetailPanel />);

    expect(screen.getByText('6.5u')).toBeInTheDocument();
    expect(screen.getByText('0.150r/s')).toBeInTheDocument();
    expect(screen.getByText('0.30u')).toBeInTheDocument();
  });

  it('renders close button', () => {
    useGitHubStore.setState({ selectedRepoId: 1 });
    render(<DetailPanel />);

    expect(screen.getByText('[ESC]')).toBeInTheDocument();
  });
});
