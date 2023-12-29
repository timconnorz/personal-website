"use server"
import { EmailExistsError } from '@/lib/types';
import prisma from './clients/prisma';

export async function addSubscriber({ email, name }: { email: string, name?: string }) {
  console.log(`Adding subscriber ${email}`)
  
  // HTTP Request with Basic Auth
  const response = await fetch(`${process.env.LISTMONK_URL}/api/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${process.env.LISTMONK_USERNAME}:${process.env.LISTMONK_PASSWORD}`).toString('base64')}`,
    },
    body: JSON.stringify({
      email: email,
      name: name,
      lists: [Number(process.env.NEWSLETTER_LIST_ID)],
      status: 'enabled',
    }),
  })

  // if the email already exits, response will be 409
  if (response.status === 409) {
    throw new EmailExistsError();
  }

  if (response.status !== 200) {
    throw new Error(`Error subscribing to newsletter. Response: ${response.status} - ${response.statusText}`)
  }

  const data = await response.json()
  
  console.log(data)

  return data
}

// export async function migrateSubscribers() {
//   const response = await prisma.subscribers.findMany()

//   let errors = 0

//   for (const subscriber of response) {
//     try {
//       await addSubscriber({ email: subscriber.email!, name: subscriber.email! })
//     } catch (e) {
//       errors++
//       console.log(e)
//     }
//   }

//   console.log(`Finished with ${errors} errors`)
// }