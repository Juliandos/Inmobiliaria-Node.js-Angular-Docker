import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { imagenes_propiedad, imagenes_propiedadId } from './imagenes_propiedad';
import type { operacion, operacionId } from './operacion';
import type { tipos_propiedad, tipos_propiedadId } from './tipos_propiedad';
import type { usuarios, usuariosId } from './usuarios';

export interface propiedadesAttributes {
  id: number;
  titulo: string;
  descripcion?: string;
  precio?: number;
  area?: number;
  habitaciones?: number;
  banos?: number;
  parqueadero?: number;
  tipo_id?: number;
  usuario_id?: number;
  operacion_id?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type propiedadesPk = "id";
export type propiedadesId = propiedades[propiedadesPk];
export type propiedadesOptionalAttributes = "id" | "descripcion" | "precio" | "area" | "habitaciones" | "banos" | "parqueadero" | "tipo_id" | "usuario_id" | "operacion_id" | "createdAt" | "updatedAt";
export type propiedadesCreationAttributes = Optional<propiedadesAttributes, propiedadesOptionalAttributes>;

export class propiedades extends Model<propiedadesAttributes, propiedadesCreationAttributes> implements propiedadesAttributes {
  id!: number;
  titulo!: string;
  descripcion?: string;
  precio?: number;
  area?: number;
  habitaciones?: number;
  banos?: number;
  parqueadero?: number;
  tipo_id?: number;
  usuario_id?: number;
  operacion_id?: number;
  createdAt!: Date;
  updatedAt!: Date;

  // propiedades hasMany imagenes_propiedad via propiedad_id
  imagenes_propiedads!: imagenes_propiedad[];
  getImagenes_propiedads!: Sequelize.HasManyGetAssociationsMixin<imagenes_propiedad>;
  setImagenes_propiedads!: Sequelize.HasManySetAssociationsMixin<imagenes_propiedad, imagenes_propiedadId>;
  addImagenes_propiedad!: Sequelize.HasManyAddAssociationMixin<imagenes_propiedad, imagenes_propiedadId>;
  addImagenes_propiedads!: Sequelize.HasManyAddAssociationsMixin<imagenes_propiedad, imagenes_propiedadId>;
  createImagenes_propiedad!: Sequelize.HasManyCreateAssociationMixin<imagenes_propiedad>;
  removeImagenes_propiedad!: Sequelize.HasManyRemoveAssociationMixin<imagenes_propiedad, imagenes_propiedadId>;
  removeImagenes_propiedads!: Sequelize.HasManyRemoveAssociationsMixin<imagenes_propiedad, imagenes_propiedadId>;
  hasImagenes_propiedad!: Sequelize.HasManyHasAssociationMixin<imagenes_propiedad, imagenes_propiedadId>;
  hasImagenes_propiedads!: Sequelize.HasManyHasAssociationsMixin<imagenes_propiedad, imagenes_propiedadId>;
  countImagenes_propiedads!: Sequelize.HasManyCountAssociationsMixin;
  // propiedades belongsTo tipos_propiedad via tipo_id
  tipo!: tipos_propiedad;
  getTipo!: Sequelize.BelongsToGetAssociationMixin<tipos_propiedad>;
  setTipo!: Sequelize.BelongsToSetAssociationMixin<tipos_propiedad, tipos_propiedadId>;
  createTipo!: Sequelize.BelongsToCreateAssociationMixin<tipos_propiedad>;
  // propiedades belongsTo usuarios via usuario_id
  usuario!: usuarios;
  getUsuario!: Sequelize.BelongsToGetAssociationMixin<usuarios>;
  setUsuario!: Sequelize.BelongsToSetAssociationMixin<usuarios, usuariosId>;
  createUsuario!: Sequelize.BelongsToCreateAssociationMixin<usuarios>;
  // propiedades belongsTo operacion via operacion_id
  operacion!: operacion;
  getOperacion!: Sequelize.BelongsToGetAssociationMixin<operacion>;
  setOperacion!: Sequelize.BelongsToSetAssociationMixin<operacion, operacionId>;
  createOperacion!: Sequelize.BelongsToCreateAssociationMixin<operacion>;

  static initModel(sequelize: Sequelize.Sequelize): typeof propiedades {
    return propiedades.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true
    },
    area: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Área en metros cuadrados'
    },
    habitaciones: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    banos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    parqueadero: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    tipo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipos_propiedad',
        key: 'id'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    operacion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operacion',
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
    tableName: 'propiedades',
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
        name: "tipo_id",
        using: "BTREE",
        fields: [
          { name: "tipo_id" },
        ]
      },
      {
        name: "usuario_id",
        using: "BTREE",
        fields: [
          { name: "usuario_id" },
        ]
      },
      {
        name: "operacion_id",
        using: "BTREE",
        fields: [
          { name: "operacion_id" },
        ]
      },
    ]
  });
  }
}
