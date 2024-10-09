import { initializeApp } from 'firebase/app';
import { clientConfig, serverConfig } from './config';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const app = initializeApp(clientConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
