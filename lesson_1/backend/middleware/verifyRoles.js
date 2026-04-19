import { unauthorized } from "../utility/response.js";

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return unauthorized(res);
    const rolesArray = [...allowedRoles];
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return unauthorized(res);
    next();
  };
};

export default verifyRoles;
