import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { Client } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private collectionPath = 'clients';
  constructor(private firestore: Firestore) {}

  get(userId: string): Observable<Client | null> {
    const colRef = collection(this.firestore, this.collectionPath);
    const q = query(colRef, where('userId', '==', userId));
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const doc = snapshot.docs[0];
        return doc ? ({ id: doc.id, ...doc.data() } as Client) : null;
      })
    );
  }

  set(data: Client): Observable<string> {
    const colRef = collection(this.firestore, this.collectionPath);
    return from(addDoc(colRef, data)).pipe(map((docRef) => docRef.id));
  }
}
