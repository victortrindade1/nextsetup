import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import minhaLogoTeste from '../assets/vercel.svg'
import { Container } from '../styles/pages/Home'

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Create Next App</title>
      </Head>

      <Image src={minhaLogoTeste} alt="" width={100} height={50} />
      <h1>Hellooooo</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    </Container>
  )
}

export default Home
