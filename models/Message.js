module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define(
      "message",
      {
        text: {
          type: Sequelize.STRING,
        },
        time: {
          type: Sequelize.STRING,
        },
        from_id: {
            type: Sequelize.INTEGER,
            references: {
              model: "users",
              key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          to_id: {
            type: Sequelize.INTEGER,
            references: {
              model: "users",
              key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
      },
      {
        freezeTableName: true,
        timestamps: false,
      }
    );
    return Message;
  };
  