module.exports = (sequelize) => {
  const NoteTag = sequelize.define("NoteTag", {}, { timestamps: false });
  return NoteTag;
};
