export const ROLES = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  MEMBER: "MEMBER",
  CUSTOMER: "CUSTOMER",
  MESSENGER: "MESSENGER",
  STAFF: "STAFF",
  ADMIN_EDITOR: ["ADMIN", "EDITOR"],
  ADMIN_EDITOR_MEMBER: ["ADMIN", "EDITOR", "MEMBER"],
  ADMIN_EDITOR_CUSTOMER: ["ADMIN", "EDITOR", "CUSTOMER"],
  ADMIN_EDITOR_MEMBER_CUSTOMER: ["ADMIN", "EDITOR", "MEMBER", "CUSTOMER", "MESSENGER"],
  CUSTOMER_MESSENGER: ["CUSTOMER", "MESSENGER"],
};
