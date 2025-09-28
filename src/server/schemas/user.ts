import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const userMangaSchema = new Schema({
    mangaId: { type: Schema.Types.ObjectId, ref: 'Manga', required: true },
    currentChapter: Number,
    highestChapter: Number,
    dateAdded: { type: Date, default: Date.now },
    dateRead: { type: Date, default: Date.now },
    notes: String,
});

const userSchema = new Schema({
    username: String,
    password: String,
    myMangas: [userMangaSchema]
});

export type userMangaType = InferSchemaType<typeof userMangaSchema>;
export type UserMangaDocType = HydratedDocument<userMangaType>;
export const UserManga = model<UserDocType>('UserManga', userMangaSchema);

export type userType = InferSchemaType<typeof userSchema>;
export type UserDocType = HydratedDocument<userType>;
export const User = model<UserDocType>('User', userSchema);
