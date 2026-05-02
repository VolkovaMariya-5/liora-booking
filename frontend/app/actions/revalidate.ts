'use server';
import { revalidatePath } from 'next/cache';

export async function revalidateBusinesses() {
  revalidatePath('/businesses');
  revalidatePath('/');
}
