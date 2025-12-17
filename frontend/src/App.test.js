import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch globally to prevent API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockFetch.mockClear();
  });

  test('displays loading state initially', () => {
    // Mock pending API calls to stay in loading state
    mockFetch.mockImplementation(() => new Promise(() => { })); // Never resolves

    render(<App />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    // Mock successful API responses
    mockFetch.mockImplementation((url) => {
      if (url === '/api/items') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: []
          })
        });
      } else if (url === '/api/collections') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: []
          })
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404
      });
    });

    expect(() => render(<App />)).not.toThrow();
  });

  test('shows basic app structure', () => {
    // Mock pending API calls
    mockFetch.mockImplementation(() => new Promise(() => { }));

    render(<App />);

    // Should have the loading div
    expect(document.querySelector('.loading')).toBeInTheDocument();
  });
});