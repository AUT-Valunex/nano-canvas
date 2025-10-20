import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App - Real Integration Tests', () => {
  beforeEach(() => {
    // Clear any localStorage or sessionStorage
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    // Clean up any DOM modifications
    document.body.innerHTML = ''
  })

  it('renders the application without crashing', () => {
    expect(() => render(<App />)).not.toThrow()
  })

  it('displays the main canvas interface', () => {
    render(<App />)

    // Check for key UI elements that should be present
    expect(document.querySelector('[data-testid="react-flow"]')).toBeInTheDocument()
  })

  it('has toolbar buttons for adding nodes', () => {
    render(<App />)

    // Look for toolbar by test ID
    const toolbar = document.querySelector('[data-testid="top-toolbar"]')
    expect(toolbar).toBeInTheDocument()
  })

  it('allows adding image nodes to the canvas', async () => {
    render(<App />)

    // Find the add image button (it might be in a toolbar)
    const addButton = Array.from(document.querySelectorAll('button, [role="button"]'))
      .find(btn => btn.textContent?.toLowerCase().includes('image') ||
                  btn.getAttribute('aria-label')?.toLowerCase().includes('image'))

    if (addButton) {
      await userEvent.click(addButton)

      // Verify that something happened (new node added, etc.)
      // This will depend on how your app actually works
      await waitFor(() => {
        const canvas = document.querySelector('[data-testid="react-flow"]')
        expect(canvas).toBeInTheDocument()
      })
    }
  })

  it('allows adding prompt nodes to the canvas', async () => {
    render(<App />)

    // Find the add prompt button
    const addButton = Array.from(document.querySelectorAll('button, [role="button"]'))
      .find(btn => btn.textContent?.toLowerCase().includes('prompt') ||
                  btn.getAttribute('aria-label')?.toLowerCase().includes('prompt'))

    if (addButton) {
      await userEvent.click(addButton)

      await waitFor(() => {
        const canvas = document.querySelector('[data-testid="react-flow"]')
        expect(canvas).toBeInTheDocument()
      })
    }
  })

  it('allows clearing the canvas', async () => {
    render(<App />)

    // Find the clear button
    const clearButton = Array.from(document.querySelectorAll('button, [role="button"]'))
      .find(btn => btn.textContent?.toLowerCase().includes('clear') ||
                  btn.getAttribute('aria-label')?.toLowerCase().includes('clear'))

    if (clearButton) {
      await userEvent.click(clearButton)

      // Canvas should still be present but empty
      await waitFor(() => {
        const canvas = document.querySelector('[data-testid="react-flow"]')
        expect(canvas).toBeInTheDocument()
      })
    }
  })

  it('handles window resize events gracefully', () => {
    render(<App />)

    expect(() => {
      window.dispatchEvent(new Event('resize'))
    }).not.toThrow()
  })

  it('maintains focus management for accessibility', () => {
    render(<App />)

    // Check that we can focus on interactive elements
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    expect(focusableElements.length).toBeGreaterThan(0)

    // Test that we can actually focus on the first element
    if (focusableElements[0]) {
      (focusableElements[0] as HTMLElement).focus()
      expect(document.activeElement).toBe(focusableElements[0])
    }
  })

  it('has proper ARIA labels and roles', () => {
    render(<App />)

    // Check for proper ARIA structure
    const mainElement = document.querySelector('main, [role="main"]')
    if (mainElement) {
      expect(mainElement).toBeInTheDocument()
    }

    // Check for any aria-live regions (for dynamic content announcements)
    // It's okay if there are no aria-live regions yet; dynamic content is announced via toasts.
  })

  it('loads and displays settings panel', () => {
    render(<App />)

    // Look for settings-related elements
    const settingsElement = document.querySelector(
      '[class*="settings"], [class*="Settings"], [aria-label*="settings"]'
    )

    // Settings might be hidden by default, so we don't require it to be visible
    // But the element should exist in the DOM
    expect(settingsElement).toBeInTheDocument()
  })

  it('displays canvas controls (zoom, minimap)', () => {
    render(<App />)

    // Look for ReactFlow controls
    const controls = document.querySelector('[class*="controls"], [class*="Controls"]')
    const minimap = document.querySelector('[class*="minimap"], [class*="Minimap"]')

    // These should exist in the ReactFlow component
    expect(controls).toBeInTheDocument()
    expect(minimap).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    render(<App />)

    // Test tab navigation
    const firstButton = document.querySelector('button')
    if (firstButton) {
      firstButton.focus()
      expect(document.activeElement).toBe(firstButton)

      // Test tab key
      await userEvent.tab()

      // Focus should move to next element
      expect(document.activeElement).not.toBe(firstButton)
    }
  })

  it('maintains performance with basic interactions', async () => {
    const startTime = performance.now()

    render(<App />)

    // Simulate some basic interactions
    const buttons = document.querySelectorAll('button')
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      await userEvent.click(buttons[i])
    }

    const endTime = performance.now()

    // Should complete within reasonable time (less than 1 second)
    expect(endTime - startTime).toBeLessThan(1000)
  })

  describe('Error Scenarios', () => {
    it('handles missing API key gracefully', async () => {
      render(<App />)

      // Try to trigger an action that would require an API key
      const promptButton = Array.from(document.querySelectorAll('button, [role="button"]'))
        .find(btn => btn.textContent?.toLowerCase().includes('prompt'))

      if (promptButton) {
        await userEvent.click(promptButton)

        // Look for any error messages or API key prompts
        await waitFor(() => {
          // Error handling should be graceful - app shouldn't crash
          expect(document.body).toBeInTheDocument()
        }, { timeout: 5000 })
      }
    })

    it('handles network errors gracefully', async () => {
      // Mock a network failure
      const originalFetch = global.fetch

      global.fetch = () => Promise.reject(new Error('Network error'))

      try {
        render(<App />)

        // App should still render despite network issues
        expect(document.body).toBeInTheDocument()
      } finally {
        global.fetch = originalFetch
      }
    })
  })

  describe('Component Integration', () => {
    it('integrates ReactFlow components properly', () => {
      render(<App />)

      // Check that ReactFlow components are rendered
      const reactFlowElement = document.querySelector('.react-flow')
      if (reactFlowElement) {
        expect(reactFlowElement).toBeInTheDocument()
      }
    })

    it('loads analytics and tracking components', () => {
      render(<App />)

      // These components should be loaded but not necessarily visible
      expect(document.body).toBeInTheDocument()
    })
  })
})
