import * as admin from 'firebase-admin';

export const updateBabyImmunisedDataBase = async () => {
    console.log('Hello World');

    const db = admin.firestore();
    const guardiansRef = db.collection('guardians');

    try {
        const snapshot = await guardiansRef.get();
        const batch = db.batch();

        for (const doc of snapshot.docs) {
            const babiesRef = guardiansRef.doc(doc.id).collection('babies');
            const babiesSnapshot = await babiesRef.get();
            for (const babyDoc of babiesSnapshot.docs) {
                const babyData = babyDoc.data();
                if (babyData.babybeenimmunizdd < 5) {
                    const newImmunizdd = babyData.babybeenimmunizdd + 1;
                    batch.update(babyDoc.ref, { babybeenimmunizdd: newImmunizdd });
                }
            }
        }

        await batch.commit();
        console.log('Successfully updated babybeenimmunizdd for eligible babies');

    } catch (error) {
        console.error('Error updating babybeenimmunizdd: ', error);
    }
};
