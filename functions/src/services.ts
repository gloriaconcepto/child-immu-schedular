// functions/src/smsSender.ts
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
import axios from 'axios';
// import {updateBabyImmunisedDataBase} from './sendSmsSchedular'
interface Recipient {
  msidn: string;
  msgid: string;
}

export const sendSmsService=  async (phoneNumbers: string[],message: string) => {
  const url='https://api.ebulksms.com/sendsms.json'

  const recipients: Recipient[] = phoneNumbers.map((number, index) => ({
    msidn: number,
    msgid: `uniqueid${index + 1}`
  }));
  console.log('recipeints new me',recipients);
  const payload = {
    SMS: {
      auth: {
        username: process.env.USERNAME,
        apikey: process.env.BULKSMSAPIKEY
      },
      message: {
        sender: 'Mmekut',
        messagetext:message,
        flash: '0'
      },
      recipients: {
        gsm: recipients
      },
      dndsender: 1
    }
  };
  try{
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
   
      console.log('i have a response',response);
      const data = response.data;
      console.log('i have a responsekk',data.response.status);
      return data.response.status === 'SUCCESS';
      // await updateBabyImmunisedDataBase();
    
  }catch(error){
    console.error('Failed to send SMS', error);
        return false;

  }
 
}

