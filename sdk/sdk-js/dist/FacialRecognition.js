"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class FacialRecognitionSDK {
    constructor(apiKey, baseUrl = 'http://127.0.0.1:8000') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }
    _request(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, method = 'GET', body = null) {
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
            const response = yield fetch(url, options);
            if (!response.ok) {
                const errorMessage = yield response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorMessage}`);
            }
            return yield response.json();
        });
    }
    checkIn(faceImage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!faceImage)
                throw new Error("faceImage is required for checkIn");
            return this._request('/check', 'POST', { faceImage });
        });
    }
    getAttendanceRecord(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!startDate || !endDate)
                throw new Error("startDate and endDate are required for getAttendanceRecord");
            return this._request('/attendance', 'POST', { startDate, endDate });
        });
    }
    updateUser(userId, faceImage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !faceImage)
                throw new Error("userId and faceImage are required for updateUser");
            return this._request('/update_user', 'POST', { userId, faceImage });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw new Error("userId is required for deleteUser");
            return this._request('/delete_user', 'DELETE', { userId });
        });
    }
}
exports.default = FacialRecognitionSDK;
