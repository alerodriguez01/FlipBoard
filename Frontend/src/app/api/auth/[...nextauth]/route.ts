import { login } from "@/lib/auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({ // https://next-auth.js.org/configuration/options#options

    // https://next-auth.js.org/configuration/options#session
    session: {
        // Choose how you want to save the user session.
        strategy: "jwt",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    //https://next-auth.js.org/configuration/options#jwt
    jwt: {
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        // maxAge: 30 * 24 * 60 * 60,
    },

    providers: [

        // https://next-auth.js.org/providers/credentials
        CredentialsProvider({
            name: "Usuario y contraseña",
            credentials: {
                correo: { type: "email" },
                contrasena: { type: "password" },
            },

            // una vez submiteado el form y validado, se llama a 
            // signIn("credentials", {correo: "...", contrasena: "..."}) que llama a esta funcion
            async authorize(credentials, req) {

                if (!credentials?.correo || !credentials?.contrasena) return null;

                try {
                    const user = await login(credentials.correo, credentials.contrasena);
                    return user; // luego se llama a jwt() con este user

                } catch (e) {
                    console.error("Error en authorize(): ", e);
                    return null; // si se retorna null, se devuelve un mensaje de error en la URL de la pagina de login
                }
            },
        }),
    ],

    // https://next-auth.js.org/configuration/callbacks
    // Callbacks are asynchronous functions you can use to control what happens when an action is performed.
    callbacks: {

        // https://next-auth.js.org/configuration/callbacks#jwt-callback
        /*
            token: el PAYLOAD del JWT a crear
            user: el usuario que se logueo (el que devolvio el authorize())
         */
        // Called whenever a JSON Web Token is created (i.e. at sign in) or whenever a session is accessed in the client.
        // SIEMPRE que se ejecute, crea un nuevo JWT, con su fecha de expiracion actualizada
        /*
            Caso A: 
              1. El usuario inicia sesión. 
              2. Se llama a authorize(), retorna el user
              3. Se llama a jwt() con el user y un token vacio -> { name: undefined, email: undefined, picture: undefined, sub: '654276330c842ac6e1eeb1f4' }
              4. Se setean y retornan los datos del user en el payload (token) -> { sub: '654276330c842ac6e1eeb1f4', id: '...', nombre: '...', correo: '...', cursosAlumno: [], ... }
              5. Se guarda en la cookie del navegador, encriptado mediante JWE usando la clave secreta pasada como variable de entorno
            Caso B:
              1. El usuario ya esta logueado y se llama a useSession() o getSession() o se llama al middleware
              2. Se llama a jwt() solamente con el token decodificado que viene en la cookie del navegador (next-auth.session-token)
              3. Crear un nuevo JWT con los datos del token anterior, pero con la fecha de expiracion actualizada
              4. Se guarda en la cookie del navegador, encriptado mediante JWE
         */
        async jwt({ token, user, account, profile }) {

            if (user) {
                token.id = user.id;
                token.nombre = user.nombre;
                token.correo = user.correo;
                token.cursosAlumno = user.cursosAlumno;
                token.cursosDocente = user.cursosDocente;
                token.grupos = user.grupos;
            }

            return token;
        },

        // https://next-auth.js.org/configuration/callbacks#session-callback
        // Called whenever a session is checked (getSession(), useSession())
        /*
            session: la session que va a retornarse cuando se llame a getSession() o useSession()
            token: el payload del JWT creado en jwt()
         */
        async session({ session, token }) {
            session.user = {
                id: token.id ?? "",
                nombre: token.nombre ?? "",
                correo: token.correo ?? "",
                cursosAlumno: token.cursosAlumno ?? [],
                cursosDocente: token.cursosDocente ?? [],
                grupos: token.grupos ?? [],
            };
            return session; // The return type will match the one returned in `useSession()`
        },
    },

    // https://next-auth.js.org/configuration/options#pages
    // Specify URLs to be used if you want to create custom sign in, sign out and error pages.
    // Pages specified will override the corresponding built-in page.
    pages: {
        // https://next-auth.js.org/configuration/pages#sign-in-page
        signIn: "/", // ruta a la que se redirecciona si no esta logueado o si se llama a signIn() -sin parametros-
        signOut: "/",
    },
});

export { handler as GET, handler as POST };

// --------------------------------------------------------------------------------------------- //
// https://next-auth.js.org/getting-started/typescript#module-augmentation
// Sobre-escribo las interfaces de next-auth para que se adapten a los campos que devuelve mi backend

declare module "next-auth" {
    /**
     * Usuario retornado por authorize()
     */
    interface User {
        id: string,
        nombre: string,
        correo: string,
        cursosAlumno: string[],
        cursosDocente: string[],
        grupos: string[],
        token: string,
    }
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string,
            nombre: string,
            correo: string,
            cursosAlumno: string[],
            cursosDocente: string[],
            grupos: string[],
        },
    }
}
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id: string
        nombre: string
        correo: string
        cursosAlumno: string[],
        cursosDocente: string[],
        grupos: string[],
    }
}