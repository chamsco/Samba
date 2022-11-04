import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from 'react-hook-form'
import { LoginUserInput,loginUserSchema } from '../server/schema/user.schema'
import { trpc } from '../utils/trpc'


const LoginPage: NextPage = (props) => {
  const { handleSubmit, register } = useForm<LoginUserInput>(
  {resolver: zodResolver(loginUserSchema),}
  )
  const router = useRouter()
  const { mutateAsync } = trpc.useMutation(["auth.login"]);
  const onSubmit = useCallback(async (data: LoginUserInput) => {
    const result = await mutateAsync(data);
    console.log("login success")
    if (result.status === "success") {

      router.push("/");
    }
  }, [mutateAsync, router]
  ); 

  return (
    <div>
      <h1>login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" placeholder="heheheheheh" {...register('email')} />
        <input type="password" placeholder='.....' {...register('password')} />
        <button type="submit"> login</button>

      </form>
      <Link href="/register">
        Register
      </Link>
    </div>
  )
}

export default LoginPage