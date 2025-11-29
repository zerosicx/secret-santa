export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function validateParticipant(name: string, photoUrl: string): string | null {
  if (!name || !name.trim()) {
    return 'Please enter a name.';
  }
  if (photoUrl && !photoUrl.startsWith('data:') && !/^https?:\/\//i.test(photoUrl.trim())) {
    return 'Photo URL must start with http:// or https://';
  }
  return null;
}

const MAX_DIMENSION = 400; // Max width/height for compressed images
const JPEG_QUALITY = 0.8; // 80% quality for compressed images

/**
 * Compresses an image file by resizing and reducing quality
 */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = (height * MAX_DIMENSION) / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = (width * MAX_DIMENSION) / height;
            height = MAX_DIMENSION;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw image with high quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed JPEG
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          resolve(compressedDataUrl);
        } catch (error) {
          reject(new Error('Failed to compress image'));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    try {
      const compressed = await compressImage(file);
      resolve(compressed);
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Failed to process image'));
    }
  });
}

