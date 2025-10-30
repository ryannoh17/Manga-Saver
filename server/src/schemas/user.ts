import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

// manga schema specified to users, references separate manga objects
const userMangaSchema = new Schema({
    mangaDetail: { type: Schema.Types.ObjectId, ref: 'Manga', required: true },
    currentChapter: Number,
    highestChapter: Number,
    dateAdded: { type: Date, default: Date.now() },
    dateRead: { type: Date, default: Date.now() },
    notes: String,
});

const userSchema = new Schema({
    username: String,
    password: String,
    mangaList: [userMangaSchema]
});

// creating hydrated document types for models
type userMangaType = InferSchemaType<typeof userMangaSchema>;
type UserMangaDocType = HydratedDocument<userMangaType>;
const UserManga = model<UserMangaDocType>('UserManga', userMangaSchema);

type userType = InferSchemaType<typeof userSchema>;
type UserDocType = HydratedDocument<userType>;
export const User = model<UserDocType>('User', userSchema);
