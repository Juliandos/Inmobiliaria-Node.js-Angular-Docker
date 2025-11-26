import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { propiedades, propiedadesId } from './propiedades';

export interface operacionAttributes {
  id: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}

export type operacionPk = "id";
export type operacionId = operacion[operacionPk];
export type operacionOptionalAttributes = "id" | "createdAt" | "updatedAt";
export type operacionCreationAttributes = Optional<operacionAttributes, operacionOptionalAttributes>;

export class operacion extends Model<operacionAttributes, operacionCreationAttributes> implements operacionAttributes {
  id!: number;
  nombre!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // operacion hasMany propiedades via operacion_id
  propiedades!: propiedades[];
  getPropiedades!: Sequelize.HasManyGetAssociationsMixin<propiedades>;
  setPropiedades!: Sequelize.HasManySetAssociationsMixin<propiedades, propiedadesId>;
  addPropiedade!: Sequelize.HasManyAddAssociationMixin<propiedades, propiedadesId>;
  addPropiedades!: Sequelize.HasManyAddAssociationsMixin<propiedades, propiedadesId>;
  createPropiedade!: Sequelize.HasManyCreateAssociationMixin<propiedades>;
  removePropiedade!: Sequelize.HasManyRemoveAssociationMixin<propiedades, propiedadesId>;
  removePropiedades!: Sequelize.HasManyRemoveAssociationsMixin<propiedades, propiedadesId>;
  hasPropiedade!: Sequelize.HasManyHasAssociationMixin<propiedades, propiedadesId>;
  hasPropiedades!: Sequelize.HasManyHasAssociationsMixin<propiedades, propiedadesId>;
  countPropiedades!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof operacion {
    return operacion.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    tableName: 'operacion',
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
    ]
  });
  }
}

