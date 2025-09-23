import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { propiedades, propiedadesId } from './propiedades';
import type { roles, rolesId } from './roles';

export interface usuariosAttributes {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  password: string;
  refreshToken?: string;
  rol_id?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type usuariosPk = "id";
export type usuariosId = usuarios[usuariosPk];
export type usuariosOptionalAttributes = "id" | "nombre" | "apellido" | "refreshToken" | "rol_id" | "createdAt" | "updatedAt";
export type usuariosCreationAttributes = Optional<usuariosAttributes, usuariosOptionalAttributes>;

export class usuarios extends Model<usuariosAttributes, usuariosCreationAttributes> implements usuariosAttributes {
  id!: number;
  email!: string;
  nombre?: string;
  apellido?: string;
  password!: string;
  refreshToken?: string;
  rol_id?: number;
  createdAt!: Date;
  updatedAt!: Date;

  // usuarios belongsTo roles via rol_id
  rol!: roles;
  getRol!: Sequelize.BelongsToGetAssociationMixin<roles>;
  setRol!: Sequelize.BelongsToSetAssociationMixin<roles, rolesId>;
  createRol!: Sequelize.BelongsToCreateAssociationMixin<roles>;
  // usuarios hasMany propiedades via usuario_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof usuarios {
    return usuarios.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "email"
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    refreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "refreshToken"
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'usuarios',
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
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "refreshToken",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "refreshToken" },
        ]
      },
      {
        name: "rol_id",
        using: "BTREE",
        fields: [
          { name: "rol_id" },
        ]
      },
    ]
  });
  }
}
