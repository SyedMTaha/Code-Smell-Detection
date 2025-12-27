/**
 * File validation utilities
 */

const ALLOWED_EXTENSIONS = ['.java', '.zip'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

/**
 * Validate file type
 */
export function isValidFileType(file) {
  if (!file) return false;

  const fileName = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

/**
 * Validate file size
 */
export function isValidFileSize(file) {
  if (!file) return false;
  return file.size <= MAX_FILE_SIZE;
}

/**
 * Validate file
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!isValidFileType(file)) {
    return {
      valid: false,
      error: 'Only .java and .zip files are allowed',
    };
  }

  if (!isValidFileSize(file)) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
    };
  }

  return { valid: true };
}

/**
 * Get file type icon
 */
export function getFileTypeIcon(fileName) {
  if (fileName.endsWith('.java')) {
    return '☕';
  }
  if (fileName.endsWith('.zip')) {
    return '📦';
  }
  return '📄';
}
