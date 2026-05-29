import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  avatarUrl: string;
  avatarPublicId: string;
  skills: string[];
  languages: string[];
  website: string;
  phone: string;
  followerCount: number;
  followingCount: number;
  inOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
  userId: { type: String, required: true, unique: true, index: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  bio: { type: String, default: '', maxLength: 500 },
  location: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  avatarPublicId: { type: String, default: '' },
  skills: { type: [String], default: [] },
  languages: { type: [String], default: [] },
  website: { type: String, default: '' },
  phone: { type: String, default: '' },
  followerCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  inOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
});

export const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
