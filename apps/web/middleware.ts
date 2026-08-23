import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/uk' || pathname.startsWith('/uk/')) {
    const url = request.nextUrl.clone()

    url.pathname = pathname === '/uk' ? '/' : pathname.slice('/uk'.length)

    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}
