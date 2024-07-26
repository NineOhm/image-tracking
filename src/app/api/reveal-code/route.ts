import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { targetIndex } = await request.json()

  const hiddenCodes: {[key: number]: string} = {
    0: 'SECRET_CODE_FITWHEY_01',
  }

  return NextResponse.json({ code: hiddenCodes[targetIndex] || 'No code found' })
}