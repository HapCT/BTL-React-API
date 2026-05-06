export const IMAGE_BASE = "https://localhost:44352";
export const getImageUrl = (path) =>
  path?.startsWith("http") ? path : `${IMAGE_BASE}${path}`;