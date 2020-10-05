/* eslint-disable global-require */
import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationsErrors from '../../utils/getValidationsErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

const logo = require('../../assets/logo.svg') as string;

interface ResetPasswordForm {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordForm) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória!'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação incorreta!',
          ),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!password || !password_confirmation || !token) throw new Error();

        await api.post('password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(e);
          formRef.current?.setErrors(errors);
        } else
          addToast({
            type: 'error',
            title: 'Erro ao resetar a senha!',
            description: 'Ocorreu um erro ao resetar a senha, tente novamente.',
          });
      }
    },
    [addToast, location.search, history],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logo} alt="GoBarber" />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Resetar senha</h1>

              <Input
                name="password"
                icon={FiLock}
                type="password"
                placeholder="Nova senha"
              />

              <Input
                name="password_confirmation"
                icon={FiLock}
                type="password"
                placeholder="Confirmar senha"
              />
              <Button type="submit">Alterar senha</Button>
            </Form>
            <Link to="/">
              <FiLogIn size={20} />
              Ir para login
            </Link>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ResetPassword;
