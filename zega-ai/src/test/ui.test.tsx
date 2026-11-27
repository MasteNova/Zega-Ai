import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button, Badge } from '../components/ui';

describe('UI primitives', () => {
  it('renders a button', () => {
    render(<Button>Generate</Button>);
    expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument();
  });
  it('renders a badge', () => {
    render(<Badge tone="gold">Unverified demo data</Badge>);
    expect(screen.getByText('Unverified demo data')).toBeInTheDocument();
  });
});
