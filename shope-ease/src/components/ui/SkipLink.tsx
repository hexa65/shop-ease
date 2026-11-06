// The first focusable element on every page. Invisible until a keyboard user
// presses Tab, then it appears and jumps straight to the main content.
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-pine focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-pine focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}