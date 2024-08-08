export const generatePaginationNumber = (
  currentPage: number,
  totalPages: number
) => {
  /* Si el numerro total de paginas es 7 o menos se mostraran todas las paginas */

  if (totalPages <= 7) {
    /* [1,2,3,4,5,6,7] */
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    /* [1,2,3,'...', 49,50] */
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    /* [1,2,'...', 48, 49, 50] */
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
