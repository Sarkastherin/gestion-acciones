// Importar la biblioteca de cliente de Google API
const {google} = require('googleapis');

// Autenticar el cliente de Google API
const auth = new google.auth.GoogleAuth({
  // Especifique las credenciales de autenticación aquí
});

// Crear un nuevo borrador
async function crearBorrador() {
  // Cree un objeto de cliente de Gmail
  const gmail = google.gmail({version: 'v1', auth});

  // Cree un objeto de borrador
  const draft = await gmail.users.drafts.create({
    userId: 'me',
    requestBody: {
      message: {
        to: [
          {
            email: 'destinatario@ejemplo.com',
          },
        ],
        subject: 'Asunto del correo electrónico',
        body: {
          text: 'Contenido del correo electrónico',
        },
      },
    },
  });

  // Obtener el ID del borrador creado
  const draftId = draft.data.id;

  // Enviar el borrador
  await gmail.users.drafts.send({
    userId: 'me',
    requestBody: {
      id: draftId,
    },
  });
}

// Llame a la función para crear y enviar un borrador
crearBorrador();
