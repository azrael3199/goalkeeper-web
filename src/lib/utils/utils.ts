import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// eslint-disable-next-line import/prefer-default-export
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the contrast of a given color in black and white.
 *
 * @example
 * getContrastForColorInBW('#000000') // 0
 * getContrastForColorInBW('#FFFFFF') // 1
 *
 * @param color - The color to calculate the contrast for.
 * @returns The contrast of the color on a black and white background.
 */
export function getContrastForColorInBW(color: string) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const contrastColor = luminance > 128 ? '#000000' : '#FFFFFF';
  return contrastColor;
}

export function getStatusText(status: string, type: 'goal' | 'task') {
  switch (type) {
    case 'goal':
      switch (status) {
        case 'IN_PROGRESS':
          return 'In progress';
        case 'NOT_STARTED':
          return 'Not started';
        case 'COMPLETED':
          return 'Completed';
        default:
          return 'Unknown';
      }
    case 'task':
      switch (status) {
        case 'NOT_STARTED':
          return 'Not started';
        case 'DONE':
          return 'Done';
        default:
          return 'Unknown';
      }
    default:
      return 'Unknown';
  }
}
