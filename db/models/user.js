module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  });

  User.associate = (models) => {
    User.hasMany(models.Note, { foreignKey: "userId", onDelete: "CASCADE" });
    User.hasMany(models.Tag, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  return User;
};
