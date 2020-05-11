/* eslint-disable global-require */
import React from 'react';
import { FiLogIn } from 'react-icons/fi';

import { Container, Content, Background } from './styles';

const logo = require('../../assets/logo.svg') as string;

const SignIn: React.FC = () => (
  <>
    <Container>
      <Content>
        <img src={logo} alt="GoBarber" />

        <form>
          <h1>Faça seu logon</h1>

          <input placeholder="E-mail" />
          <input type="password" placeholder="Senha" />
          <button type="submit">Entrar</button>

          <a href="teste">Esqueci minha senha</a>
        </form>
        <a href="teste">
          <FiLogIn size={20} />
          Criar conta
        </a>
      </Content>
      <Background />
    </Container>
  </>
);

export default SignIn;
