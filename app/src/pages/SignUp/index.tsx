import React, { useCallback, useRef } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';
import getValidationsErrors from '../../utils/getValidationsErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logo from '../../assets/logo.png';

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInText,
} from './styles';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: SignUpForm) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório!'),
          email: Yup.string()
            .required('Email obrigatório!')
            .email('Digite um e-mail válido!'),
          password: Yup.string().min(6, 'No mínimo seis dígitos!'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        await api.post('/users', data);
        Alert.alert('Cadastro realizado!', 'Você já pode fazer seu logon.');
        navigation.goBack();
      } catch (e) {
        if (e instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(e);
          formRef.current?.setErrors(errors);
        } else Alert.alert('Erro no cadastro!', 'Ocorreu um erro no cadastro.');
      }
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logo} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
              />
              <Input
                ref={emailRef}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
              />
              <Input
                ref={passwordRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignInButton
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignInButton>
    </>
  );
};

export default SignUp;
