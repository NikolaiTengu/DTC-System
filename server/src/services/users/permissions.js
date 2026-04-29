function getUserPermissions(user) {
  const permissions = new Set();
  (user.roleIds || []).forEach((role) => {
    (role.permissions || []).forEach((permission) => permissions.add(permission));
  });
  return Array.from(permissions);
}

module.exports = { getUserPermissions };
