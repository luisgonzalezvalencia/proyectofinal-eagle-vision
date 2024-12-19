'use client';

import { useEagleVision } from '@/hooks/useEagleVision';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function CheckInPage() {
  const webcamRef = useRef<Webcam>(null);
  const sdk = useEagleVision();
  const [status, setStatus] = useState<string>();
  const [image, setImage] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [userList, setUserList] = useState<string[]>([]);

  // Captura la imagen desde la cámara
  const captureImage = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      setStatus('Error: No se pudo capturar la imagen.');
      return;
    }
    setImage(screenshot);
    setStatus('Verificando...');

    // Llamar al SDK y manejar el progreso
    try {
      const result = await sdk.checkIn(screenshot); // Llamada al método del SDK
      const users = result.users;
      if (users.length === 0) {
        setStatus('Error: No se pudo verificar la identidad, intenta nuevamente.');
        startTimer(5, resetState);
        return;
      }
      const mensaje = users.length > 1 ? `Bienvenidos, ${users.join(', ')}!` : `Bienvenido, ${users[0] || 'Usuario'}!`;
      //TODO: almacenar visualmente los asistentes
      setUserList((prev) => [...prev, ...users]);
      setStatus(`Bienvenido, ${result.users || 'Usuario'}!`);
      startTimer(15, resetState);
    } catch {
      setStatus('Error: No se pudo verificar el check-in.');
      startTimer(5, resetState);
    }
  };

  const startTimer = (seconds: number, callback: () => void) => {
    setTimer(seconds);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          callback();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Reinicia el estado del componente
  const resetState = () => {
    setImage(null);
    setStatus('Esperando...');
    setTimer(null);
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">Check-In</h1>

      {/* Mostrar Imagen o Cámara */}
      <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-lg">
        {!image ? (
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
        ) : (
          <Image src={image} alt="Capturada" layout="fill" objectFit="cover" />
        )}
      </div>

      {/* Botón de Captura */}
      {!image && (
        <button onClick={captureImage} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Capturar Imagen
        </button>
      )}

      {/* Mensaje de Estado */}
      <p className="mt-4 text-lg text-gray-700">{status}</p>

      {timer && (
        <button onClick={resetState} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Finalizar
        </button>
      )}

      {/* Temporizador */}
      {timer !== null && <p className="mt-2 text-sm text-gray-500">Reiniciando en {timer} segundos...</p>}

      {/* Lista de Usuarios */}
      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-500">Ids últimos usuarios detectados:</h2>
        <ul className="list-disc list-inside bg-white p-4 rounded shadow">
          {userList.map((user, index) => (
            <li key={index} className="text-gray-700">
              {user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

