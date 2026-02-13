import { put, del } from '@vercel/blob';
import { randomBytes } from 'crypto';

// Allowed MIME types for images
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Maximum file size (2MB in bytes)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export interface UploadResult {
  url: string;
  filename: string;
}

export interface UploadError {
  error: string;
}

/**
 * Validate file type and size
 */
function validateFile(file: File): string | null {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP.';
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return 'Arquivo muito grande. Tamanho máximo: 2MB.';
  }

  return null;
}

/**
 * Generate unique filename
 */
function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = randomBytes(8).toString('hex');
  const extension = originalName.split('.').pop() || 'jpg';
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Save uploaded file to Vercel Blob Storage
 * @param file - File object from form data
 * @returns Object with URL and filename, or error
 */
export async function saveUploadedFile(
  file: File
): Promise<UploadResult | UploadError> {
  try {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      return { error: validationError };
    }

    // Generate unique filename
    const filename = generateFilename(file.name);

    // Upload to Vercel Blob Storage
    const blob = await put(`news/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false, // We handle uniqueness ourselves
    });

    return {
      url: blob.url,
      filename,
    };
  } catch (error) {
    console.error('Error uploading to Blob:', error);
    return { error: 'Erro ao salvar arquivo. Por favor, tente novamente.' };
  }
}

/**
 * Delete uploaded file from Blob Storage or filesystem (for legacy files)
 * @param urlOrFilename - Blob URL or filename to delete
 */
export async function deleteUploadedFile(urlOrFilename: string): Promise<void> {
  try {
    // If it's a blob URL (starts with http), use Blob API
    if (urlOrFilename.startsWith('http')) {
      await del(urlOrFilename);
    }
    // Otherwise, it's a legacy filename in the filesystem
    else {
      const { unlink } = await import('fs/promises');
      const { join } = await import('path');
      const filePath = join(
        process.cwd(),
        'public',
        'uploads',
        'news',
        urlOrFilename
      );
      await unlink(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error, just log it
  }
}
