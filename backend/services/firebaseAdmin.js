import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Load service account JSON manually (Node 22 no longer allows JSON import assertions)
const serviceAccountPath = path.resolve(
  "config/fitness-x-feebd-firebase-adminsdk-fbsvc-5171ffe5ac.json"
);

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf-8")
);

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
