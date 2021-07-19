import MainGrid from './src/Componentes/MainGrid';
import Box from './src/Componentes/Box';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from './src/lib/AluraKutCommons';
import { ProfileRelationsBoxWrapper } from './src/Componentes/ProfileRelations';
import React from 'react';


function ProfileSidebar(propriedades) {
  console.log(propriedades);
  return (

    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />

    </Box>

  )
}
function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>

      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        { /*seguidores.map((itemAtual) => {
          return (

            <li key={itemAtual.id}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>

          )
        }) */}
      </ul>

    </ProfileRelationsBoxWrapper>
  )
}


export default function Home(props) {

  const usuarioAleatorio = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);

  //const githubUser = 'lucimarNeves';
  const pessoasFavoritas = ['juunegreiros', 'omariosouto', 'rafaballerini', 'marcobrunodev',
    'guilhermesilveira', 'peas'];
  pessoasFavoritas.slice(0, 6);


  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function () {

    fetch('https://api.github.com/users/peas/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();

      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      })

    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '222a86b7c5f89c077c38ff346b2338',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },

      body: JSON.stringify({
        "query": `query {
              allCommunities{
                title
                id
                imageUrl
                creatorSlug
              }
             }`

      })

    })
      .then((response) => response.json())
      .then((respostaCompleta => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        console.log(comunidadesVindasDoDato)
        setComunidades(comunidadesVindasDoDato)
      }))
  }, [])


  return (
    <>
      <AlurakutMenu />
      <MainGrid>

        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>


        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle"> O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();

              const dadosDoForm = new FormData(e.target);
              console.log('Campo: ', dadosDoForm.get('title'));
              console.log('Campo: ', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: usuarioAleatorio,
              }


              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
                .then(async (response) => {
                  const dados = await response.json();
                  //console.log(dados);
                  const comunidade = dados.registrosCriados;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);

                  comunidadesAtualizadas.slice(0, 6);
                })

            }} >
              <div>
                <input placeholder="Qual vai ser o nome da sua comunidade"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade" />
              </div>

              <div>
                <input placeholder="Coloque uma URl para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URl para usarmos de capa" />
              </div>

              <button> Criar comunidade </button>


            </form>

          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (

                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

        </div>

      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {

  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const { githubUser } = jwt.decode(token);

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
    .then((resposta) => resposta.json())

  console.log('isAuthenticated', isAuthenticated);

  if (!githubUser) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } return {
    props: {
      githubUser,
    },
  }
}


