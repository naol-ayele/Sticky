module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define("Tag", {
    name: { type: DataTypes.STRING, allowNull: false },
  });

  Tag.associate = (models) => {
    Tag.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Tag.belongsToMany(models.Note, {
      through: models.NoteTag,
      foreignKey: "tagId",
    });
  };

  return Tag;
};
