"use server";

import { withActionHandler } from "@/components/utils/ActionUtils";
import { GlobalApiCall } from "@/components/utils/GlobalApiCall";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.API_BASE_URL;

export async function LoginApi({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) {
  const response = await withActionHandler(async() => {
      const response = await GlobalApiCall({
        url: `${API_BASE_URL}/auth/login`,
        options: {
          method: "post",
          body: JSON.stringify({ identifier, password }),
          cache: 'no-cache'
        },
      });
      return response;
  })

  if (response.status != 400) {
    const cookieStore = cookies();
  
    cookieStore.set('token', response.token)

    redirect('/home')
  }

  return response;
}

export async function RegisterApi({
  username,
  email,
  password,
  passwordConfirm,
}: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) {

  return withActionHandler(async() => {
      const response = await GlobalApiCall({
        url: `${API_BASE_URL}/auth/register`,
        options: {
          method: "post",
          body: JSON.stringify({ username, email, password, passwordConfirm }),
          cache: 'no-cache'
        },
      });
      return response;
  })

}


export async function Logout() {
  const cookieStore = cookies();
  
  cookieStore.delete('token');

  redirect('/login')
}