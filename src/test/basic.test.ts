import { describe, it, expect } from 'vitest'

describe('Basic Tests', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test string operations', () => {
    const message = 'Hello, Jam Session!'
    expect(message).toContain('Jam Session')
    expect(message.length).toBeGreaterThan(0)
  })
})
