# Posteable
Posteable API REST pretende ser una solución simple y eficiente para el nucleo de alguna implementación en donde sea necesario manejar unn grupo de usuarios capaces de incluir en un mismo lugar información relevante como parte de una aplicación mas grande. 

Ejemplos de esto podrian ser una pagina de comentarios en una tienda electronica, en un resturante, algún sistema de seguimiento de estado de usuarios o incluso una pequeña red social.
> Este proyecto es considerado totalmente open source siendo bienvenido cualquier aporte externo que pueda ser posteble una solución más poderosa! 🔥 
 ## Indice
[Principales Features](#principales-features)
[Tecnologias Usadas](#tecnologias)
[Requisitos](#requisitos)
[Setup](#setup)
[Endpoints](#endpoints)
[Autenticación](#autenticación)
[Contribuciones](#contribuciones)
 ## Principales Features
* Manejo de base de datos SQL para manejar una colección de posts y usuarios que interactuan con ellos, manejando por default el update y delete automatico en base a la modificación de la información de usuarios.

* Operaciones CRUD [ DELETE , POST, GET, PATCH ] tanto para la colleción usuarios como para posts y ademas una coleción 'likes' a traves de la cual un usuario puede tener una coleción privada de los posts que considere relevantes.

* Sistema de autenticación usado para validar y almacenar información del usuario, preferencias y protección de endpoints privados

* Manejo solido de errores a traves de codigos de estado http para validación de datos de parte del cliente tanto como para errores por servicios externos como la base de datos.

## Tecnologias Usadas
> Esta aplicación usa como tecnologias principales, Node js como entorno de desarrollo, Typescript para validación de modelos y errores, Express como framework, JSON Web Token para el manejo de sesiones, para el sistema de persistencia se ha utilizado PostgreSQL y para ciertos test unitarios se ha usado Vitest.

<div style="display: flex; justify-content: center; flex-wrap:wrap; column-gap:8px;">
![NODE js](https://img.icons8.com/color/48/nodejs.png)  
![Typescript](https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-typescript-an-open-source-programming-language-developed-and-maintained-by-microsoft-logo-color-tal-revivo.png)
![express js](https://img.icons8.com/offices/30/express-js.png)
![JWT](https://img.icons8.com/plumpy/48/json.png)
![SQL](https://img.icons8.com/color/48/sql.png)
![PostGreSQL](https://img.icons8.com/color/48/postgreesql.png)
![vitest]()
</div>
<img width="48" height="48" src="https://img.icons8.com/color/48/java-web-token.png" alt="java-web-token"/>
## Requisitos
Es necesario tener Node js, npm, y PostgreSQL instalados en tu entorno de desarrollo.
## Setup
### 1) Variables de entorno (.env)
En esta sección verificaremos los pasos necesarios minimos para levantar posteable, viendo tambien en el proceso el archivo de referencia .env.example que servirá de guia para las variables de entorno necesarias para lograrlo. (.env localizado en la raiz tu proyecto)
#### env.example
```
PGHOST='example.host'
PGDATABASE='nombre_de_base_de_datos'
PGUSER='nombre_de_usuario_postgres'
PGPASSWORD='password'
PORT=3000
MODE=PRO 
SECRET_TOKEN="secret_1"
SECRET_COOKIE="secret_2"
HOST='*'
```

##### Variables requridas por pg: 
 * PGHOST: Hace referencia al HOST de la base de datos a utilizar, localhost para pruebas locales.
 * PGDATABASE: Hace referencia al nombre de la base de datos.
 * PGPASSWORD: Hace referencia a la contraseña del usuario de psql.
 * PGUSER: Usuario a utilizar para conectar a la base de datos.
 > más información comentada en el archivo encontrado en el directorio config/pg.config.ts y la documentación oficial sobre este tema puede ser encontrada aqui [Pool Client pg](https://node-postgres.com/apis/pool).
##### Variables generales
* PORT: Hace referencia al puerto donde se ejecutara posteable.

* MODE: Posteable maneja por defecto modo produccion (PRO) y desarrollo (DEV), El cual a grande rasgos te permite manejar base de datos adicionales, mayor información de parte del logger sobre el debug y warnings etc que puedan ocurrir mientras se toma posteable para una implementación especifica.

* HOST: hace referencia al host donde posteable tendra permitido servir respuestas, principalmente importante para la configuración CORS de posteble.

* Secrets: Tanto SECRET_TOKEN y SECRET_COOKIE hacen referencia a cadenas de caracteres, relacionado a la implementación de autenticación deposteable, mediante las cuales se verificará la firma al momento de verificar tokens y cookies.

### 2) Base de datos 
Para usar esta aplicación es necesario tener bien sea instalado postgres en tu computadora o manejar una base ya hosteada en algun lugar y asi poder crear una base de datos donde podras insertar el que será el contenido de esa base de datos ubicada en el directorio data/db.sql.
En ese archivo encontraras la sentencia psql requerida y ya finalmente sera incluir en el archivo .env los campos requeridos. 
### 3) Iniciar Posteable
Ya seteada la base de datos y nuetras variables de entorno los siguientes pasos seran iniciar posteable, para eso debemos instalar las dependencias a traves de el comando: 
```
npm install 
```
y dependiendo si queremos iniciar el modo desarrollo. 
```
npm run dev
```
Posteable tambien incluye una sección de test con información bastante util(aun por refinar)
```
npm run test
```
o finalmente producción. 
```
npm start
```
> más información sobre los scripts y dependencias puede ser encontrada en el package.json de posteable.
### Estructura de la aplicación 
Posteable sigue una arquitectura de tres capas:
* Routers: Para dirigir las solicitudes HTTP.
* Servicios: Haciendo la función de controladores y haciendo las validaciones necesarias antes de acceder a la capa de la base de datos.
* Managers: Son los que se encargan de comunicarse con la base de datos PostgreSQL utilizando pg, esto manejando el consepto de DAO de manera tal que un cambio de persistencia o logica con respecto a la base de datos no involucra nada mas alla de esta capa.

adicionalmente Posteable maneja la capa de modelos y esquemas complementaria para realizar validaciones y tambien un directorio de configuraciones donde se setean intancias de drivers generales requeridas para el inicio de la aplicación. 
## Endpoints
##### GET / (Ver Todos los Posts con Paginación y Filtros)
- **Descripción**: Retorna una lista de posts disponibles en la plataforma, con opciones de paginación, filtrado por usuario y ordenación.
- **Parámetros Query**:
  - `page`: Número de página (opcional, por defecto 1).
  - `limit`: Número de posts por página (opcional, por defecto 10).
  - `username`: Filtrar posts por nombre de usuario (opcional).
  - `orderBy`: Criterio de ordenación, opciones: createdAt, likesCount (opcional, por defecto createdAt).
  - `order`: Dirección de la ordenación, opciones: asc, desc (opcional, por defecto asc).
- **Respuesta**:
  - `200 OK`: Lista paginada de posts en formato JSON.
  - **Ejemplo de Respuesta**:
    ```json
    {
      "ok": true,
      "data": [
        {
          "id": 1,
          "content": "Este es un el contenido de un post",
          "createdAt": "2024-01-19 07:37:16-08",
          "updatedAt": "2024-01-19 07:37:16-08",
          "username": "testino",
          "likesCount": 5
        },
        ...
      ],
      "pagination": {
        "page": 1,
        "pageSize": 10,
        "totalItems": 20,
        "totalPages": 2,
        "nextPage": 2,
        "previousPage": null
      }
    }
    ```
  - **Ejemplo de Uso**:
    Para obtener la segunda página de posts, limitando a 5 posts por página, filtrando por el usuario 'usuarioEjemplo', ordenados por número de likes en orden descendente:
    `GET /?page=2&limit=5&username=usuarioEjemplo&orderBy=likesCount&order=desc`
##### GET /likes (Ver Posts likeados del Usuario Registrado)

- **Descripción**: Muestra los post a los cuales el usuario registrado a agregado un like, pueden ser posts propios tanto como de otras personas.
- **Parámetros Query**:
  - `page`: Número de página (opcional, por defecto 1).
  - `limit`: Número de posts por página (opcional, por defecto 10).
  - `orderBy`: Criterio de ordenación, opciones: createdAt, likesCount (opcional, por defecto createdAt).
  - `order`: Dirección de la ordenación, opciones: asc, desc (opcional, por defecto asc).
- **Respuesta**:
  - `200 OK`: Lista de posts del usuario en formato JSON.
  - `401 si no se ha autenticado el usuario en cuestion.`
  - **Ejemplo de Respuesta**:
    ```json
    {
      "ok": true,
      "data": [
        {
          "id": 2,
          "content": "Post del usuario",
          "createdAt": "2024-01-19 05:37:16-08",
          "updatedAt": "2024-01-19 05:37:16-08",
          "username": "usuario-específico",
          "likesCount": 0
        },
        ...
      ],
      "pagination": {
        "page": 1,
        "pageSize": 10,
        "totalItems": 5,
        "totalPages": 1,
        "nextPage": null,
        "previousPage": null
      }
    }
    ```

#### Interacción de Usuarios Registrados
##### POST /posts (Crear Nuevo Post)

- **Descripción**: Permite a un usuario registrado crear un nuevo post.
- **Body**:
  - `content`: Texto del post.
- **Respuesta**:
  - `201 Created`: Post creado exitosamente.
  - `400 Bad Request`: Si falta información o el formato es incorrecto.
  - `401 Unauthorized`: Si el usuario no está autenticado.
  - **Ejemplo de Respuesta**:
    ```json
    {
      "ok": true,
      "data": {
        "id": 10,
        "content": "Mi nuevo post",
        "createdAt": "2024-01-19 10:37:16-08",
        "updatedAt": "2024-01-19 10:37:16-08",
        "username": "mi-usuario",
        "likesCount": 0
      }
    }
##### PATCH /posts/:id (Editar Post Existente)

- **Descripción**: Permite a un usuario registrado editar un post existente.
- **Parámetros URL**:
  - `id`: ID del post a editar.
- **Body**:
  - `content`: Texto actualizado del post. (El campo es opcional, pero se debe enviar al menos un campo para actualizar)
- **Respuesta**:
  - `200 OK`: Post actualizado exitosamente. Devuelve el post actualizado.
  - `400 Bad Request`: Si falta información, el formato es incorrecto o no se envía ningún campo para actualizar.
  - `401 Unauthorized`: Si el usuario no está autenticado o no es el propietario del post.
  - `404 Not Found`: Si el post no existe.
  - **Ejemplo de Respuesta**:
    ```json
    {
      "ok": true,
      "data": {
        "id": 10,
        "content": "Mi post actualizado",
        "createdAt": "2024-01-19 10:37:16-08",
        "updatedAt": "2024-01-19 11:00:00-08",
        "username": "mi-usuario",
        "likesCount": 0
      }
    }
    ```
    ##### POST /posts/:postId/like (Dar Like a un Post)

- **Descripción**: Permite a un usuario registrado dar "Like" a un post.
- **Parámetros**:
  - `postId`: ID del post a dar like.
- **Respuesta**:
  - `200 OK`: Like registrado.
  - `404 Not Found`: Si el post no existe.
  - `401 Unauthorized`: Si el usuario no está autenticado.
  - **Ejemplo de Respuesta**:
    ```json
    {
      "ok": true,
      "data": {
        "id": 15,
        "content": "Mi nuevo post",
        "createdAt": "2024-01-19 10:37:16-08",
        "updatedAt": "2024-01-19 10:37:16-08",
        "username": "usuario",
        "likesCount": 1
      }
    }
    ```

##### DELETE /posts/:postId/like (Eliminar Like de un Post)

- **Descripción**: Permite a un usuario eliminar su "Like" de un post.
- **Parámetros**:
  - `postId`: ID del post a remover like.
- **Respuesta**:
  - `200 OK`: Like eliminado.
  - `404 Not Found`: Si el post no existe o no tenía like previamente.
  - `401 Unauthorized`: Si el usuario no está autenticado.
  - **Ejemplo de Respuesta**:
    ```json
    {
      "ok": true,
      "data": {
        "id": 15,
        "content": "Mi nuevo post",
        "createdAt": "2024-01-19 10:37:16-08",
        "updatedAt": "2024-01-19 10:37:16-08",
        "username": "usuario",
        "likesCount": 0
      }
    }
    ```

#### Registro y Autenticación de Usuarios

##### POST /signup (Crear Cuenta)

- **Descripción**: Permite a un nuevo usuario registrarse en la plataforma.
- **Body**:
  - `username`, `password`: Campos requeridos para el registro.
- **Respuesta**:
  - `201 Created`: Cuenta creada.
  - `400 Bad Request`: Si falta información o el formato es incorrecto.
  - **Ejemplo de Respuesta**:
    ```json
    {
      "ok": true,
      "data": {
        "id": 20,
        "username": "nuevoUsuario",
        "email": "un-mail@example.com",
        "firstName": "Nombre",
        "lastName": "Apellido",
        "createdAt": "2024-01-19 10:37:16-08",
        "updatedAt": "2024-01-19 10:37:16-08"
      }
    }
    ```

##### POST /login (Iniciar Sesión)

- **Descripción**: Permite a un usuario existente iniciar sesión.
- **Body**:
  - `username`, `password`: Credenciales requeridas para el inicio de sesión.
- **Respuesta**:
  - `200 OK`: Sesión iniciada, retorna token JWT.
  - `401 Unauthorized`: Credenciales incorrectas.
  - **Ejemplo de Respuesta**:
    ```json
    {
      "ok": true,
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5..."
      }
    }
    ```

#### Gestión de Perfil de Usuario

##### GET /me (Ver Perfil de Usuario)

**Descripción:** Muestra el perfil del usuario autenticado.

**Respuesta:**

- 200 OK: Información del perfil en formato JSON.
- 401 Unauthorized: Si el usuario no está autenticado.

**Ejemplo de Respuesta:**

```json
{
  "ok": true,
  "data": {
    "id": 2,
    "username": "miUsuario",
    "email": "miemail@example.com",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "createdAt": "2024-01-19 10:37:16-08",
    "updatedAt": "2024-01-19 10:37:16-08"
  }
}
```

###### PATCH /me (Editar Cuenta de Usuario)

**Descripción:** Permite al usuario editar su información de perfil.

**Body:**

- email, firstName, lastName: Campos opcionales para actualizar.

**Respuesta:**

- 200 OK: Perfil actualizado.
- 400 Bad Request: Si el formato es incorrecto.
- 401 Unauthorized: Si el usuario no está autenticado.

**Ejemplo de Respuesta:**

```json
{
  "ok": true,
  "data": {
    "id": 2,
    "username": "miUsuario",
    "email": "nuevo@mail.com",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "createdAt": "2024-01-19 10:37:16-08",
    "updatedAt": "2024-01-19 11:00:16-08"
  }
}
```

##### DELETE /me (Eliminar Cuenta de Usuario)

**Descripción:** Permite al usuario eliminar su cuenta.

**Respuesta:**

- 200 OK: Cuenta eliminada.
- 401 Unauthorized: Si el usuario no está autenticado.

**Ejemplo de Respuesta:**

```json
{
  "ok": true
}
```
## Autenticación
En este proyecto, utilizamos JSON Web Token (JWT) para gestionar la autenticación. JWT es un estándar abierto (RFC 7519) que define una forma compacta y autónoma de transmitir información de manera segura entre las partes como un objeto JSON. En el contexto de la autenticación, JWT se utiliza para generar tokens que pueden ser verificados para asegurar la identidad del usuario.
### Cómo Funciona
1. **Generación del Token:**
   - Cuando un usuario se autentica con éxito, se genera un JWT que contiene información sobre el usuario y posiblemente otros datos relevantes.
2. **Envío del Token:**
   - El token JWT se envía al cliente, generalmente como parte de la respuesta después de una autenticación exitosa.
3. **Almacenamiento del Token:**
   - El cliente almacena el token, generalmente en el almacenamiento local o en las cookies, para incluirlo en las solicitudes posteriores a recursos protegidos.
4. **Verificación del Token:**
   - En cada solicitud a un recurso protegido, el servidor verifica la validez del token JWT recibido. Si el token es válido, se permite el acceso al recurso protegido.
> Posteable implementa verificación de firmas de estos tokens y asi asegurar que la información en posesión del cliente no ha sido modificada. 

## Contribuciones

Si deseas contribuir al desarrollo de esta API, simplemente realiza un Pull Request con tus cambios y para que sean revisados a posteable core o tambien eres libre de tomarlo y hacer algo diferente en un proyecto diferente.
