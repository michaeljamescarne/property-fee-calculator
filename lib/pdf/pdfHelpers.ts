/**
 * PDF Helper Utilities
 * Utility functions for PDF manipulation
 */

/**
 * Convert a Blob to base64 string
 * Used for email attachments with Resend
 * Server-side compatible version using Node.js Buffer
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Convert Blob to ArrayBuffer (server-side compatible)
      const arrayBuffer = await blob.arrayBuffer();
      // Convert ArrayBuffer to Buffer (Node.js)
      const buffer = Buffer.from(arrayBuffer);
      // Convert Buffer to base64 string
      const base64 = buffer.toString('base64');
      resolve(base64);
    } catch (error) {
      reject(error);
    }
  });
}

