# NextJS

Fonte: <https://www.youtube.com/watch?v=1nVUfZg2dSA>

O projeto do professor possui uns erros de atualização de libs. Fiz por minha conta algumas partes com documentação atual.

## Projeto

Setup usando as features:

- NextJS
- TypeScript
- Eslint
- Prettier
- EditorConfig
- Styled Components

O NextJs, diferente do React, não tem o react-router-DOM pra manipular.

Todos os arquivos dentro de `pages` q não possuirem `_`, são endereços acessáveis. Ou seja, `index.tsx` se torna a página main.

## Crie o projeto

`yarn create next-app meu_app`

## Adicione Typescript, Eslint, Prettier, Styled Components

`yarn add styled-components`

`yarn add @babel/core @babel/preset-env @babel/preset-react @types/react @types/styled-components babel-plugin-styled-components eslint eslint-config-next eslint-config-prettier eslint-plugin-react typescript -D`

Os arquivos terminados na extensão `.js` dentro de pages, troque para `.tsx`. Faça uma pasta `src`, e mova pages, styles e tudo q tiver q enfiar em src.

## src/pages/index.tsx

```js
import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <h1>Hellooooo</h1>
      </main>
    </div>
  )
}

export default Home
```

Se vc rodar `yarn dev`, aparecerá o arquivo `tsconfig.json` e tb `next-env.d.ts`. Teste entrando em localhost:3000 no browser.

## Eslint

### .eslintrc.json

O jeito do vídeo dava erro, daí refiz lendo a documentação e deu certo.

Meu jeito:

```js
{
  "extends": [
    "next/core-web-vitals",
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended"
  ]
}
```

Jeito do vídeo (dava erro):

`yarn eslint --init`

```diff
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
+    "jest": true
  },
-  "extends": ["plugin:react/recommended", "standard"],
+  "extends": [
+    "plugin:react/recommended",
+    "standard",
+    "plugin:@typescript-eslint/recommended",
+    "prettier/@typescript-eslint",
+    "prettier/standard",
+    "prettier/react"
+  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
-  "plugins": ["react", "@typescript-eslint"],
+  "plugins": ["react", "@typescript-eslint", "prettier"],
-  "rules": {}
+  "rules": {
+    "prettier/prettier": "error",
+    "space-before-function-paren": "off",
+    "react/prop-types": "off",
+    "no-use-before-define": "off",
+    "@typescript-eslint/no-use-before-define": ["error"]
+  }
}
```

### .eslintignore

```eslintignore
node_modules
.next
/*.js
```

## Prettier

### prettier.config.js

```js
module.exports = {
  semi: false,
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'none',
  endOfLine: 'auto'
}
```

## .editorconfig

```diff
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
+trim_trailing_whitespace = true
+insert_final_newline = true
```

## Styled-components

O styled-components no Next precisa de uma configuração um pouco diferente. Ele por padrão converte o CSS no front-side. Visualmente, o usuário vê o app antes e depois do CSS. Não é tão legal. Pro styled-components converter o CSS sem q o usuário sinta, vai converter pelo server-side.

### babel.config.js

