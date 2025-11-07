import admin from "firebase-admin";
import serviceAccount from "../config/fitness-x-feebd-firebase-adminsdk-fbsvc-5171ffe5ac.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const verifyToken = async (token) => {
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error("Firebase verify error:", error.message);
    throw new Error("Invalid token");
  }
};
