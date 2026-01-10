// types/global.d.ts
export {};

declare global {
  interface Window {
    dataLayer: any[];
    fbq: any;
    gtag: (...args: any[]) => void;
  }
}