Se vc ver no código de exemplo aqui (<https://github.com/vercel/next.js/tree/canary/examples/with-styled-components>), vc vai ver q tem um `.babelrc`. Vamos fazer o mesmo, só q em vez de .babelrc, vai ser `babel.config.js`, pq assim o vscode entende a sintaxe.

> Eu acrescentei '@babel/preset-react'

```js
module.exports = {
  presets: ['next/babel', '@babel/preset-react'],
  plugins: ['styled-components']
}
```

## src/pages/\_document.tsx

Este código é pronto do exemplo (<https://github.com/vercel/next.js/tree/canary/examples/with-styled-components>), modificado pra typescript. É ele q vai fazer renderizar o CSS pelo server-side.

Se quiser testar se o app tá renderizando pelo servidor, desabilite o javascript do seu browser. Se o app já vier estilizado, é pq deu certo, pois, se React é em js, então o unico jeito de estilizar seria pelo server.

Configurações do header, como fonte global, eu configuro por aqui.

> Toda função assíncrona é uma Promise

```diff
+import React from 'react'
-import Document from 'next/document'
+import Document, { DocumentContext, DocumentInitialProps } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
-  static async getInitialProps(ctx) {
+  static async getInitialProps(
+    ctx: DocumentContext
+  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }
}
```

## src/styles/theme.ts

```ts
const theme = {
  colors: {
    background: '#121214',
    text: '#e1e1e6',
    primary: '#8257e6'
  }
}

export default theme
```

## src/styles/styled.d.ts

Este é um arquivo de definição de type. Sem ele o styled components não interage legal com TS pra criar um tema global.

```ts
import 'styled-components'

import theme from './theme'

export type Theme = typeof theme

declare module 'styled-component' {
  export interface DefaultTheme extends Theme {}
}
```

## src/styles/global.ts

```js
import { createGlobalStyle } from 'styled-components'
import { Theme } from './styled'

export default createGlobalStyle <
  { theme: Theme } >
  `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`
```

## src/pages/\_app.tsx

```diff
import React from 'react'
+import { AppProps } from 'next/app'
+import { ThemeProvider } from 'styled-components'

+import GlobalStyle from '../styles/global'
+import theme from '../styles/theme'

-export default function MyApp({ Component, pageProps }) {
+export default function MyApp({ Component, pageProps }: AppProps) {
  return (
-    <>
+    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
+      <GlobalStyle />
-    </>
+    </ThemeProvider>
  )
}
```

## Config head: Fonte Roboto, lang pt-br, charset, favicon

Configurações no head da aplicação são feitas em `_document.tsx`. Ao criar o render() do \_document, eu preciso tb colocar as tags `<Main />` e `<NextScript />`, que serão, respectivamente, todo o DOM da página e os scripts q ficam no final.

### src/pages/\_document.tsx - parte 2

Não se preocupe com o `<link rel="preconnect">`. É coisa do google fonts.

```diff
import React from 'react'
-import Document, { DocumentContext, DocumentInitialProps } from 'next/document'
+import Document, {
+  DocumentContext,
+  DocumentInitialProps,
+  Html,
+  Head,
+  Main,
+  NextScript
+} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

+  render(): JSX.Element {
+    return (
+      <Html lang="pt">
+        <Head>
+          <meta charSet="utf-8" />
+
+          {/* Fonte Roboto */}
+          <link rel="preconnect" href="https://fonts.googleapis.com" />
+          <link
+            rel="preconnect"
+            href="https://fonts.gstatic.com"
+            crossOrigin="anonymous"
+          />
+          <link
+            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
+            rel="stylesheet"
+          />
+
+          {/* Favicon */}
+          <link rel="icon" href="https://rocketseat.com.br/favicon.ico" />
+        </Head>
+        <body>
+          <Main />
+          <NextScript />
+        </body>
+      </Html>
+    )
  }
}
```

#### .eslintrc.json - parte 2

```diff
{
  "extends": [
    "next/core-web-vitals",
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
+  "globals": {
+    "JSX": true
+  }
}
```

### src/styles/global.ts - parte 2

```diff
import { createGlobalStyle } from 'styled-components'
import { Theme } from './styled'

export default createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
+    font: 400 16px Roboto, sans-serif;
  }
`
```

## Manipular imagens

O professor usa uma lib chamada `next-images`. Mas hj, existe o `next/image` q é nativo e performático.

### src/pages/index.tsx - parte 2

```diff
import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
+import Image from 'next/image'

+import minhaLogoTeste from '../assets/vercel.svg'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
+        <Image src={minhaLogoTeste} alt="" width={100} height={50} />
        <h1>Hellooooo</h1>
      </main>
    </div>
  )
}

export default Home
```

## Next Bundle Analyser

`yarn add @next/bundle-analyzer`

É um plugin pro Next, q verifica por q q seu site está lento. Ele analisa o q do seu projeto pode estar pesado. O professor só comentou sobre, não usou.

## Estilizando o app

Se um arquivo em `pages` estiver sem `_` na frente,o Next sempre reconhece estes arquivos como páginas acessáveis. Por isto, não dá pra criar arquivos de style junto com os arquivos das pages. Por isso, vou criar a pasta pages dentro de `styles`, e lá ter os estilos de cada página.

### src/styles/pages/Home.ts

A página inicial tem q ter o nome `index.tsx`. Esta é a única referência style (Home.ts) com nome diferente da página (index.tsx). As outras páginas eu coloco o mesmo nome.

```ts
import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    font-size: 54px;
    color: ${props => props.theme.colors.primary};
    margin-top: 40px;
  }

  p {
    margin-top: 24px;
    font-size: 24px;
    line-height: 32px;
  }
`
```

### src/pages/index.tsx - parte 3

```diff
import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import minhaLogoTeste from '../assets/vercel.svg'
+import { Container } from '../styles/pages/Home'

const Home: NextPage = () => {
  return (
-    <div>
+    <Container>
      <Head>
        <title>Create Next App</title>
      </Head>

-      <main>
        <Image src={minhaLogoTeste} alt="" width={100} height={50} />
        <h1>Hellooooo</h1>
+        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
-      </main>
-    </div>
+    </Container>
  )
}

export default Home
```

## SWR como wrapper do axios

O `swr` é uma lib criada pela Vercel, mas dá pra usar com React e RN tb. Ela é basicamente um gerenciador de cache de requests. Ela não substitui o axios, e sim se torna um _wrapper_ do axios (ou do fetch). Antes de mostrar a response, ela mostra o cache, e só depois a response. Veja o vídeo abaixo. Nele, tem tb aplicação com axios.

Vídeo q ensina: <https://www.youtube.com/watch?v=Pbs1VIwPoRA>

## SSG (Static Site Generation)

O Next tem como conceito padrão renderizar a página no servidor (server side rendering). Da versão 9.4 pra cima, o Next começou a focar na geração de sites estáticos, incluindo algumas funcionalidades como:

- Geração de páginas estáticas;
- Revalidação dos dados;
- Geração estática incremental;
- Fallback para novos dados;

Vídeo: <https://www.youtube.com/watch?v=u1kCtkVR7cE>
