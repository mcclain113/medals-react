// Add this import to the top!
import { jwtDecode } from "jwt-decode";

export const tc = (str) =>
  str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );

export function getUser(encoded) {
  // return unencoded user / permissions
  const decoded = jwtDecode(encoded);

  // Optional safety check: ensure roles exists before calling indexOf
  const roles = decoded["roles"] || [];

  return {
    name: decoded["username"],
    authenticated: true,
    canPost: roles.indexOf("medals-post") !== -1,
    canPatch: roles.indexOf("medals-patch") !== -1,
    canDelete: roles.indexOf("medals-delete") !== -1,
  };
}
