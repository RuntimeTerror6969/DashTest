import { NextResponse } from 'next/server'

// List of allowed origins
const allowedOrigins = [
  'https://quanttradertools.web.app',
  'http://localhost:3000',
  'http://localhost:5000',
]

export function middleware(request) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || ''
  
  // Only handle requests to the API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Check if the origin is allowed
    const isAllowedOrigin = allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development'
    
    // Create response headers
    const headers = new Headers()
    
    if (isAllowedOrigin) {
      headers.set('Access-Control-Allow-Origin', origin)
    }
    
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    headers.set('Access-Control-Max-Age', '86400') // 24 hours cache for preflight requests
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return NextResponse.json({}, { headers })
    }
    
    // For actual requests, return response with CORS headers
    const response = NextResponse.next()
    
    // Add the CORS headers to the response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }
  
  return NextResponse.next()
}

// Configure middleware to only run on API routes
export const config = {
  matcher: '/api/:path*',
} 