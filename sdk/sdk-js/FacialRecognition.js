class FacialRecognitionSDK {
  constructor(apiKey, baseUrl = 'http://127.0.0.1:8000') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async _request(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  }

  // Método para el registro de entrada
  async checkIn(faceImage) {
    if (!faceImage) throw new Error("faceImage is required for checkIn");
    return this._request('/check', 'POST', { faceImage });
  }

  // Método para obtener el registro de asistencia por rango de fechas
  async getAttendanceRecord(startDate, endDate) {
    if (!startDate || !endDate) throw new Error("startDate and endDate are required for getAttendanceRecord");
    return this._request('/attendance', 'POST', { startDate, endDate });
  }

  // Método para actualizar el usuario con nueva imagen para entrenamiento
  async updateUser(userId, faceImage) {
    if (!userId || !faceImage) throw new Error("userId and faceImage are required for updateUser");
    return this._request('/update_user', 'POST', { userId, faceImage });
  }

  // Método para eliminar un usuario del sistema
  async deleteUser(userId) {
    if (!userId) throw new Error("userId is required for deleteUser");
    return this._request('/delete_user', 'DELETE', { userId });
  }
}

export default FacialRecognitionSDK;