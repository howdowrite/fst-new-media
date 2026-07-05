import {serverTimestamp, Timestamp, FieldValue} from "firebase/firestore";

export type roles = 'ADMIN' | 'JOURNALIST' | 'READER';
export interface UserProps {
  id: string;
  email: string,
  role: roles,
  displayName: string,
  createdAt: Timestamp | FieldValue,
  modifiedAt: Timestamp | FieldValue,
}

export const transform = (id: string, data:Omit<UserProps, "id">):UserProps => {
  if(!id) throw new Error(`User ID is missing.`);
  if(!data.createdAt) throw new Error(`User creation date is missing.`);
  if(!data.modifiedAt) throw new Error(`User modification date is missing.`);

  return {
    id: id,
    ...data
  }
}

export const createUser = (data:Partial<UserProps>): Partial<UserProps> => {
  if(!data.email?.trim()) throw new Error(`Please enter a valid email address.`);
  if(data.email.trim().length > 254) throw new Error(`Email must not exceed 254 characters.`);

  return{
    email: data.email,
    role: data.role ?? 'READER',
    displayName: data.displayName?.trim() || Array.from(data.email.split("@"))[0],
    createdAt: serverTimestamp(),
    modifiedAt: serverTimestamp()
  }
}




