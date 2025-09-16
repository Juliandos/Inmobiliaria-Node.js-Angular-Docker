import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { propiedades, propiedadesId } from './propiedades';

export interface imagenes_propiedadAttributes {
  id: number;
  propiedad_id?: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export type imagenes_propiedadPk = "id";
export type imagenes_propiedadId = imagenes_propiedad[imagenes_propiedadPk];
export type imagenes_propiedadOptionalAttributes = "id" | "propiedad_id" | "createdAt" | "updatedAt";
export type imagenes_propiedadCreationAttributes = Optional<imagenes_propiedadAttributes, imagenes_propiedadOptionalAttributes>;

export class imagenes_propiedad extends Model<imagenes_propiedadAttributes, imagenes_propiedadCreationAttributes> implements imagenes_propiedadAttributes {
  id!: number;
  propiedad_id?: number;
  url!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // imagenes_propiedad belongsTo propiedades via propiedad_id
  propiedad!: propiedades;
  getPropiedad!: Sequelize.BelongsToGetAssociationMixin<propiedades>;
  setPropiedad!: Sequelize.BelongsToSetAssociationMixin<propiedades, propiedadesId>;
  createPropiedad!: Sequelize.BelongsToCreateAssociationMixin<propiedades>;

  static initModel(sequelize: Sequelize.Sequelize): typeof imagenes_propiedad {
    return imagenes_propiedad.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    propiedad_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'propiedades',
        key: 'id'
      }
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('NOW')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('NOW')
    }
  }, {
    sequelize,
    tableName: 'imagenes_propiedad',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "propiedad_id",
        using: "BTREE",
        fields: [
          { name: "propiedad_id" },
        ]
      },
    ]
  });
  }
}
