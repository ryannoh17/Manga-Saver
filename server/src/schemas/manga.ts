import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';

const mangaSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    genres: { type: [String], default: [] },
    url: { type: String, required: true }, 
    coverImage: { type: String, default: '' }
});

export type mangaType = InferSchemaType<typeof mangaSchema>;
export type mangaDocType = HydratedDocument<mangaType>;

export const Manga = model<mangaDocType>('Manga', mangaSchema);
