import admin from 'firebase-admin';
import { serverConfig } from './config';
export async function initAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({ ...serverConfig.serviceAccount });

  return admin.initializeApp({
    credential: cert,
    projectId: serverConfig.serviceAccount.projectId,
  });
}
