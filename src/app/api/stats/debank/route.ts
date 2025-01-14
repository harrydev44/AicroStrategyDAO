import { NextResponse } from 'next/server';
import { API_KEYS } from '../../../../config/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  // Ensure required query parameters are correctly structured
  const filteredParams = new URLSearchParams(searchParams);
  filteredParams.delete('endpoint'); // Remove 'endpoint' key from params

  if (
    !endpoint || 
    ![
      'user/total_balance',
      'user/history_list',
      'token/balance_list',
      'user/complex_protocol_list',
      'user/token_list'
    ].includes(endpoint)
  ) {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  }

  // Ensure the API key is available
  if (!API_KEYS.DEBANK) {
    console.error('Missing DeBank API Key!');
    return NextResponse.json({ error: 'Server misconfiguration: Missing API key' }, { status: 500 });
  }

  try {
    const url = `https://pro-openapi.debank.com/v1/${endpoint}${filteredParams.toString() ? '?' + filteredParams.toString() : ''}`;
    console.log('Fetching URL:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': API_KEYS.DEBANK,
      },
    });

    const data = await response.json();
    console.log('DeBank API Response:', data);

    if (!response.ok) {
      throw new Error(`DeBank API error: ${response.status} - ${JSON.stringify(data)}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('DeBank API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data from DeBank API' },
      { status: 500 }
    );
  }
}
