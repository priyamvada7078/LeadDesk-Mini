/**
 * Formats an ISO date string or Date object into a readable date string.
 * @param {string|Date} dateInput 
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'N/A';
    
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return 'N/A';
  }
};
