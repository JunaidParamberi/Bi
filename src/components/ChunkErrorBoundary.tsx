import { Component, ReactNode } from 'react';
import PageLoader from './PageLoader';

const RELOAD_FLAG = 'chunk-reload-at';

// After a redeploy, an open tab may request page chunks that no longer exist.
// Reload once to pick up the new build instead of leaving the old page on screen.
class ChunkErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    let lastReload = 0;
    try {
      lastReload = Number(sessionStorage.getItem(RELOAD_FLAG)) || 0;
    } catch {
      // Storage can be blocked; fall through and still reload once
    }
    // Guard against a reload loop if the chunk is genuinely broken
    if (Date.now() - lastReload > 10000) {
      try {
        sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
      } catch {
        // ignore
      }
      window.location.reload();
    } else {
      console.error(error);
    }
  }

  render() {
    return this.state.failed ? <PageLoader /> : this.props.children;
  }
}

export default ChunkErrorBoundary;
