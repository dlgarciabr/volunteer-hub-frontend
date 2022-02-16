import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../utils/test-utils';
import { locales, getLocatedMessage } from '../../utils/i18n';
import { waitForRequest } from '../../__mocks__/msw-server';

import App from '../App';

const baseUrl = process.env.REACT_APP_API_URL;

describe('Sign up process', () => {
  const mainAreaHeaderTitle = getLocatedMessage(locales.EN.value, 'app-title');
  const firstNameLabel = getLocatedMessage(locales.EN.value, 'signup.first.name.label');
  const lastNameLabel = getLocatedMessage(locales.EN.value, 'signup.last.name.label');
  const emailLabel = getLocatedMessage(locales.EN.value, 'signup.email.label');
  const passwordId = 'password';
  const confirmPasswordId = 'confirmPassword';
  const signUpButtonLabel = getLocatedMessage(locales.EN.value, 'signup.button.label');
  const submitButtonLabel = getLocatedMessage(locales.EN.value, 'default.submit.button.label');
  const backButtonLabel = getLocatedMessage(locales.EN.value, 'default.back.button.label');

  test('User complete the sign up and access main page', async () => {
    //arrange
    const pendingRequest = waitForRequest('POST', `${baseUrl}/user/signup`);
    const email = 'abc@mail.com';
    const password = 'XXXXXXXX';
    const firstName = 'XXXXXX';
    const lastName = 'XXXXXX';

    render(<App />);

    //act
    userEvent.click(
      screen.getByRole('button', { name: signUpButtonLabel })
    );

    const firstNameField = await screen.findByRole('textbox', {
      name: firstNameLabel,
    });
    userEvent.type(firstNameField, firstName);

    const lastNameField = screen.getByRole('textbox', {
      name: lastNameLabel,
    });
    userEvent.type(lastNameField, lastName);

    const emailField = screen.getByRole('textbox', {
      name: emailLabel,
    });
    userEvent.type(emailField, email);

    const passwordField = screen.getByTestId(passwordId).childNodes[1]
      .childNodes[0] as Element;

    userEvent.type(passwordField, password);

    const confirmPasswordField = screen.getByTestId(confirmPasswordId).childNodes[1]
      .childNodes[0] as Element;

    userEvent.type(confirmPasswordField, password);

    userEvent.click(
      screen.getByRole('button', { name: submitButtonLabel })
    );

    //assert
    const request = await pendingRequest;

    expect(request.body).toEqual({
      email,
      password,
      firstName,
      lastName,
      confirmPassword: password
    })

    expect(
      await screen.findByText(mainAreaHeaderTitle)
    ).toBeInTheDocument();

  }, 7000);

  test('Fail on doing sign up with incomplete form', async () => {
    //arrange
    const email = '';
    const password = '';
    const firstName = '';
    const lastName = '';
    const firstNameRequiredMessage = getLocatedMessage(locales.EN.value, 'signup.first.name.required.message');
    const lastNameRequiredMessage = getLocatedMessage(locales.EN.value, 'signup.last.name.required.message');
    const emailRequiredMessage = getLocatedMessage(locales.EN.value, 'signup.email.required.message');
    const passwordRequiredMessage = getLocatedMessage(locales.EN.value, 'signup.password.required.message');
    const confirmPasswordRequiredMessage = getLocatedMessage(locales.EN.value, 'signup.confirmPassword.required.message');

    render(<App />);

    //act
    userEvent.click(
      screen.getByRole('button', { name: signUpButtonLabel })
    );

    const firstNameField = await screen.findByRole('textbox', {
      name: firstNameLabel,
    });
    userEvent.type(firstNameField, firstName);

    const lastNameField = screen.getByRole('textbox', {
      name: lastNameLabel,
    });
    userEvent.type(lastNameField, lastName);

    const emailField = screen.getByRole('textbox', {
      name: emailLabel,
    });
    userEvent.type(emailField, email);

    const passwordField = screen.getByTestId(passwordId).childNodes[1]
      .childNodes[0] as Element;

    userEvent.type(passwordField, password);

    const confirmPasswordField = screen.getByTestId(confirmPasswordId).childNodes[1]
      .childNodes[0] as Element;

    userEvent.type(confirmPasswordField, password);

    userEvent.click(
      screen.getByRole('button', { name: submitButtonLabel })
    );

    //assert
    expect(
      await screen.findByText(firstNameRequiredMessage)
    ).toBeInTheDocument();

    expect(
      screen.getByText(lastNameRequiredMessage)
    ).toBeInTheDocument();

    expect(
      screen.getByText(emailRequiredMessage)
    ).toBeInTheDocument();

    expect(
      screen.getByText(passwordRequiredMessage)
    ).toBeInTheDocument();

    expect(
      screen.getByText(confirmPasswordRequiredMessage)
    ).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: backButtonLabel });
    userEvent.click(backButton);
  });

  test('Fail on doing sign up with wrong email field', async () => {
    //arrange
    const email = 'XXXXXXXXX';
    const emailInvalidMessage = getLocatedMessage(locales.EN.value, 'signup.email.invalid.message');

    render(<App />);

    //act
    userEvent.click(
      screen.getByRole('button', { name: signUpButtonLabel })
    );

    const emailField = await screen.findByRole('textbox', {
      name: emailLabel,
    });
    userEvent.type(emailField, email);

    userEvent.click(
      screen.getByRole('button', { name: submitButtonLabel })
    );

    //assert
    expect(
      await screen.findByText(emailInvalidMessage)
    ).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: backButtonLabel });
    userEvent.click(backButton);
  });

  test('Fail on doing sign up with wrong confirm password field', async () => {
    //arrange
    const password = 'xxxxxxxx';
    const passwordNotMatchMessage = getLocatedMessage(locales.EN.value, 'signup.confirmPassword.not.match.message');

    render(<App />);

    //act
    userEvent.click(
      screen.getByRole('button', { name: signUpButtonLabel })
    );

    const passwordField = screen.getByTestId(passwordId).childNodes[1]
      .childNodes[0] as Element;

    userEvent.type(passwordField, password);

    const confirmPasswordField = screen.getByTestId(confirmPasswordId).childNodes[1]
      .childNodes[0] as Element;

    userEvent.type(confirmPasswordField, 'aaaaaaaa');

    userEvent.click(
      screen.getByRole('button', { name: submitButtonLabel })
    );

    //assert
    expect(
      await screen.findByText(passwordNotMatchMessage)
    ).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: backButtonLabel });
    userEvent.click(backButton);
  });
});

