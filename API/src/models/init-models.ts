import type { Sequelize } from "sequelize";
import { imagenes_propiedad as _imagenes_propiedad } from "./imagenes_propiedad";
import type { imagenes_propiedadAttributes, imagenes_propiedadCreationAttributes } from "./imagenes_propiedad";
import { modulos as _modulos } from "./modulos";
import type { modulosAttributes, modulosCreationAttributes } from "./modulos";
import { permisos as _permisos } from "./permisos";
import type { permisosAttributes, permisosCreationAttributes } from "./permisos";
import { propiedades as _propiedades } from "./propiedades";
import type { propiedadesAttributes, propiedadesCreationAttributes } from "./propiedades";
import { roles as _roles } from "./roles";
import type { rolesAttributes, rolesCreationAttributes } from "./roles";
import { tipos_propiedad as _tipos_propiedad } from "./tipos_propiedad";
import type { tipos_propiedadAttributes, tipos_propiedadCreationAttributes } from "./tipos_propiedad";
import { usuarios as _usuarios } from "./usuarios";
import type { usuariosAttributes, usuariosCreationAttributes } from "./usuarios";

export {
  _imagenes_propiedad as imagenes_propiedad,
  _modulos as modulos,
  _permisos as permisos,
  _propiedades as propiedades,
  _roles as roles,
  _tipos_propiedad as tipos_propiedad,
  _usuarios as usuarios,
};

export type {
  imagenes_propiedadAttributes,
  imagenes_propiedadCreationAttributes,
  modulosAttributes,
  modulosCreationAttributes,
  permisosAttributes,
  permisosCreationAttributes,
  propiedadesAttributes,
  propiedadesCreationAttributes,
  rolesAttributes,
  rolesCreationAttributes,
  tipos_propiedadAttributes,
  tipos_propiedadCreationAttributes,
  usuariosAttributes,
  usuariosCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const imagenes_propiedad = _imagenes_propiedad.initModel(sequelize);
  const modulos = _modulos.initModel(sequelize);
  const permisos = _permisos.initModel(sequelize);
  const propiedades = _propiedades.initModel(sequelize);
  const roles = _roles.initModel(sequelize);
  const tipos_propiedad = _tipos_propiedad.initModel(sequelize);
  const usuarios = _usuarios.initModel(sequelize);

  permisos.belongsTo(modulos, { as: "modulo", foreignKey: "modulo_id"});
  modulos.hasMany(permisos, { as: "permisos", foreignKey: "modulo_id"});
  imagenes_propiedad.belongsTo(propiedades, { as: "propiedad", foreignKey: "propiedad_id"});
  propiedades.hasMany(imagenes_propiedad, { as: "imagenes_propiedads", foreignKey: "propiedad_id"});
  permisos.belongsTo(roles, { as: "rol", foreignKey: "rol_id"});
  roles.hasMany(permisos, { as: "permisos", foreignKey: "rol_id"});
  usuarios.belongsTo(roles, { as: "rol", foreignKey: "rol_id"});
  roles.hasMany(usuarios, { as: "usuarios", foreignKey: "rol_id"});
  propiedades.belongsTo(tipos_propiedad, { as: "tipo", foreignKey: "tipo_id"});
  tipos_propiedad.hasMany(propiedades, { as: "propiedades", foreignKey: "tipo_id"});
  propiedades.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(propiedades, { as: "propiedades", foreignKey: "usuario_id"});

  return {
    imagenes_propiedad: imagenes_propiedad,
    modulos: modulos,
    permisos: permisos,
    propiedades: propiedades,
    roles: roles,
    tipos_propiedad: tipos_propiedad,
    usuarios: usuarios,
  };
}
