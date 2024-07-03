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
import {fetchGuardiansPhones,updateBabyImmunisedDataBase} from './sendSmsSchedular'; // Import the extracted function
import { sendSmsService } from './services';


admin.initializeApp();

export const scheduledFunction = functions.pubsub.schedule('every 5 minutes')
  .timeZone('Africa/Lagos') // Set the time zone to Nigeria
  .onRun(async (context) => {
    try{
      const guardians = await fetchGuardiansPhones();
      for (const guardian of guardians) {
        const guardianRef = admin.firestore().collection('guardians').doc(guardian.id);
        const babiesSnapshot = await guardianRef.collection('babies').get();

        for (const babyDoc of babiesSnapshot.docs) {
            const babyData = babyDoc.data();
            if (babyData.babybeenimmunizdd < 5) {
                const message = `Reminder: Please ensure your baby ${babyData.babyfirstname} is immunized.`;
                const smsSent = await sendSmsService(guardian.phoneNumbers, message);
                if (smsSent) {
                    const newImmunizdd = babyData.babybeenimmunizdd + 1;
                    await updateBabyImmunisedDataBase(guardian.id, babyDoc.id, newImmunizdd);
                }
            }
        }
    }

    console.log('Scheduled function executed successfully.');
    return null;

      //go to the database fetch guardain phones.
      // then check if the if the baby is less than 5 if babybeenimmunizdd yes sendsms and update that babybeenimmunizdd for that baby
      // then move to the next guardian
    // const phoneNumbers =await fetchGuardiansPhones(); // Call the extracted function
    //  console.log('Guardian phone numbers:', phoneNumbers);
     //sendSmsService(phoneNumbers);

    }catch(error){
      console.error(error);
    }
    return null;
  });
  

  