export default class FacialRecognitionSDK {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, baseUrl: string = 'http://127.0.0.1:8000') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    private async _request<T>(
        endpoint: string,
        method: 'GET' | 'POST' | 'DELETE' = 'GET',
        body: any = null
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers: Record<string, string> = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };

        const options: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage}`);
        }
        return await response.json() as T;
    }

    async checkIn(faceImage: string): Promise<any> {
        if (!faceImage) throw new Error("faceImage is required for checkIn");
        return this._request<any>('/check', 'POST', { faceImage });
    }

    async getAttendanceRecord(startDate: string, endDate: string): Promise<any> {
        if (!startDate || !endDate) throw new Error("startDate and endDate are required for getAttendanceRecord");
        return this._request<any>('/attendance', 'POST', { startDate, endDate });
    }

    async updateUser(userId: string, faceImage: string): Promise<any> {
        if (!userId || !faceImage) throw new Error("userId and faceImage are required for updateUser");
        return this._request<any>('/update_user', 'POST', { userId, faceImage });
    }

    async deleteUser(userId: string): Promise<any> {
        if (!userId) throw new Error("userId is required for deleteUser");
        return this._request<any>('/delete_user', 'DELETE', { userId });
    }
}
