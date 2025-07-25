import { db } from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';

// Check if running in a Node.js environment
const isNode = typeof window === 'undefined';

async function testFirestore() {
  if (isNode) {
    console.log("Running in Node.js environment, skipping analytics...");
  }
  try {
    const docRef = await addDoc(collection(db, "test"), {
      testField: "Hello from PATHWAY Checker!",
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

testFirestore();