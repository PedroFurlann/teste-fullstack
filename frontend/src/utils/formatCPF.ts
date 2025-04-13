export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '');

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    .slice(0, 14);
}

export function safeFormatCPF(value: string): string {
  const digits = value.replace(/\D/g, '');

  const isOnlyNumbers = /^\d+$/.test(value);

  if (!isOnlyNumbers) {
    return value;
  }

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    .slice(0, 14);
}
