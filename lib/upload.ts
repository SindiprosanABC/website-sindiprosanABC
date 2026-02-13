import { writeFile } from 'fs/promises';
import { join } from 'path';
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
 * Save uploaded file to filesystem
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define upload path
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'news');
    const filePath = join(uploadDir, filename);

    // Save file
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/uploads/news/${filename}`;

    return {
      url: publicUrl,
      filename,
    };
  } catch (error) {
    console.error('Error saving file:', error);
    return { error: 'Erro ao salvar arquivo. Por favor, tente novamente.' };
  }
}

/**
 * Delete uploaded file from filesystem
 * @param filename - Name of file to delete
 */
export async function deleteUploadedFile(filename: string): Promise<void> {
  try {
    const { unlink } = await import('fs/promises');
    const filePath = join(
      process.cwd(),
      'public',
      'uploads',
      'news',
      filename
    );
    await unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error, just log it
  }
}
