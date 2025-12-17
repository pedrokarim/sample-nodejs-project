import { render } from '@testing-library/react';
import ReactDOM from 'react-dom/client';

// Mock ReactDOM.createRoot
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn()
  }))
}));

// Mock reportWebVitals
jest.mock('./reportWebVitals', () => jest.fn());

describe('index.js', () => {
  let mockCreateRoot;
  let mockRender;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Get the mocked functions
    mockCreateRoot = ReactDOM.createRoot;
    mockRender = mockCreateRoot().render;
  });

  test('renders App component in StrictMode', () => {
    // Import index.js to trigger the rendering
    require('./index');

    // Verify createRoot was called with the correct element
    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById('root'));

    // Verify render was called
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Verify the render call contains StrictMode and App component
    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall.type).toBe('StrictMode');

    // The App component should be rendered inside StrictMode
    const appComponent = renderCall.props.children;
    expect(appComponent.type.name).toBe('App');
  });

  test('calls reportWebVitals', () => {
    const mockReportWebVitals = require('./reportWebVitals');

    // Import index.js to trigger reportWebVitals call
    require('./index');

    // Verify reportWebVitals was called
    expect(mockReportWebVitals).toHaveBeenCalledTimes(1);
  });
});