/* eslint-disable global-require */
import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationsErrors from '../../utils/getValidationsErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

const logo = require('../../assets/logo.svg') as string;

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordForm) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório!')
            .email('Digite um e-mail válido!'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Email de recuperação enviado!',
          description:
            'Enviamos um email para confirmar a recuperação de senha, cheque sua caixa de entrada.',
        });
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(e);
          formRef.current?.setErrors(errors);
        } else
          addToast({
            type: 'error',
            title: 'Erro na recuperação de senha!',
            description:
              'Ocorreu um erro ao tentar realizar a recuperação de senha.',
          });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logo} alt="GoBarber" />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Recuperar senha</h1>

              <Input name="email" icon={FiMail} placeholder="E-mail" />

              <Button loading={loading} type="submit">
                Recuperar
              </Button>
            </Form>
            <Link to="/">
              <FiLogIn size={20} />
              Voltar ao login
            </Link>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ForgotPassword;
