import { NextResponse } from 'next/server'
import { API_KEYS } from '@/config/api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const queryParams = searchParams.toString().replace(`endpoint=${endpoint}&`, '')
  
  if (!endpoint) {
    return NextResponse.json({ error: 'No endpoint specified' }, { status: 400 })
  }

  try {
    const url = `https://pro-openapi.debank.com/v1/${endpoint}${queryParams ? '?' + queryParams : ''}`
    console.log('Fetching URL:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': API_KEYS.DEBANK,
      },
    })

    const data = await response.json()
    console.log('DeBank API Response:', data)
    
    if (!response.ok) {
      throw new Error(`DeBank API error: ${response.status}`)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('DeBank API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data from DeBank API' },
      { status: 500 }
    )
  }
} 