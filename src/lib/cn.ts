/* Une clases de Tailwind y resuelve conflictos: si dos clases pisan la misma propiedad
(por ejemplo text-[14px] y text-[13px]), gana la última. */

import { twMerge, type ClassNameValue } from 'tailwind-merge';

export function cn(...clases: ClassNameValue[]) {
  return twMerge(...clases);
}