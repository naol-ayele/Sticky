module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define("Note", {
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT },
    color: { type: DataTypes.STRING, defaultValue: "#FFFFFF" },
    isPinned: { type: DataTypes.BOOLEAN, defaultValue: false },
    isArchived: { type: DataTypes.BOOLEAN, defaultValue: false },
    isTrashed: { type: DataTypes.BOOLEAN, defaultValue: false },
    reminderAt: { type: DataTypes.DATE, allowNull: true },
  });

  Note.associate = (models) => {
    Note.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Note.hasMany(models.Attachment, {
      foreignKey: "noteId",
      onDelete: "CASCADE",
    });
    Note.belongsToMany(models.Tag, {
      through: models.NoteTag,
      foreignKey: "noteId",
    });
  };

  return Note;
};
