import { login, loginProvider } from "@/lib/auth";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = { // https://next-auth.js.org/configuration/options#options

    // https://next-auth.js.org/configuration/options#session
    session: {
        // Choose how you want to save the user session.
        strategy: "jwt",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 2 * 24 * 60 * 60, // 2 days
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
            // Es decir, se ejecuta solo cuando se hace login con usuario y contraseña
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

        // https://next-auth.js.org/providers/google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

        }),
    ],

    // https://next-auth.js.org/configuration/callbacks
    // Callbacks are asynchronous functions you can use to control what happens when an action is performed.
    callbacks: {

        // https://next-auth.js.org/configuration/callbacks#sign-in-callback
        // Called when a user signs in - es decir, cuando se llama a signIn(...) -
        // Es lo primero que se llama despues de llamar a signIn(...), excepto que se inicie sesion con
        // credenciales, en cuyo caso primero pasa por authorize; solo se ejecuta cuando se inicia sesion.
        // - user: viene con los datos cargados por el provider (google, credentials, etc)
        async signIn({ user, account, profile, email, credentials }) {

            // si inicio sesion con google, busco el usuario en la BD y lo retorno
            if (account?.provider === "google") {
                // Buscar el usuario en la BD
                const userLogged = await loginProvider(account.provider, user.name || "No name", user.email || `No email|${user.id}`);

                if (!userLogged) return '/?loginback=error'; // si sale mal, retorna la URL a la que se redirecciona

                user.id = userLogged.id;
                user.nombre = userLogged.nombre || "";
                user.correo = userLogged.correo || "";
                // user.image nos provee google
                user.cursosAlumno = userLogged.cursosAlumno;
                user.cursosDocente = userLogged.cursosDocente;
                user.grupos = userLogged.grupos;
                user.superUser = userLogged.superUser;
                user.token = userLogged.token;
            }

            return true; // si sale todo bien, retorna true
        },

        // https://next-auth.js.org/configuration/callbacks#jwt-callback
        /*
            token: el PAYLOAD del JWT a crear
            user: el usuario que se logueo (el que devolvio el authorize())
         */
        // Called whenever a JSON Web Token is created (i.e. at sign in) or whenever a session is accessed in the client.
        // SIEMPRE que se ejecute, crea un nuevo JWT, con su fecha de expiracion actualizada
        /*
            Caso A: 
              1. El usuario inicia sesión con credenciales. 
              2. Se llama a authorize(), retorna el user
              3. Se llama a signIn() con el user retornado por authorize()
              4. Se llama a jwt() con el user y un token vacio -> { name: undefined, email: undefined, picture: undefined, sub: '654276330c842ac6e1eeb1f4' }
              5. Se setean y retornan los datos del user en el payload (token) -> { sub: '654276330c842ac6e1eeb1f4', id: '...', nombre: '...', correo: '...', cursosAlumno: [], ... }
              6. Se guarda en la cookie del navegador, encriptado mediante JWE usando la clave secreta pasada como variable de entorno
            Caso B:
              1. El usuario ya esta logueado y se llama a useSession() o getSession() o se llama al middleware
              2. Se llama a jwt() solamente con el token decodificado que viene en la cookie del navegador (next-auth.session-token)
              3. Crear un nuevo JWT con los datos del token anterior, pero con la fecha de expiracion actualizada
              4. Se guarda en la cookie del navegador, encriptado mediante JWE
         */
        async jwt({ token, user, account, profile, trigger, session }) {

            // Si se llama a update(sessionActualizada) se actualiza el JWT con los datos de la session actualizada
            // Ejemplo de cuando se llama a update():
            // await update({
            //     ...session,
            //     user: {
            //       ...session?.user,
            //       cursosDocente: [...cursosDocente, curso.id]
            //     }
            //   });
            if (trigger === 'update') return { ...token, ...session.user }; // https://www.youtube.com/watch?v=gDsCueKkFEk&ab_channel=SakuraDev

            if (account?.provider === "google" && user) {
                token.id = user.id;
                token.nombre = user.name || "";
                token.correo = user.email || "";
                token.imagen = user.image || "";
                token.cursosAlumno = user.cursosAlumno;
                token.cursosDocente = user.cursosDocente;
                token.grupos = user.grupos;
                token.superUser = user.superUser;
                token.token = user.token;
            }

            if (account?.provider === "credentials" && user) {
                token.id = user.id;
                token.nombre = user.nombre;
                token.correo = user.correo;
                token.cursosAlumno = user.cursosAlumno;
                token.cursosDocente = user.cursosDocente;
                token.grupos = user.grupos;
                token.superUser = user.superUser;
                token.token = user.token;
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
                imagen: token.imagen ?? "",
                cursosAlumno: token.cursosAlumno ?? [],
                cursosDocente: token.cursosDocente ?? [],
                grupos: token.grupos ?? [],
                superUser: token.superUser ?? false,
                token: token.token,
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
};
const handler = NextAuth(authOptions)
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
        token: string, // jwt retornado por el backend
        superUser?: boolean,
    }
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string,
            nombre: string,
            correo: string,
            imagen: string,
            cursosAlumno: string[],
            cursosDocente: string[],
            grupos: string[],
            token: string, // jwt retornado por el backend
            superUser?: boolean,
        },
    }
}
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id: string
        nombre: string
        correo: string
        imagen: string
        cursosAlumno: string[],
        cursosDocente: string[],
        grupos: string[],
        token: string, // jwt retornado por el backend
        superUser?: boolean,
    }
}