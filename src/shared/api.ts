import { z } from "zod"
const BASE_URL = " http://localhost:3000"

const UserDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
})

export const API = {
  getUsers: () => {
    return fetch(`${BASE_URL}/users`)
      .then((response) => response.json())
      .then((res) => {
        return UserDTOSchema.array().parse(res);
      });
  },

  getUser: (userId: string) => {
    return fetch(`${BASE_URL}/users/${userId}`)
      .then((response) => response.json())
      .then((res) => {
        return UserDTOSchema.parse(res);
      });
  },

  deleteUser: (userId: string) => {
    return fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
    }).then((response) => response.json());
  }
};
