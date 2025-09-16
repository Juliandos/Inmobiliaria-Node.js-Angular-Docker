import type { Sequelize } from "sequelize";
import { imagenes_propiedad as _imagenes_propiedad } from "./imagenes_propiedad";
import type { imagenes_propiedadAttributes, imagenes_propiedadCreationAttributes } from "./imagenes_propiedad";
import { permisos as _permisos } from "./permisos";
import type { permisosAttributes, permisosCreationAttributes } from "./permisos";
import { propiedades as _propiedades } from "./propiedades";
import type { propiedadesAttributes, propiedadesCreationAttributes } from "./propiedades";
import { roles as _roles } from "./roles";
import type { rolesAttributes, rolesCreationAttributes } from "./roles";
import { roles_permisos as _roles_permisos } from "./roles_permisos";
import type { roles_permisosAttributes, roles_permisosCreationAttributes } from "./roles_permisos";
import { tipos_propiedad as _tipos_propiedad } from "./tipos_propiedad";
import type { tipos_propiedadAttributes, tipos_propiedadCreationAttributes } from "./tipos_propiedad";
import { usuarios as _usuarios } from "./usuarios";
import type { usuariosAttributes, usuariosCreationAttributes } from "./usuarios";

export {
  _imagenes_propiedad as imagenes_propiedad,
  _permisos as permisos,
  _propiedades as propiedades,
  _roles as roles,
  _roles_permisos as roles_permisos,
  _tipos_propiedad as tipos_propiedad,
  _usuarios as usuarios,
};

export type {
  imagenes_propiedadAttributes,
  imagenes_propiedadCreationAttributes,
  permisosAttributes,
  permisosCreationAttributes,
  propiedadesAttributes,
  propiedadesCreationAttributes,
  rolesAttributes,
  rolesCreationAttributes,
  roles_permisosAttributes,
  roles_permisosCreationAttributes,
  tipos_propiedadAttributes,
  tipos_propiedadCreationAttributes,
  usuariosAttributes,
  usuariosCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const imagenes_propiedad = _imagenes_propiedad.initModel(sequelize);
  const permisos = _permisos.initModel(sequelize);
  const propiedades = _propiedades.initModel(sequelize);
  const roles = _roles.initModel(sequelize);
  const roles_permisos = _roles_permisos.initModel(sequelize);
  const tipos_propiedad = _tipos_propiedad.initModel(sequelize);
  const usuarios = _usuarios.initModel(sequelize);

  permisos.belongsToMany(roles, { as: 'rol_id_roles', through: roles_permisos, foreignKey: "permiso_id", otherKey: "rol_id" });
  roles.belongsToMany(permisos, { as: 'permiso_id_permisos', through: roles_permisos, foreignKey: "rol_id", otherKey: "permiso_id" });
  roles_permisos.belongsTo(permisos, { as: "permiso", foreignKey: "permiso_id"});
  permisos.hasMany(roles_permisos, { as: "roles_permisos", foreignKey: "permiso_id"});
  imagenes_propiedad.belongsTo(propiedades, { as: "propiedad", foreignKey: "propiedad_id"});
  propiedades.hasMany(imagenes_propiedad, { as: "imagenes_propiedads", foreignKey: "propiedad_id"});
  roles_permisos.belongsTo(roles, { as: "rol", foreignKey: "rol_id"});
  roles.hasMany(roles_permisos, { as: "roles_permisos", foreignKey: "rol_id"});
  usuarios.belongsTo(roles, { as: "rol", foreignKey: "rol_id"});
  roles.hasMany(usuarios, { as: "usuarios", foreignKey: "rol_id"});
  propiedades.belongsTo(tipos_propiedad, { as: "tipo", foreignKey: "tipo_id"});
  tipos_propiedad.hasMany(propiedades, { as: "propiedades", foreignKey: "tipo_id"});
  propiedades.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(propiedades, { as: "propiedades", foreignKey: "usuario_id"});

  return {
    imagenes_propiedad: imagenes_propiedad,
    permisos: permisos,
    propiedades: propiedades,
    roles: roles,
    roles_permisos: roles_permisos,
    tipos_propiedad: tipos_propiedad,
    usuarios: usuarios,
  };
}
