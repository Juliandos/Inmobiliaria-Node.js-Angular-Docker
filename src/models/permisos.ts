import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { roles, rolesId } from './roles';
import type { roles_permisos, roles_permisosId } from './roles_permisos';

export interface permisosAttributes {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export type permisosPk = "id";
export type permisosId = permisos[permisosPk];
export type permisosOptionalAttributes = "id" | "created_at" | "updated_at";
export type permisosCreationAttributes = Optional<permisosAttributes, permisosOptionalAttributes>;

export class permisos extends Model<permisosAttributes, permisosCreationAttributes> implements permisosAttributes {
  id!: number;
  nombre!: string;
  created_at!: Date;
  updated_at!: Date;

  // permisos belongsToMany roles via permiso_id and rol_id
  rol_id_roles!: roles[];
  getRol_id_roles!: Sequelize.BelongsToManyGetAssociationsMixin<roles>;
  setRol_id_roles!: Sequelize.BelongsToManySetAssociationsMixin<roles, rolesId>;
  addRol_id_role!: Sequelize.BelongsToManyAddAssociationMixin<roles, rolesId>;
  addRol_id_roles!: Sequelize.BelongsToManyAddAssociationsMixin<roles, rolesId>;
  createRol_id_role!: Sequelize.BelongsToManyCreateAssociationMixin<roles>;
  removeRol_id_role!: Sequelize.BelongsToManyRemoveAssociationMixin<roles, rolesId>;
  removeRol_id_roles!: Sequelize.BelongsToManyRemoveAssociationsMixin<roles, rolesId>;
  hasRol_id_role!: Sequelize.BelongsToManyHasAssociationMixin<roles, rolesId>;
  hasRol_id_roles!: Sequelize.BelongsToManyHasAssociationsMixin<roles, rolesId>;
  countRol_id_roles!: Sequelize.BelongsToManyCountAssociationsMixin;
  // permisos hasMany roles_permisos via permiso_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof permisos {
    return permisos.init({
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
