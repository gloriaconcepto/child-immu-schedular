import * as admin from 'firebase-admin';


export const fetchGuardiansPhones = async (): Promise<{ id: string; phoneNumbers: string[] }[]> => {
  const db = admin.firestore();
  const guardiansRef = db.collection('guardians');
  const guardians: { id: string; phoneNumbers: string[] }[] = [];

  try {
      const snapshot = await guardiansRef.get();

      snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.phonenumbers && Array.isArray(data.phonenumbers)) {
              guardians.push({ id: doc.id, phoneNumbers: data.phonenumbers });
          }
      });

      return guardians;
  } catch (error) {
      console.error('Error fetching guardian phone numbers: ', error);
      throw new Error('Failed to fetch phone numbers');
  }
};

export const updateBabyImmunisedDataBase = async (guardianId: string, babyId: string, newImmunizdd: number) => {

  const db = admin.firestore();
  const babyRef = db.collection('guardians').doc(guardianId).collection('babies').doc(babyId);
  await babyRef.update({ babybeenimmunizdd: newImmunizdd });
};

// export const updateBabyImmunisedDataBase = async () => {
//     console.log('run update baby immunised');

//     const db = admin.firestore();
//     const guardiansRef = db.collection('guardians');

//     try {
//         const snapshot = await guardiansRef.get();
//         const batch = db.batch();

//         for (const doc of snapshot.docs) {
//             const babiesRef = guardiansRef.doc(doc.id).collection('babies');
//             const babiesSnapshot = await babiesRef.get();
//             for (const babyDoc of babiesSnapshot.docs) {
//                 const babyData = babyDoc.data();
//                 if (babyData.babybeenimmunizdd < 5) {
//                     const newImmunizdd = babyData.babybeenimmunizdd + 1;
//                     batch.update(babyDoc.ref, { babybeenimmunizdd: newImmunizdd });
//                 }
//             }
//         }

//         await batch.commit();
//         console.log('Successfully updated babybeenimmunizdd for eligible babies');

//     } catch (error) {
//         console.error('Error updating babybeenimmunizdd: ', error);
//     }
// };

// export const fetchGuardiansPhones = async (): Promise<string[]> => {
//     const db = admin.firestore();
//     const guardiansRef = db.collection('guardians');
//     const phoneNumbers: string[] = [];
//     console.log('running guardian phone numbers');
//     try {
//       const snapshot = await guardiansRef.get();
  
//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         if (data.phonenumbers && Array.isArray(data.phonenumbers)) {
//           phoneNumbers.push(...data.phonenumbers);
//         }
//       });
//      console.log('guardian phone numbers fetch successful');
//       return phoneNumbers;
//     } catch (error) {
//       console.error('Error fetching guardian phone numbers: ', error);
//       throw new Error('Failed to fetch phone numbers');
//     }
//   };
  
