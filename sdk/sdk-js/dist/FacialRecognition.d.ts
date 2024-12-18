export default class FacialRecognitionSDK {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string, baseUrl?: string);
    private _request;
    checkIn(faceImage: string): Promise<any>;
    getAttendanceRecord(startDate: string, endDate: string): Promise<any>;
    updateUser(userId: string, faceImage: string): Promise<any>;
    deleteUser(userId: string): Promise<any>;
}
