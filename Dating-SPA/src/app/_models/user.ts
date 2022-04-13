import { Photo } from './photo';

export interface User {
    id: number;
    age: number;
    username: string;
    gender: string;
    city: string;
    country: string;
    createdAt: string;
    lastActive: string;
    knownAs: string
    photoUrl: string;
    lookingFor?: string;
    interests?: string ;
    introduction?: string
    photos?:Photo[];
}
