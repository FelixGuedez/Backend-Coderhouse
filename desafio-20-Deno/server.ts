import { serve } from "https://deno.land/std@0.144.0/http/server.ts"
import { bgYellow, red, bold } from "https://deno.land/std/fmt/colors.ts"
const Port = 8080

function handler( request: Request): Response {
    const body = bgYellow(bold(red('Hola Mundo desde Deno Server')))
    const body2 = 'Hola Mundo desde Deno Server'
    console.log(body)
    return new Response(body2)
}

await serve (handler, {Port} )