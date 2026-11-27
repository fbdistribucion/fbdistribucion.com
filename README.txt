FB DISTRIBUCION - SISTEMA WEBHOOK

ARCHIVOS
1. index.html
2. styles.css
3. script.js
4. README.txt

IMPORTANTE
- index.html y styles.css se mantienen sin modificaciones.
- script.js conserva el año y el menú existente, y envía el correo ingresado
  al webhook de Make mediante una solicitud POST en formato JSON.
- La dirección del webhook ya está colocada en script.js.

CONFIGURACIÓN PENDIENTE EN MAKE
1. Abrí el escenario donde creaste el webhook "FB DISTRIBUCION".
2. Dejá el webhook como primer módulo.
3. Agregá los módulos que necesites para procesar la consulta.
4. Para que la página reciba una respuesta JSON, agregá al final
   Webhooks > Webhook response.
5. Configurá ese módulo para devolver un cuerpo JSON, por ejemplo:
   {"success":true,"message":"Consulta recibida"}
   y el encabezado Content-Type: application/json.
6. Guardá el escenario y activalo (ON).

PRUEBA INICIAL
- En Make, tocá Run once para que el webhook escuche una solicitud.
- Probá el formulario de la página con un correo de prueba.
- Make debería capturar el campo "email".
- Después guardá/activá el escenario y volvé a probar.

SEGURIDAD
La URL del webhook queda visible en el JavaScript de una página pública.
No la uses para recibir contraseñas, códigos de acceso ni información sensible.
Si recibís spam o solicitudes no autorizadas, regenerá/cambiá la URL del webhook.
