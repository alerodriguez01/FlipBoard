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
                    return user; // se guarda en la cookie de session

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
            token: el payload del JWT a crear y a almacenar en el lado del servidor (rutas creadas por next-auth)
            user: el usuario que se logueo (el que devolvio el authorize())
         */
        // Called whenever a JSON Web Token is created (i.e. at sign in)
        async jwt({ token, user, account, profile }) {

            if (user) {
                token.id = user.id;
                token.nombre = user.nombre;
                token.correo = user.correo;
                token.cursosAlumno = user.cursosAlumno;
                token.cursosDocente = user.cursosDocente;
                token.grupos = user.grupos;
                // token.accessToken = user.token; // el JWT devuelto por el backend
            }

            return token;
        },

        // https://next-auth.js.org/configuration/callbacks#session-callback
        // Called whenever a session is checked.
        /*
            session: la session (que tmb es un jwt) que se va a guardar en la cookie del navegador (next-auth.session-token)
            token: el payload del JWT creado en jwt()
         */
        // Cada vez que se verifica la sesion (llamando a useSession() por ejemplo, o con el middleware),
        // se llama a esta funcion. Busca el token (jwt) guardado en el lado del servidor (rutas creadas por next-auth)
        // y crea la session (que se guarda en la cookie del navegador)
        async session({ session, token }) {
            session.user = {
                id: token.id ?? "",
                nombre: token.nombre ?? "",
                correo: token.correo ?? "",
                cursosAlumno: token.cursosAlumno ?? [],
                cursosDocente: token.cursosDocente ?? [],
                grupos: token.grupos ?? [],
            };
            // session.accessToken = token.accessToken ?? "";
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
        // accessToken: string,
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
        // accessToken?: string
    }
}