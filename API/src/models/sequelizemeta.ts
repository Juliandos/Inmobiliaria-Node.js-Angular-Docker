import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface sequelizemetaAttributes {
  name: string;
}

export type sequelizemetaPk = "name";
export type sequelizemetaId = sequelizemeta[sequelizemetaPk];
export type sequelizemetaCreationAttributes = sequelizemetaAttributes;

export class sequelizemeta extends Model<sequelizemetaAttributes, sequelizemetaCreationAttributes> implements sequelizemetaAttributes {
  name!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof sequelizemeta {
    return sequelizemeta.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'sequelizemeta',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  }
}
