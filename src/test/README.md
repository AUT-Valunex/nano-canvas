# Test Suite Documentation

This directory contains the comprehensive test suite for the Nano Canvas application.

## Test Structure

```
src/test/
├── utils/
│   └── test-utils.tsx          # Shared testing utilities and helpers
├── mocks/
│   └── react-flow.mock.ts      # Mock implementations for external libraries
├── accessibility/
│   └── Accessibility.test.tsx  # Accessibility compliance tests
├── api/
│   └── ApiErrorHandling.test.tsx # API error handling and recovery tests
├── integration/
│   └── CanvasWorkflow.test.tsx # End-to-end workflow integration tests
├── performance/
│   └── Performance.test.tsx    # Performance and optimization tests
├── App.test.tsx                # Main application component tests
├── CanvasSurface.test.tsx      # Canvas surface component tests
├── ImageNode.test.tsx          # Image node component tests
├── PromptNode.test.tsx         # Prompt node component tests
├── ConfirmModal.test.tsx       # Confirmation modal tests
├── SettingsPanel.test.tsx      # Settings panel tests
├── TopToolbar.test.tsx         # Top toolbar tests
├── canvasStore.test.ts         # Canvas store state management tests
├── settingsStore.test.ts       # Settings store state management tests
└── useConnection.test.tsx      # Custom hooks tests
```

## Test Categories

### 1. Unit Tests
- **Component Tests**: Individual component functionality, props, state, and user interactions
- **Hook Tests**: Custom hook behavior and edge cases
- **Store Tests**: State management logic and data flow

### 2. Integration Tests
- **Workflow Tests**: Complete user workflows across multiple components
- **State Integration**: Component interaction through shared state
- **API Integration**: External service integration and error handling

### 3. Accessibility Tests
- **WCAG Compliance**: Screen reader support, keyboard navigation, ARIA attributes
- **Focus Management**: Proper focus handling and visual indicators
- **Color Contrast**: Sufficient contrast ratios for text readability

### 4. Performance Tests
- **Rendering Performance**: Component render times and optimization
- **Large Dataset Handling**: Performance with many nodes and complex layouts
- **Memory Management**: Memory leak prevention and cleanup

### 5. API Error Handling Tests
- **Network Errors**: Connection failures, timeouts, and retry logic
- **API Response Errors**: Invalid responses, rate limiting, and malformed data
- **User-Friendly Messages**: Clear error communication and recovery options

## Testing Tools and Libraries

### Core Testing Stack
- **Vitest**: Fast unit test framework with TypeScript support
- **React Testing Library**: Component testing utilities focused on user behavior
- **jsdom**: DOM environment for server-side testing
- **@testing-library/jest-dom**: Custom DOM matchers for assertions

### Mocking and Utilities
- **vi (Vitest)**: Mocking functions and modules
- **Test Utils**: Custom helpers for rendering and data creation
- **Mock Implementations**: Controlled mocks for external dependencies

### Accessibility Testing
- **axe-core**: Automated accessibility testing engine
- **jest-axe**: Jest matchers for accessibility violations

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test Files
```bash
npm test -- src/test/App.test.tsx
```

### Run Tests by Pattern
```bash
npm test -- --grep "Accessibility"
```

### Run Performance Tests
```bash
npm test -- src/test/performance/
```

## Test Configuration

### Vitest Configuration
- **Environment**: jsdom for DOM simulation
- **Setup Files**: Global test setup and mocks
- **Coverage**: 80% minimum thresholds for all metrics
- **Timeouts**: 10 second timeout for individual tests

### Coverage Thresholds
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Best Practices

### Test Structure
1. **Arrange-Act-Assert**: Clear separation of setup, action, and verification
2. **Descriptive Test Names**: Test names should clearly describe what is being tested
3. **Focused Tests**: Each test should verify a single behavior or outcome
4. **Isolation**: Tests should not depend on each other's state

