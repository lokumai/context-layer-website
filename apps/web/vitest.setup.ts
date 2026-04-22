import '@testing-library/jest-dom'

// jsdom doesn't implement IntersectionObserver; Motion's useInView depends on
// it. Minimal shim — tests don't assert on intersections, only that components
// render without crashing.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverShim {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
    root = null
    rootMargin = ''
    thresholds = []
  }
  globalThis.IntersectionObserver = IntersectionObserverShim as unknown as typeof IntersectionObserver
}
