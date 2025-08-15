module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define("Attachment", {
    fileUrl: { type: DataTypes.STRING, allowNull: false },
    fileName: { type: DataTypes.STRING, allowNull: true },
  });

  Attachment.associate = (models) => {
    Attachment.belongsTo(models.Note, {
      foreignKey: "noteId",
      onDelete: "CASCADE",
    });
  };

  return Attachment;
};
