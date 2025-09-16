import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { permisos, permisosId } from './permisos';
import type { roles, rolesId } from './roles';

export interface roles_permisosAttributes {
  rol_id: number;
  permiso_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type roles_permisosPk = "rol_id" | "permiso_id";
export type roles_permisosId = roles_permisos[roles_permisosPk];
export type roles_permisosOptionalAttributes = "createdAt" | "updatedAt";
export type roles_permisosCreationAttributes = Optional<roles_permisosAttributes, roles_permisosOptionalAttributes>;

export class roles_permisos extends Model<roles_permisosAttributes, roles_permisosCreationAttributes> implements roles_permisosAttributes {
  rol_id!: number;
  permiso_id!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // roles_permisos belongsTo permisos via permiso_id
  permiso!: permisos;
  getPermiso!: Sequelize.BelongsToGetAssociationMixin<permisos>;
  setPermiso!: Sequelize.BelongsToSetAssociationMixin<permisos, permisosId>;
  createPermiso!: Sequelize.BelongsToCreateAssociationMixin<permisos>;
  // roles_permisos belongsTo roles via rol_id
  rol!: roles;
  getRol!: Sequelize.BelongsToGetAssociationMixin<roles>;
  setRol!: Sequelize.BelongsToSetAssociationMixin<roles, rolesId>;
  createRol!: Sequelize.BelongsToCreateAssociationMixin<roles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof roles_permisos {
    return roles_permisos.init({
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    permiso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'permisos',
        key: 'id'
      }
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
    tableName: 'roles_permisos',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "rol_id" },
          { name: "permiso_id" },
        ]
      },
      {
        name: "permiso_id",
        using: "BTREE",
        fields: [
          { name: "permiso_id" },
        ]
      },
    ]
  });
  }
}
