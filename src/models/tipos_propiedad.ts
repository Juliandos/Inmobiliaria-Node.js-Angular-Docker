import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { propiedades, propiedadesId } from './propiedades';

export interface tipos_propiedadAttributes {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}

export type tipos_propiedadPk = "id";
export type tipos_propiedadId = tipos_propiedad[tipos_propiedadPk];
export type tipos_propiedadOptionalAttributes = "id" | "created_at" | "updated_at";
export type tipos_propiedadCreationAttributes = Optional<tipos_propiedadAttributes, tipos_propiedadOptionalAttributes>;

export class tipos_propiedad extends Model<tipos_propiedadAttributes, tipos_propiedadCreationAttributes> implements tipos_propiedadAttributes {
  id!: number;
  nombre!: string;
  created_at!: Date;
  updated_at!: Date;

  // tipos_propiedad hasMany propiedades via tipo_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof tipos_propiedad {
    return tipos_propiedad.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tipos_propiedad',
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
