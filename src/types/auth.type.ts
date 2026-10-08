export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  citizen?: {
    contactNumber?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

export interface GoogleLoginPayload {
  idToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}
