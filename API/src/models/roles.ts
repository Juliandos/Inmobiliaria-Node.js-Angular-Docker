import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { permisos, permisosId } from './permisos';
import type { usuarios, usuariosId } from './usuarios';

export interface rolesAttributes {
  id: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}

export type rolesPk = "id";
export type rolesId = roles[rolesPk];
export type rolesOptionalAttributes = "id" | "createdAt" | "updatedAt";
export type rolesCreationAttributes = Optional<rolesAttributes, rolesOptionalAttributes>;

export class roles extends Model<rolesAttributes, rolesCreationAttributes> implements rolesAttributes {
  id!: number;
  nombre!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // roles hasMany permisos via rol_id
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
  // roles hasMany usuarios via rol_id
  usuarios!: usuarios[];
  getUsuarios!: Sequelize.HasManyGetAssociationsMixin<usuarios>;
  setUsuarios!: Sequelize.HasManySetAssociationsMixin<usuarios, usuariosId>;
  addUsuario!: Sequelize.HasManyAddAssociationMixin<usuarios, usuariosId>;
  addUsuarios!: Sequelize.HasManyAddAssociationsMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.HasManyCreateAssociationMixin<usuarios>;
  removeUsuario!: Sequelize.HasManyRemoveAssociationMixin<usuarios, usuariosId>;
  removeUsuarios!: Sequelize.HasManyRemoveAssociationsMixin<usuarios, usuariosId>;
  hasUsuario!: Sequelize.HasManyHasAssociationMixin<usuarios, usuariosId>;
  hasUsuarios!: Sequelize.HasManyHasAssociationsMixin<usuarios, usuariosId>;
  countUsuarios!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof roles {
    return roles.init({
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
    tableName: 'roles',
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
