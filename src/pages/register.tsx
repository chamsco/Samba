import { NextPage, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useCallback } from "react";
import { useRouter } from "next/router";
import { useForm, FormProvider, SubmitHandler  } from 'react-hook-form'
import { CreateUserInput,createUserSchema } from '../server/schema/user.schema'
import { trpc } from '../utils/trpc'
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSidePropsContext } from "next";
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const { mutate: SignUpUser, isLoading } = trpc.useMutation(
    ['auth.register'],
    {
      onSuccess(data) {
        toast(`Welcome ${data.data.user.Nom}!`, {
          type: 'success',
          position: 'top-right',
        });
        console.log(data.data.user);
        router.push('/login');
      },
      onError(error) {
        toast(error.message, {
          type: 'error',
          position: 'top-right',
        });
      },
    }
  );

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<CreateUserInput> = (values) => {
    // 👇 Execute the Mutation
    SignUpUser(values);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        {/*error && error.message*/}
        <h1>Register</h1>

        <input
          type="email"
          placeholder="tom.mcdonald@example.com"
          {...register('email')}
        />
        <br />
        <input type="text" placeholder="Tom123" {...register('username')} />        <br />
        <br />

        <input type="text" placeholder="McDonald" {...register('Nom')} />
        <input type="text" placeholder="Tom" {...register('Prenom')} />
        <br />

        <input type="password" placeholder="password" {...register('password')} />
        <input type="password" placeholder="confirm password" {...register('passwordConfirm')} />

        <button type="submit">Register</button>
      </form>

      <Link href="/login">Login</Link>
    </>
  )
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      requireAuth: false,
      enableAuth: false,
    },
  };
};

export default RegisterPage