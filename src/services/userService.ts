import { User, UserCreate, UserLogin } from "@/types/user";
import { BACKOFFICE_BASE_API_URL, PUBLIC_BASE_API_URL } from "./config";

export const loginUser = async (user: UserLogin): Promise<User> => {
  const res = await fetch(PUBLIC_BASE_API_URL + "user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (res.status === 401) {
    throw new Error("Invalid credentials");
  }

  const userResponse = (await res.json()) as User;
  if (
    !userResponse.roles.includes("ADMIN") &&
    !userResponse.roles.includes("STAFF")
  ) {
    throw new Error("Unsufficient permissions");
  }

  return userResponse;
};

export const updateUser = async (
  id: number,
  user: UserCreate,
  jwt: string,
): Promise<User> =>
  fetch(BACKOFFICE_BASE_API_URL + "user/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify(user),
  }).then((res) => res.json() as Promise<User>);
