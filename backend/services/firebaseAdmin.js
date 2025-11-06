import admin from "firebase-admin"
import dotenv from "dotenv"

dotenv.config()

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export const verifyToken = async (token) => {
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    return decoded
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export default admin
