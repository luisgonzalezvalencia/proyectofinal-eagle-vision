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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  }


  // Registro de entrada (actualizado)
  async checkIn(faceImage) {
    return this._request('/check', 'POST', { faceImage });
  }

}

export default FacialRecognitionSDK;