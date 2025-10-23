import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // get the sessionid cookie from the request
    const sessionId = request.cookies.get('sessionid')?.value;

    // if there's no sessionid cookie then redirect to login
    if (!sessionId) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    // otherwise allow the request to continue
    return NextResponse.next();
}
 
export const config = {
  matcher: ['/main/:path*',]
}