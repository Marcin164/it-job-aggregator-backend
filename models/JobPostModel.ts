import { Schema, model } from "mongoose";

const JobPostSchema:Schema = new Schema({
    title:String,
    seniority:String,
    skills: [String],
    minSalary: Number,
    maxSalary:Number,
    company:String,
    address:String,
    isRemote:String,
    url:String
});

JobPostSchema.statics.fetchAllByPreferences = () => {

}

const JobPostModel = model(
    "posts",
    JobPostSchema
  )
  
  module.exports = JobPostModel