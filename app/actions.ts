"use server"
import { EmailExistsError } from '@/lib/types';

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

export async function sendTextToTim({message}: {message: string}) {
  console.log(`Sending text to Tim: ${message}`)

  // Construct the Basic Auth string
  const authString = `Basic ${Buffer.from(`${process.env.TEXTBELT_AUTH_USERNAME}:${process.env.TEXTBELT_AUTH_PASSWORD}`).toString('base64')}`;
  
  // HTTP Request with Basic Auth
  const response = await fetch(`${process.env.TEXTBELT_URL}/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authString,
    },
    body: JSON.stringify({
      number: process.env.TIM_PHONE_NUMBER,
      message,
    }),
  })

  if (response.status !== 200) {
    throw new Error(`Error sending text to Tim. Response: ${response.status} - ${response.statusText}`)
  }

}