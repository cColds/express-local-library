const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

function getFormattedDate(date) {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED);
}

function getValidDate(date) {
  const formattedDate = getFormattedDate(date);
  const isValidDate = formattedDate.toString() !== "Invalid DateTime";
  return isValidDate ? formattedDate : "";
}

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

AuthorSchema.virtual("lifespan").get(function () {
  const dateOfBirth = getValidDate(this.date_of_birth);
  const dateOfDeath = getValidDate(this.date_of_death);

  return `${dateOfBirth} - ${dateOfDeath}`;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