### Mocking Strategy
1. **External Dependencies**: Mock all external APIs and services
2. **User Interactions**: Mock browser APIs when necessary
3. **State Management**: Use controlled store state for predictable testing
4. **Network Requests**: Mock all network calls to avoid external dependencies

### Accessibility Testing
1. **Automated Testing**: Use axe-core for automated accessibility checks
2. **Keyboard Navigation**: Test all interactions with keyboard-only usage
3. **Screen Reader Support**: Verify proper ARIA attributes and semantic markup
4. **Focus Management**: Ensure logical focus flow and visible indicators

### Performance Testing
1. **Render Time**: Measure component rendering performance
2. **Large Datasets**: Test with realistic amounts of data
3. **Memory Usage**: Monitor for memory leaks and excessive allocations
4. **User Interactions**: Verify responsive interactions during complex operations

## Debugging Tests

### Console Output
- Tests suppress console logs by default except for errors
- Use `console.log` for debugging failing tests
- Check test output for specific error messages

### Test Isolation
- Each test runs in isolation with clean state
- Use `beforeEach` and `afterEach` for setup and cleanup
- Verify mocks are properly reset between tests

### Timeouts
- Increase timeout for slow operations with `test.setTimeout()`
- Use fake timers for consistent time-based testing
- Debug hanging tests with proper async handling

## Continuous Integration

### GitHub Actions
- Tests run automatically on pull requests
- Coverage reports are generated and uploaded
- Performance benchmarks can be tracked over time

### Quality Gates
- All tests must pass before merging
- Coverage thresholds must be maintained
- No accessibility violations are allowed

## Adding New Tests

### When to Add Tests
1. **New Components**: Create comprehensive tests for all new components
2. **Bug Fixes**: Add tests that prevent regression of fixed issues
3. **New Features**: Test all user interactions and edge cases
4. **Performance Changes**: Add benchmarks for performance-critical features

### Test Template
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { renderWithProviders } from '../utils/test-utils'

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render correctly', () => {
    renderWithProviders(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    renderWithProviders(<ComponentName />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(screen.getByText('Updated Text')).toBeInTheDocument()
  })
})
```

## Test Data and Fixtures

### Mock Data Creators
- Use helper functions to create consistent test data
- Separate test data from test logic
- Provide realistic data for edge case testing

### Example Fixtures
```typescript
// Mock node creation
export const createMockImageNode = (overrides = {}) => ({
  id: 'image-1',
  type: 'imageNode',
  position: { x: 100, y: 100 },
  data: { label: 'Test Image', ...overrides },
})

// Mock store state
export const createMockCanvasStore = (overrides = {}) => ({
  nodes: [],
  edges: [],
  addNode: vi.fn(),
  deleteNode: vi.fn(),
  ...overrides,
})
```

## Future Improvements

### Enhanced Testing
1. **Visual Regression**: Add screenshot comparison testing
2. **E2E Testing**: Implement Playwright for full browser testing
3. **Load Testing**: Test performance under heavy user load
4. **Cross-browser**: Verify functionality across different browsers

### Better Tooling
1. **Test Reports**: Enhanced test reporting and visualization
2. **Performance Monitoring**: Continuous performance benchmarking
3. **Coverage Insights**: Better coverage analysis and reporting
4. **Test Documentation**: Automated test documentation generation

## Troubleshooting

### Common Issues
1. **Mock Setup**: Ensure mocks are properly configured before tests
2. **Async Testing**: Use proper async/await patterns for asynchronous operations
3. **State Cleanup**: Verify state is properly reset between tests
4. **Import Errors**: Check mock paths and module resolution

### Getting Help
1. **Test Logs**: Check detailed test output for specific error information
2. **Debug Mode**: Use Node.js debugging for complex test failures
3. **Isolation**: Run failing tests in isolation to identify issues
4. **Documentation**: Refer to Vitest and React Testing Library documentation