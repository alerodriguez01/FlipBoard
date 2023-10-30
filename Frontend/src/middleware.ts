/*
    Documentacion:
    - https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#protecting-pages-with-middleware
*/
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest, res: NextResponse) {

   console.log("hola desde el middleware")
};

export const config = {
    matcher: '/murales'
};