import React from 'react';

interface CatalogImageProps {
  imageUrl: string | null | undefined;
  altText?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  fallbackSrc?: string;
}

/**
 * Catalog Image Component with CORS Support
 * Displays images from Azure Blob Storage with proper CORS headers
 */
export const CatalogImage: React.FC<CatalogImageProps> = ({
  imageUrl,
  altText = 'Catalog item',
  width = '100%',
  height = 'auto',
  className = '',
  fallbackSrc = '/placeholder-image.png',
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  console.log('🔵 [CatalogImage] Rendering image:', {
    imageUrl: imageUrl ? `${imageUrl.substring(0, 50)}...` : 'null',
    altText,
    hasUrl: !!imageUrl,
  });

  if (!imageUrl) {
    console.log('⚠️ [CatalogImage] No image URL provided');
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
        className={className}
      >
        <span style={{ color: '#999' }}>No image</span>
      </div>
    );
  }

  const handleLoad = () => {
    console.log('✅ [CatalogImage] Image loaded successfully:', imageUrl);
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('❌ [CatalogImage] Failed to load image:', {
      url: imageUrl,
      altText,
      error: 'Image failed to load',
    });
    console.log('💡 [CatalogImage] Ensure Azure CORS is configured:');
    console.log('   1. Azure Portal > Storage Account > Resource sharing (CORS)');
    console.log('   2. Add rule with allowed origins: *');
    console.log('   3. Include methods: GET, PUT, POST, DELETE, HEAD, OPTIONS');
    console.log('   4. Save and wait for propagation (1-2 minutes)');

    setHasError(true);
    setIsLoading(false);

    // Try fallback
    if (fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
  };

  return (
    <div
      style={{
        width,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
      }}
      className={className}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <span style={{ color: '#999' }}>Loading...</span>
        </div>
      )}

      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <span style={{ color: '#c00', textAlign: 'center', padding: '10px' }}>
            Failed to load image
            <br />
            <small>Check CORS configuration</small>
          </span>
        </div>
      )}

      <img
        src={imageUrl}
        alt={altText}
        crossOrigin="anonymous"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height,
          objectFit: 'cover',
          display: isLoading ? 'none' : 'block',
        }}
      />
    </div>
  );
};

export default CatalogImage;

