// src/lib/utils/confetti.ts
import confetti from 'canvas-confetti'

interface ConfettiOptions {
  particleCount?: number
  angle?: number
  spread?: number
  startVelocity?: number
  decay?: number
  gravity?: number
  drift?: number
  ticks?: number
  origin?: {
    x?: number
    y?: number
  }
  colors?: string[]
  shapes?: ('square' | 'circle')[]
  scalar?: number
  zIndex?: number
}

/**
 * Default confetti animation options
 */
const defaultOptions: ConfettiOptions = {
  particleCount: 300,
  angle: 90,
  spread: 360,
  startVelocity: 40,
  decay: 0.9,
  gravity: 1,
  drift: 0,
  ticks: 200,
  origin: { y: 0.5 },
  colors: ['#99ffcc', '#00ccff', '#ccffff', '#ff66ff'],
  shapes: ['square', 'circle'],
  scalar: 1,
  zIndex: 100
}

/**
 * Triggers a confetti animation with custom options
 * @param options - Custom confetti options to override defaults
 * @returns Promise that resolves when the animation is complete
 */
export const triggerConfetti = async (options: ConfettiOptions = {}): Promise<void> => {
  try {
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      origin: {
        ...defaultOptions.origin,
        ...options.origin
      }
    }

    return new Promise((resolve) => {
      confetti({
        ...mergedOptions,
        // Resolve promise when animation completes
        complete: () => resolve()
      })
    })
  } catch (error) {
    console.error('Failed to trigger confetti:', error)
    throw error
  }
}

/**
 * Triggers a realistic confetti burst animation
 */
export const triggerRealisticConfetti = async (): Promise<void> => {
  const count = 200
  const defaults = {
    origin: { y: 0.7 }
  }

  function fire(particleRatio: number, opts: ConfettiOptions) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    })
  }

  try {
    // Start the sequence
    fire(0.25, {
      spread: 26,
      startVelocity: 55
    })
    fire(0.2, {
      spread: 60
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45
    })
  } catch (error) {
    console.error('Failed to trigger realistic confetti:', error)
    throw error
  }
}

/**
 * Triggers a school pride confetti animation
 * @param colors - Array of school colors
 */
export const triggerSchoolPride = async (colors: string[] = ['#gold', '#blue']): Promise<void> => {
  const end = Date.now() + (5 * 1000)

  try {
    // Launch fireworks in school colors
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval)
        return
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      })
    }, 50)
  } catch (error) {
    console.error('Failed to trigger school pride confetti:', error)
    throw error
  }
}

/**
 * Stops all active confetti animations
 */
export const stopConfetti = (): void => {
  try {
    confetti.reset()
  } catch (error) {
    console.error('Failed to stop confetti:', error)
    throw error
  }
}
