"use server"
import prisma from '@/app/clients/prisma'

import { Prisma } from '@prisma/client';
import { EmailExistsError } from '@/lib/types';

export async function addSubscriber(email: string) {
  try {
    const sub = await prisma.subscribers.create({
      data: {
        email: email.trim().toLowerCase(),
        date_subscribed: new Date(),
      },
    })
    return sub
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new EmailExistsError();
    } else {
      console.error(e);
    }
    return null;
  }
}
export async function getSubscribers() {
  return await prisma.subscribers.findMany()
}

export async function unsubscribe(email: string) {
  await prisma.subscribers.updateMany({
    where: {
      email,
    },
    data: {
      unsubscribed: true,
    },
  })
}