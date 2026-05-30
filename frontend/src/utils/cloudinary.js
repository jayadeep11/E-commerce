export const optimizeImage = (url, width) => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;

  // Insert f_auto,q_auto,w_{width} after /upload/
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    const transformation = `f_auto,q_auto${width ? `,w_${width}` : ''}`;
    return `${parts[0]}/upload/${transformation}/${parts[1]}`;
  }
  return url;
};
