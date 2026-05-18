import { expect } from '@playwright/test';

const forbiddenPublicFields = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'isActive',
  'password',
  'passwordHash',
  'token',
  'tokenHash',
  'sessionToken',
  'customerId',
  'adminId',
  'lastSeenAt',
  'key',
  'role',
  'customer',
  'items',
  'cakeDetail',
  'sweetDetail',
  'contactSnapshot',
  'whatsappMessage',
  'phone',
  'email',
  'address',
]);

type ContractOptions = {
  allowedFields?: string[];
};

export function assertNoForbiddenFields(payload: unknown, options: ContractOptions = {}) {
  const allowedFields = new Set(options.allowedFields ?? []);
  const violations: string[] = [];

  walk(payload, '$', allowedFields, violations);

  expect(violations, `Forbidden public fields leaked: ${violations.join(', ')}`).toEqual([]);
}

function walk(value: unknown, path: string, allowedFields: Set<string>, violations: string[]) {
  if (!value || typeof value !== 'object') {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, allowedFields, violations));
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`;

    if (forbiddenPublicFields.has(key) && !allowedFields.has(childPath) && !allowedFields.has(key)) {
      violations.push(childPath);
    }

    walk(child, childPath, allowedFields, violations);
  }
}
