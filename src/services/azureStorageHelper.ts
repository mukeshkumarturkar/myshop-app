/**
 * Azure Blob Storage Helper
 * Handles direct upload of images to Azure Blob Storage
 */

interface AzureStorageConfig {
  containerUrl: string; // e.g., https://yourstorageaccount.blob.core.windows.net/catalogs
  sasToken: string; // Shared Access Signature token for upload permissions
}

let azureConfig: AzureStorageConfig | null = null;

/**
 * Initialize Azure Storage configuration
 * This should be called once during app initialization with config from environment or API
 */
export const initializeAzureStorage = (config: AzureStorageConfig) => {
  console.log('🔵 [Azure] Initializing Azure Storage with config:', {
    containerUrl: config.containerUrl,
    sasTokenPresent: !!config.sasToken,
    sasTokenLength: config.sasToken?.length || 0,
  });

  azureConfig = config;
  console.log('🟢 [Azure] Azure Storage initialized successfully');
};

/**
 * Upload image file to Azure Blob Storage
 * @param file - Image file to upload
 * @returns Promise with public blob URL
 */
export const uploadImageToAzure = async (file: File): Promise<string> => {
  console.log('🔵 [Azure] Starting image upload to Azure Blob Storage');
  console.log('📋 [Azure] File details:', {
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    type: file.type,
  });

  if (!azureConfig) {
    console.error('❌ [Azure] Azure Storage not configured');
    throw new Error('Azure Storage not configured. Call initializeAzureStorage first.');
  }

  console.log('✅ [Azure] Azure config found, proceeding with upload');

  try {
    // Generate unique blob name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const blobName = `catalog-${timestamp}-${randomString}.${fileExtension}`;

    console.log('📝 [Azure] Generated blob name:', blobName);

    // Construct the blob URL with SAS token
    const blobUrl = `${azureConfig.containerUrl}/${blobName}?${azureConfig.sasToken}`;

    console.log('🔗 [Azure] Blob URL constructed:', {
      containerUrl: azureConfig.containerUrl,
      blobName: blobName,
      fullUrlLength: blobUrl.length,
    });

    console.log('⏳ [Azure] Uploading file to Azure Blob Storage...');

    // Upload to Azure with metadata headers for CORS and tracking
    const response = await fetch(blobUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type || 'image/jpeg',
        'x-ms-meta-uploadedby': 'myshop-app',
        'x-ms-meta-timestamp': new Date().toISOString(),
        'x-ms-meta-filename': file.name,
      },
      body: file,
    });

    console.log('📡 [Azure] Azure response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: {
        contentType: response.headers.get('content-type'),
        location: response.headers.get('location'),
      },
    });

    if (!response.ok) {
      console.error('❌ [Azure] Upload failed with status:', response.status);
      const errorText = await response.text();
      console.error('❌ [Azure] Error details:', errorText);
      throw new Error(`Azure upload failed: ${response.statusText}`);
    }

    // Return public URL (without SAS token for API storage)
    const publicUrl = `${azureConfig.containerUrl}/${blobName}`;
    console.log('✅ [Azure] Image uploaded successfully');
    console.log('🔗 [Azure] Public URL:', publicUrl);
    console.log('📊 [Azure] URL Details:', {
      containerUrl: azureConfig.containerUrl,
      blobName: blobName,
      fullUrl: publicUrl,
      urlLength: publicUrl.length,
    });

    return publicUrl;
  } catch (error) {
    console.error('❌ [Azure] Error uploading image to Azure:', error);
    throw error;
  }
};

/**
 * Upload image from base64 data
 * @param base64Data - Base64 encoded image data
 * @param filename - Name for the file
 * @returns Promise with public blob URL
 */
export const uploadBase64ImageToAzure = async (
  base64Data: string,
  filename: string
): Promise<string> => {
  console.log('🔵 [Azure] Starting base64 image upload');
  console.log('📋 [Azure] Base64 data length:', base64Data.length);

  if (!azureConfig) {
    console.error('❌ [Azure] Azure Storage not configured');
    throw new Error('Azure Storage not configured. Call initializeAzureStorage first.');
  }

  try {
    // Convert base64 to blob
    const binaryString = atob(base64Data.split(',')[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    const file = new File([blob], filename, { type: 'image/jpeg' });

    console.log('✅ [Azure] Converted base64 to file:', {
      fileName: filename,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    });

    return uploadImageToAzure(file);
  } catch (error) {
    console.error('❌ [Azure] Error uploading base64 image to Azure:', error);
    throw error;
  }
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  console.log('🔵 [Validation] Validating image file:', file.name);

  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    const error = `Only JPEG, PNG, and WebP images are allowed. Got: ${file.type}`;
    console.warn('⚠️ [Validation]', error);
    return { valid: false, error };
  }

  if (file.size > maxFileSize) {
    const error = `Image size must be less than 5MB. Got: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    console.warn('⚠️ [Validation]', error);
    return { valid: false, error };
  }

  console.log('✅ [Validation] File validation passed');
  return { valid: true };
};

