// API Client for Amrit Dairy React Native App
export const BASE_URL = 'http://localhost:3000/api';

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
}

export async function checkPincode(pincode: string) {
  const res = await fetch(`${BASE_URL}/pincodes/check?pincode=${pincode}`);
  return res.json();
}

export async function fetchSubscriptions(customerId: string = 'cust-1') {
  const res = await fetch(`${BASE_URL}/subscriptions?customerId=${customerId}`);
  return res.json();
}

export async function toggleSkipDate(subscriptionId: string, date: string) {
  const res = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}/skip-date`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date }),
  });
  return res.json();
}

export async function rechargeWallet(customerId: string, amount: number) {
  const res = await fetch(`${BASE_URL}/customer/wallet/recharge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, amount }),
  });
  return res.json();
}
