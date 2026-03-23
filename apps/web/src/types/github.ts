export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface SatelliteData {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  pushedAt: Date;
  // Computed visual properties
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  satelliteRadius: number;
  color: string;
}
