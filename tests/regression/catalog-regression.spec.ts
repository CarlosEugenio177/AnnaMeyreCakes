import { expect, test } from '@playwright/test';
import { authHeaders, getPublicCatalog, loginAdmin } from '../helpers/api-fixtures';

test.describe('catalog regression', () => {
  test('public catalog exposes active public options and hides deactivated options', async ({ request }) => {
    const token = await loginAdmin(request);
    const name = `Massa Teste ${Date.now()}`;

    const createResponse = await request.post('/admin/options/doughs', {
      headers: authHeaders(token),
      data: { name, colorHex: '#f1c7d2' },
    });
    expect(createResponse.ok()).toBeTruthy();
    const created = await createResponse.json();

    const publicAfterCreate = await getPublicCatalog(request);
    const createdPublic = publicAfterCreate.doughs.find((item) => item.name === name);
    expect(createdPublic?.publicId).toBe(created.id);

    const renamed = `${name} Editada`;
    const updateResponse = await request.patch(`/admin/options/doughs/${created.id}`, {
      headers: authHeaders(token),
      data: { name: renamed, colorHex: '#f1c7d2' },
    });
    expect(updateResponse.ok()).toBeTruthy();

    const publicAfterRename = await getPublicCatalog(request);
    const renamedPublic = publicAfterRename.doughs.find((item) => item.name === renamed);
    expect(renamedPublic?.publicId).toBe(created.id);

    const deactivateResponse = await request.delete(`/admin/options/doughs/${created.id}`, {
      headers: authHeaders(token),
    });
    expect(deactivateResponse.ok()).toBeTruthy();

    const publicAfterDeactivate = await getPublicCatalog(request);
    expect(publicAfterDeactivate.doughs.some((item) => item.publicId === created.id)).toBe(false);
  });
});
