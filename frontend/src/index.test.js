import React from 'react';

// Mock ReactDOM.createRoot
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn()
  }))
}));

// Mock reportWebVitals
jest.mock('./reportWebVitals', () => jest.fn());

describe('index.js', () => {
  test('imports without errors', () => {
    // Just test that the module can be imported without throwing
    expect(() => {
      require('./index');
    }).not.toThrow();
  });
});