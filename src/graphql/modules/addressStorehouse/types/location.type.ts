import { Schema } from "mongoose";

enum LocationTypes {
  Point = "Point",
}

export type Location = {
  type: string;
  coordinates: [number];
};

export const LocationSchema = new Schema({
  type: { type: Schema.Types.String, default: LocationTypes.Point },
  coordinates: {
    type: [{ type: Schema.Types.Number ,default:0 }],
    minlength: 2,
    maxlength: 2,
  },
});
