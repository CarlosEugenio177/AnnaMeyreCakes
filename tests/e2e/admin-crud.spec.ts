import { expect, test } from '@playwright/test';
import { authHeaders, getPublicCatalog, loginAdmin } from '../helpers/api-fixtures';

test.describe('admin catalog CRUD flow', () => {
  test('admin creates, edits and deactivates a catalog option', async ({ request }) => {
    const token = await loginAdmin(request);
    const name = `Massa Admin CRUD ${Date.now()}`;

    const create = await request.post('/admin/options/doughs', {
      headers: authHeaders(token),
      data: { name, colorHex: '#fadadd' },
    });
    expect(create.ok()).toBeTruthy();
    const created = await create.json();

    const updatedName = `${name} Editada`;
    const update = await request.patch(`/admin/options/doughs/${created.id}`, {
      headers: authHeaders(token),
      data: { name: updatedName, colorHex: '#fadadd' },
    });
    expect(update.ok()).toBeTruthy();

    const publicCatalog = await getPublicCatalog(request);
    expect(publicCatalog.doughs.some((item) => item.name === updatedName)).toBe(true);

    const deactivate = await request.delete(`/admin/options/doughs/${created.id}`, {
      headers: authHeaders(token),
    });
    expect(deactivate.ok()).toBeTruthy();

    const publicAfterDeactivate = await getPublicCatalog(request);
    expect(publicAfterDeactivate.doughs.some((item) => item.publicId === created.id)).toBe(false);
  });
});
