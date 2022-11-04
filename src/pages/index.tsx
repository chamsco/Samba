import type { NextPage, InferGetServerSidePropsType } from 'next';
import { Layout } from '../components/layout';
import {Header} from '../components/layout/header/Header';
import { trpc } from '../utils/trpc';

export const getServerSideProps = async () => {
  return {
    props: {
      requireAuth: false,
      enableAuth: false,
    },
  };
};

const HomePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const user = trpc.useQuery(['users.me']);
  if (user.data) {
    console.log(user.data)
  }
  const hello = trpc.useQuery(['hello', { text: 'client' }]);

  if (!hello.data) {
    return <p>Loading...</p>;
  }

  if (hello.status === 'error') {
    return <p>Error: {hello.error.message}</p>;
  }

    return (
      <>
        <Layout>
        <section className='bg-ct-blue-600 min-h-screen pt-20'>
          <div className='max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center'>
            <p className='text-3xl font-semibold'>{hello.data.greeting}</p>
            <br />
            <p></p>
          </div>
        </section>
        </Layout>
        </>
    );
  };
export default HomePage;