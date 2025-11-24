import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { modulos, modulosId } from './modulos';
import type { roles, rolesId } from './roles';

export interface permisosAttributes {
  id: number;
  nombre: string;
  c: number;
  r: number;
  u: number;
  d: number;
  rol_id: number;
  modulo_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type permisosPk = "id";
export type permisosId = permisos[permisosPk];
export type permisosOptionalAttributes = "id" | "c" | "r" | "u" | "d" | "createdAt" | "updatedAt";
export type permisosCreationAttributes = Optional<permisosAttributes, permisosOptionalAttributes>;

export class permisos extends Model<permisosAttributes, permisosCreationAttributes> implements permisosAttributes {
  id!: number;
  nombre!: string;
  c!: number;
  r!: number;
  u!: number;
  d!: number;
  rol_id!: number;
  modulo_id!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // permisos belongsTo modulos via modulo_id
  modulo!: modulos;
  getModulo!: Sequelize.BelongsToGetAssociationMixin<modulos>;
  setModulo!: Sequelize.BelongsToSetAssociationMixin<modulos, modulosId>;
  createModulo!: Sequelize.BelongsToCreateAssociationMixin<modulos>;
  // permisos belongsTo roles via rol_id
  rol!: roles;
  getRol!: Sequelize.BelongsToGetAssociationMixin<roles>;
  setRol!: Sequelize.BelongsToSetAssociationMixin<roles, rolesId>;
  createRol!: Sequelize.BelongsToCreateAssociationMixin<roles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof permisos {
    return permisos.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    c: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    r: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    u: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    d: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    modulo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'modulos',
        key: 'id'
      }
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
    tableName: 'permisos',
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
        name: "unique_rol_modulo",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "rol_id" },
          { name: "modulo_id" },
        ]
      },
      {
        name: "modulo_id",
        using: "BTREE",
        fields: [
          { name: "modulo_id" },
        ]
      },
    ]
  });
  }
}
