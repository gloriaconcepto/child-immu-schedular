/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {updateBabyImmunisedDataBase} from './sendSmsSchedular'; // Import the extracted function

admin.initializeApp();

export const scheduledFunction = functions.pubsub.schedule('every 5 minutes')
  .timeZone('Africa/Lagos') // Set the time zone to Nigeria
  .onRun(async (context) => {
    await updateBabyImmunisedDataBase(); // Call the extracted function
    return null;
  });
