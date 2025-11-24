export const generateQueueNumber = () => {
  const prefix = 'K';
  const counter = new Date().getTime().toString().slice(-3);
  return `${prefix}-${String(counter).padStart(3, '0')}`;
  // Contoh: K-456
};