import mongoose, { Schema, Document } from 'mongoose'

export interface ISkill {
  name: string
  order: number
  completed: boolean
  resources: {
    title: string
    url: string
    type: 'youtube' | 'github' | 'docs'
  }[]
}

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId
  jobTitle: string
  jobDescription: string
  skills: ISkill[]
  createdAt: Date
}

const RoadmapSchema = new Schema<IRoadmap>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  skills: [{
    name: String,
    order: Number,
    completed: { type: Boolean, default: false },
    resources: [{
      title: String,
      url: String,
      type: { type: String, enum: ['youtube', 'github', 'docs'] }
    }]
  }],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema)