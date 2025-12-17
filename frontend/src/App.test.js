import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch globally
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup default successful responses
    global.fetch.mockImplementation((url) => {
      if (url === '/api/items') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              { id: 1, name: 'Test Item 1', description: 'Description 1', createdAt: '2025-01-01' },
              { id: 2, name: 'Test Item 2', description: 'Description 2', createdAt: '2025-01-01' }
            ]
          })
        });
      } else if (url === '/api/collections') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              {
                id: 1,
                name: 'Test Collection',
                description: 'Test Description',
                createdAt: '2025-01-01',
                items: [],
                itemDetails: []
              }
            ]
          })
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404
      });
    });
  });

  test('renders app title and navigation', async () => {
    render(<App />);

    // Wait for data loading to complete
    await waitFor(() => {
      expect(screen.getByText('Sample React + Express App')).toBeInTheDocument();
    });

    expect(screen.getByText('📝 Éléments (2)')).toBeInTheDocument();
    expect(screen.getByText('📁 Collections (1)')).toBeInTheDocument();
  });

  test('displays items when items tab is active', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  test('displays collections when collections tab is active', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('📁 Collections (1)')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('📁 Collections (1)'));

    await waitFor(() => {
      expect(screen.getByText('Test Collection')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('shows statistics section', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Statistiques')).toBeInTheDocument();
    });

    expect(screen.getByText('2')).toBeInTheDocument(); // Items count
    expect(screen.getByText('1')).toBeInTheDocument(); // Collections count
    expect(screen.getByText('React + Express')).toBeInTheDocument();
    expect(screen.getByText('Jenkins')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(<App />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    // Mock failed API calls
    global.fetch.mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('❌ Erreur : Network error')).toBeInTheDocument();
    });
  });

  test('can dismiss error messages', async () => {
    global.fetch.mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('❌ Erreur : Network error')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('✕'));

    expect(screen.queryByText('❌ Erreur : Network error')).not.toBeInTheDocument();
  });
});