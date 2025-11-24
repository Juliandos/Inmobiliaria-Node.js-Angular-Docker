import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { permisos, permisosId } from './permisos';

export interface modulosAttributes {
  id: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}

export type modulosPk = "id";
export type modulosId = modulos[modulosPk];
export type modulosOptionalAttributes = "id" | "createdAt" | "updatedAt";
export type modulosCreationAttributes = Optional<modulosAttributes, modulosOptionalAttributes>;

export class modulos extends Model<modulosAttributes, modulosCreationAttributes> implements modulosAttributes {
  id!: number;
  nombre!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // modulos hasMany permisos via modulo_id
  permisos!: permisos[];
  getPermisos!: Sequelize.HasManyGetAssociationsMixin<permisos>;
  setPermisos!: Sequelize.HasManySetAssociationsMixin<permisos, permisosId>;
  addPermiso!: Sequelize.HasManyAddAssociationMixin<permisos, permisosId>;
  addPermisos!: Sequelize.HasManyAddAssociationsMixin<permisos, permisosId>;
  createPermiso!: Sequelize.HasManyCreateAssociationMixin<permisos>;
  removePermiso!: Sequelize.HasManyRemoveAssociationMixin<permisos, permisosId>;
  removePermisos!: Sequelize.HasManyRemoveAssociationsMixin<permisos, permisosId>;
  hasPermiso!: Sequelize.HasManyHasAssociationMixin<permisos, permisosId>;
  hasPermisos!: Sequelize.HasManyHasAssociationsMixin<permisos, permisosId>;
  countPermisos!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof modulos {
    return modulos.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "nombre"
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
    tableName: 'modulos',
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
        name: "nombre",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nombre" },
        ]
      },
    ]
  });
  }
}
