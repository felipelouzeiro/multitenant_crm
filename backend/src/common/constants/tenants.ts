export const TENANT_NAMES = {
  'tenant-1': 'Empresa ACME',
  'tenant-2': 'Empresa GLOBEX',
  'tenant-3': 'Empresa INITECH',
  'tenant-4': 'Empresa TECH CORP',
  'tenant-5': 'Empresa INNOVATION LAB',
} as const;

export const getTenantName = (tenantId: string): string => {
  return TENANT_NAMES[tenantId as keyof typeof TENANT_NAMES] || `Empresa ${tenantId}`;
};
