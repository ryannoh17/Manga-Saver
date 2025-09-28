import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const mangaSchema = new Schema({
    title: String,
    description: String,
    genres: [String],
    url: String, 
    coverImage: String
});

export type mangaType = InferSchemaType<typeof mangaSchema>;
export type mangaDocType = HydratedDocument<mangaType>;

export const Manga = model<mangaDocType>('Manga', mangaSchema);
