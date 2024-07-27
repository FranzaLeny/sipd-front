import { NextResponse } from 'next/server'
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'

const authenticatedRoutes = [
   '/dashboard',
   '/data',
   '/kepegawaian',
   '/keuangan',
   '/perencanaan',
   '/sipd-ri',
   '/profile',
   '/sipd-peta',
]

function authorizeRequest(request: NextRequestWithAuth): NextResponse {
   const { pathname } = request.nextUrl
   const isAuthenticationRequired = authenticatedRoutes.some((route) => pathname.startsWith(route))
   const isUserAuthenticated = Boolean(request.nextauth.token)
   const isLoginPath = pathname.startsWith('/login')
   const searchParams = request?.nextUrl?.searchParams

   if (isUserAuthenticated && isLoginPath) {
      const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard'
      const returnUrl = new URL(callbackUrl, request.nextUrl)
      return NextResponse.redirect(returnUrl)
   } else if (!isUserAuthenticated && isAuthenticationRequired) {
      const returnUrl = new URL('/login', request.nextUrl)
      returnUrl.searchParams.set('callbackUrl', pathname + '?' + searchParams?.toString())
      return NextResponse.redirect(returnUrl)
   }

   return NextResponse.next()
}

export default withAuth(authorizeRequest, {
   callbacks: {
      authorized: async ({ token }) => {
         return true
      },
   },
})

export const config = {
   matcher: ['/((?!/api/auth|_next/static|_next/image|images|icon|fonts|logstores|favicon.ico).*)'],
}
