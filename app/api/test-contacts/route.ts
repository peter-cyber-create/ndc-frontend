import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Test contacts API called with:', body)
    
    return NextResponse.json({
      success: true,
      message: 'Test contacts API working',
      receivedData: body
    })
    
  } catch (error) {
    console.error('Error in test contacts API:', error)
    return NextResponse.json({ error: 'Test contacts API failed' }, { status: 500 })
  }
}
