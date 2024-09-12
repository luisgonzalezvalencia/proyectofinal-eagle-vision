"use client";  // Agrega esto al principio

import React, { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { AlertCircle, CheckCircle2, Menu } from 'lucide-react'
import Link from 'next/link'

export default function Component() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [activeTab, setActiveTab] = useState('docs')
  const [activeMethod, setActiveMethod] = useState('installation')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica real de autenticación
    setIsLoggedIn(true)
  }

  const handleGenerateApiKey = () => {
    // Aquí iría la lógica real de generación de API Key
    setApiKey('sk_test_' + Math.random().toString(36).substr(2, 9))
  }

  const methods = [
    { id: 'installation', name: 'Instalación' },
    { id: 'usage', name: 'Uso Básico' },
    { id: 'checkIn', name: 'checkIn()' },
    { id: 'checkOut', name: 'checkOut()' },
    { id: 'getAttendanceRecord', name: 'getAttendanceRecord()' },
    { id: 'updateUser', name: 'updateUser()' },
    { id: 'deleteUser', name: 'deleteUser()' },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-100 p-4">
        <nav>
          <ul>
            {methods.map((method) => (
              <li key={method.id} className="mb-2">
                <Link 
                  href={`#${method.id}`}
                  className={`block p-2 rounded ${activeMethod === method.id ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-200'}`}
                  onClick={() => {
                    setActiveMethod(method.id)
                    setActiveTab('docs')
                  }}
                >
                  {method.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-6">SDK de Reconocimiento Facial - Documentación</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="docs">Documentación</TabsTrigger>
            <TabsTrigger value="auth">{isLoggedIn ? 'API Key' : 'Registro/Login'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>Documentación del SDK</CardTitle>
                <CardDescription>Guía de uso e implementación del SDK de Reconocimiento Facial</CardDescription>
              </CardHeader>
              <CardContent>
                {activeMethod === 'installation' && (
                  <>
                    <h2 id="installation" className="text-xl font-semibold mb-2">Instalación</h2>
                    <pre className="bg-gray-100 p-2 rounded mb-4">
                      npm install facial-recognition-sdk
                    </pre>
                  </>
                )}
                
                {activeMethod === 'usage' && (
                  <>
                    <h2 id="usage" className="text-xl font-semibold mb-2">Uso básico</h2>
                    <pre className="bg-gray-100 p-2 rounded mb-4">
                      {`import FacialRecognitionSDK from 'facial-recognition-sdk';

const sdk = new FacialRecognitionSDK('tu_api_key_aquí');

// Ejemplo de check-in
async function handleCheckIn(faceImageBase64) {
  try {
    const result = await sdk.checkIn(faceImageBase64);
    console.log('Check-in exitoso:', result);
  } catch (error) {
    console.error('Error en el check-in:', error);
  }
}`}
                    </pre>
                  </>
                )}
                
                {activeMethod === 'checkIn' && (
                  <>
                    <h2 id="checkIn" className="text-xl font-semibold mb-2">checkIn(faceImage)</h2>
                    <p className="mb-2">Registra la entrada de un usuario utilizando una imagen facial.</p>
                    <pre className="bg-gray-100 p-2 rounded mb-4">
                      {`const result = await sdk.checkIn(faceImageBase64);`}
                    </pre>
                    <p>Parámetros:</p>
                    <ul className="list-disc pl-5 mb-2">
                      <li><code>faceImage</code>: String (Base64) - Imagen facial del usuario</li>
                    </ul>
                    <p>Retorna: Objeto con información del check-in realizado</p>
                  </>
                )}

                {activeMethod === 'checkOut' && (
                  <>
                    <h2 id="checkOut" className="text-xl font-semibold mb-2">checkOut(faceImage)</h2>
                    <p className="mb-2">Registra la salida de un usuario utilizando una imagen facial.</p>
                    <pre className="bg-gray-100 p-2 rounded mb-4">
                      {`const result = await sdk.checkOut(faceImageBase64);`}
                    </pre>
                    <p>Parámetros:</p>
                    <ul className="list-disc pl-5 mb-2">
                      <li><code>faceImage</code>: String (Base64) - Imagen facial del usuario</li>
                    </ul>
                    <p>Retorna: Objeto con información del check-out realizado</p>
                  </>
                )}

                {activeMethod === 'getAttendanceRecord' && (
                  <>
                    <h2 id="getAttendanceRecord" className="text-xl font-semibold mb-2">getAttendanceRecord(userId, startDate, endDate)</h2>
                    <p className="mb-2">Obtiene el registro de asistencia de un usuario en un rango de fechas.</p>
                    <pre className="bg-gray-100 p-2 rounded mb-4">
                      {`const record = await sdk.getAttendanceRecord('user123', '2023-01-01', '2023-12-31');`}
                    </pre>
                    <p>Parámetros:</p>
                    <ul className="list-disc pl-5 mb-2">
                      <li><code>userId</code>: String - ID del usuario</li>
                      <li><code>startDate</code>: String - Fecha de inicio (formato: 'YYYY-MM-DD')</li>
                      <li><code>endDate</code>: String - Fecha de fin (formato: 'YYYY-MM-DD')</li>
                    </ul>
                    <p>Retorna: Array de objetos con los registros de asistencia</p>
                  </>
                )}

                {activeMethod === 'updateUser' && (
                  <>
                    <h2 id="updateUser" className="text-xl font-semibold mb-2">updateUser(userId, userData)</h2>
                    <p className="mb-2">Actualiza la información de un usuario.</p>
                    <pre className="bg-gray-100 p-2 rounded mb-4">
                      {`const updatedUser = await sdk.updateUser('user123', { name: 'Nuevo Nombre' });`}
                    </pre>
                    <p>Parámetros:</p>
                    <ul className="list-disc pl-5 mb-2">
                      <li><code>userId</code>: String - ID del usuario</li>
                      <li><code>userData</code>: Object - Datos del usuario a actualizar</li>
                    </ul>
                    <p>Retorna: Objeto con la información actualizada del usuario</p>
                  </>
                )}

                {activeMethod === 'deleteUser' && (
                  <>
                    <h2 id="deleteUser" className="text-xl font-semibold mb-2">deleteUser(userId)</h2>
                    <p className="mb-2">Elimina un usuario del sistema.</p>
                    <pre className="bg-gray-100 p-2 rounded mb-4">
                      {`const result = await sdk.deleteUser('user123');`}
                    </pre>
                    <p>Parámetros:</p>
                    <ul className="list-disc pl-5 mb-2">
                      <li><code>userId</code>: String - ID del usuario a eliminar</li>
                    </ul>
                    <p>Retorna: Objeto con el resultado de la operación</p>
                  </>
                )}
                
                <h2 className="text-xl font-semibold mb-2 mt-4">Manejo de errores</h2>
                <p className="mb-4">
                  Todos los métodos del SDK lanzan excepciones en caso de error. Asegúrate de manejar estas excepciones en tu código.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="auth">
            <Card>
              <CardHeader>
                <CardTitle>{isLoggedIn ? 'Generar API Key' : 'Registro / Login'}</CardTitle>
                <CardDescription>{isLoggedIn ? 'Genera tu API Key para usar el SDK' : 'Accede a tu cuenta o crea una nueva'}</CardDescription>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit">Iniciar Sesión / Registrarse</Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {apiKey ? (
                      <>
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle2 />
                          <span>API Key generada con éxito</span>
                        </div>
                        <div>
                          <Label htmlFor="apiKey">Tu API Key</Label>
                          <div className="flex mt-1">
                            <Input
                              id="apiKey"
                              type="text"
                              value={apiKey}
                              readOnly
                              className="flex-grow"
                            />
                            <Button
                              onClick={() => navigator.clipboard.writeText(apiKey)}
                              className="ml-2"
                            >
                              Copiar
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <AlertCircle />
                          <span>Guarda esta API Key en un lugar seguro. No podrás verla de nuevo.</span>
                        </div>
                      </>
                    ) : (
                      <Button onClick={handleGenerateApiKey}>Generar API Key</Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
