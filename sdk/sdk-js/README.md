# Eagle Vision SDK

Eagle Vision SDK es una herramienta de reconocimiento facial diseñada para la autenticación de usuarios en tiempo real. Facilita la integración de funciones de check-in, gestión de usuarios y obtención de registros de asistencia en aplicaciones web. Es ideal para proyectos de control de acceso y toma de asistencia mediante tecnología facial.

## Instalación

Para instalar el SDK, usa el siguiente comando en tu terminal:

```bash
npm install eagle-vision-sdk
```

## Uso básico

Este es un ejemplo básico de cómo utilizar el SDK en una aplicación Node.js:

```javascript
import FacialRecognitionSDK from 'eagle-vision-sdk';

const sdk = new FacialRecognitionSDK('TU_API_KEY');

// Ejemplo de check-in
async function realizarCheckIn(faceImageBase64) {
  try {
    const resultado = await sdk.checkIn(faceImageBase64);
    console.log('Check-in exitoso:', resultado);
  } catch (error) {
    console.error('Error en el check-in:', error);
  }
}
```


## Métodos principales

### checkIn(faceImage)
Registra la entrada de un usuario utilizando una imagen facial.

- **Parámetros**: `faceImage` (String en formato Base64) - Imagen facial del usuario.
- **Retorno**: Objeto con la información del check-in realizado.

### getAttendanceRecord(startDate, endDate)
Obtiene un registro completo de asistencia para un rango de fechas.

- **Parámetros**:
  - `startDate`: Fecha de inicio (formato: 'YYYY-MM-DD').
  - `endDate`: Fecha de fin (formato: 'YYYY-MM-DD').
- **Retorno**: Array de objetos con los registros de asistencia.

### updateUser(userId, faceImage)
Actualiza la imagen de un usuario en el sistema de entrenamiento.

- **Parámetros**:
  - `userId`: ID del usuario a actualizar.
  - `faceImage`: Imagen facial del usuario en Base64 para actualizar en el sistema.
- **Retorno**: Objeto con la información actualizada del usuario.

### deleteUser(userId)
Elimina un usuario del sistema.

- **Parámetros**: `userId` - ID del usuario a eliminar.
- **Retorno**: Objeto con el resultado de la operación.

## Ejemplo completo

```javascript
import FacialRecognitionSDK from 'eagle-vision-sdk';

const sdk = new FacialRecognitionSDK('TU_API_KEY');

// Check-in
sdk.checkIn('imagenBase64').then(response => {
  console.log('Check-in exitoso:', response);
}).catch(error => {
  console.error('Error en el check-in:', error);
});

// Obtener registros de asistencia
sdk.getAttendanceRecord('2023-01-01', '2023-01-31').then(records => {
  console.log('Registros de asistencia:', records);
}).catch(error => {
  console.error('Error al obtener registros de asistencia:', error);
});

// Actualizar usuario
sdk.updateUser('user123', 'nuevaImagenBase64').then(updated => {
  console.log('Usuario actualizado:', updated);
}).catch(error => {
  console.error('Error al actualizar usuario:', error);
});

// Eliminar usuario
sdk.deleteUser('user123').then(result => {
  console.log('Usuario eliminado:', result);
}).catch(error => {
  console.error('Error al eliminar usuario:', error);
});
```

## Contribuciones

Contribuciones son bienvenidas. Si deseas colaborar en el desarrollo de este SDK, por favor sigue los siguientes pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcion`).
3. Realiza tus cambios y haz commit (`git commit -m 'Agregar nueva función'`).
4. Haz push a la rama (`git push origin feature/nueva-funcion`).
5. Abre un pull request para que podamos revisar tus cambios.

Agradecemos tus aportes para mejorar este proyecto.

## Licencia

Este proyecto está licenciado bajo la licencia [GNU GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html). Esto significa que cualquier proyecto derivado debe seguir siendo de código abierto y cumplir con los términos de la licencia GPL-3.0.


## Contacto

Para consultas adicionales o comentarios, puedes comunicarte con el autor:

- **Autor**: Luis Arturo Gonzalez Valencia
- **GitHub**: [https://github.com/luisgonzalezvalencia/proyectofinal-eagle-vision](https://github.com/luisgonzalezvalencia/proyectofinal-eagle-vision)
- **LinkedIn**: https://www.linkedin.com/in/luis-arturo-gonzalez-valencia/

