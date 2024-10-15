import { cert, getApps, initializeApp, type AppOptions } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

const firebaseAdminConfig: AppOptions = {
   credential: cert({
      privateKey: process.env.FIREBASE_PRIVATE_KEY || ''.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
      projectId: process.env.FIREBASE_PROJECT_ID || '',
   }),
   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
}
// Periksa apakah Firebase sudah diinisialisasi sebelumnya

// Initialize Firebase
const app = getApps().length <= 0 ? initializeApp(firebaseAdminConfig) : getApps()[0]

export const storage = getStorage(app)
