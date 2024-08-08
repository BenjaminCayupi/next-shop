import { NextResponse } from 'next/server';

const paypal = require('@paypal/checkout-server-sdk');

// Creating an environment
let clientId =
  'ASFE7fOEXjBNXrJUVsQFl_zuvH211434Se8XbvJGgApoDQNg0DF-lVhdj_Nt2fZK_N7j-5OY8jhkr4gq';
let clientSecret =
  'ED452RvwekKD9kKNpdtmwatUFhOcZ2exDKR6z4diOhjhHOkvkhQ8ZZLnqL0XACZYt7D8EZY2lYWlcDMD';

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

export async function POST() {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: '100.00',
        },
      },
    ],
  });

  const response = await client.execute(request);
  console.log('response :', response);
  console.log('response.result.id :', response.result.id);
  return NextResponse.json({ id: response.result.id });
}
