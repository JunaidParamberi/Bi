/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Public base URL of the media bucket (R2), without a trailing slash
  readonly VITE_MEDIA_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
