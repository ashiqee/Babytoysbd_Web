export async function fetchShippings() {
  const res = await fetch('/api/shippings');
  const json = await res.json();
  return json.data;
}

export async function createShipping(data: any) {
  const res = await fetch('/api/shippings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updateShipping(id: string, data: any) {
  const res = await fetch(`/api/shippings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteShipping(id: string) {
  await fetch(`/api/shippings/${id}`, { method: 'DELETE' });
}
