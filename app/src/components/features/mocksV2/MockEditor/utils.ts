import { FileType } from "../types";

export const validateEndpoint = (endpoint: string) => {
  if (!endpoint) {
    return "Endpoint is required";
  }

  if (endpoint.startsWith("/")) {
    return "Endpoint cannot start with '/'";
  }

  const pattern = /^[A-Za-z0-9_.\-/]+$/;
  if (endpoint.match(pattern)) {
    return null;
  } else {
    return "Endpoint can only contain letters, numbers, '_', '-' & '/'";
  }
};

export const getEditorLanguage = (fileType?: FileType) => {
  switch (fileType) {
    case FileType.JS:
      return "javascript";
    case FileType.CSS:
      return "css";
    case FileType.HTML:
      return "html";
    default:
      return "json";
  }
};
