import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { permisos, permisosId } from './permisos';
import type { roles_permisos, roles_permisosId } from './roles_permisos';
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

  // roles belongsToMany permisos via rol_id and permiso_id
  permiso_id_permisos!: permisos[];
  getPermiso_id_permisos!: Sequelize.BelongsToManyGetAssociationsMixin<permisos>;
  setPermiso_id_permisos!: Sequelize.BelongsToManySetAssociationsMixin<permisos, permisosId>;
  addPermiso_id_permiso!: Sequelize.BelongsToManyAddAssociationMixin<permisos, permisosId>;
  addPermiso_id_permisos!: Sequelize.BelongsToManyAddAssociationsMixin<permisos, permisosId>;
  createPermiso_id_permiso!: Sequelize.BelongsToManyCreateAssociationMixin<permisos>;
  removePermiso_id_permiso!: Sequelize.BelongsToManyRemoveAssociationMixin<permisos, permisosId>;
  removePermiso_id_permisos!: Sequelize.BelongsToManyRemoveAssociationsMixin<permisos, permisosId>;
  hasPermiso_id_permiso!: Sequelize.BelongsToManyHasAssociationMixin<permisos, permisosId>;
  hasPermiso_id_permisos!: Sequelize.BelongsToManyHasAssociationsMixin<permisos, permisosId>;
  countPermiso_id_permisos!: Sequelize.BelongsToManyCountAssociationsMixin;
  // roles hasMany roles_permisos via rol_id
  roles_permisos!: roles_permisos[];
  getRoles_permisos!: Sequelize.HasManyGetAssociationsMixin<roles_permisos>;
  setRoles_permisos!: Sequelize.HasManySetAssociationsMixin<roles_permisos, roles_permisosId>;
  addRoles_permiso!: Sequelize.HasManyAddAssociationMixin<roles_permisos, roles_permisosId>;
  addRoles_permisos!: Sequelize.HasManyAddAssociationsMixin<roles_permisos, roles_permisosId>;
  createRoles_permiso!: Sequelize.HasManyCreateAssociationMixin<roles_permisos>;
  removeRoles_permiso!: Sequelize.HasManyRemoveAssociationMixin<roles_permisos, roles_permisosId>;
  removeRoles_permisos!: Sequelize.HasManyRemoveAssociationsMixin<roles_permisos, roles_permisosId>;
  hasRoles_permiso!: Sequelize.HasManyHasAssociationMixin<roles_permisos, roles_permisosId>;
  hasRoles_permisos!: Sequelize.HasManyHasAssociationsMixin<roles_permisos, roles_permisosId>;
  countRoles_permisos!: Sequelize.HasManyCountAssociationsMixin;
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
    ]
  });
  }
}
