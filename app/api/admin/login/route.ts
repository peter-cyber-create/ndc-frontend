import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    // Server credentials: admin/conference2025
    if (username === 'admin' && password === 'conference2025') {
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Login failed' 
    }, { status: 500 })
  }
}
