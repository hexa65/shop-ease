import { useEffect } from "react";

const APP_NAME = "ShopEase";

// Sets the browser tab title for the current page, and puts the old one back
// when the page goes away. Screen readers announce the title on navigation.
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
