export interface Props {
  children?: JSX.Element | string;
};

export interface IndexedType {
  [key: string]: string;
}

export interface Locale {
  value: string;
  name: string;
  messages: Record<string, string>;
  getMessage: (key: string) => string;
}

export interface AppSettings {
  loadInitialData: boolean;
  locale: Locale;
}

export interface AppContextType {
  appSettings: AppSettings;
  dispatch: React.Dispatch<any>;
}

export interface AuthContextState {
  user: User | null;
  token: string | null;
}

export interface AuthContextType {
  state: AuthContextState,
  operations: {
    signIn: (credentials: AuthCredentials, callback: VoidFunction) => void;
    signOut: (callback?: VoidFunction) => void;
    signUp: (userData: User) => void;
    validateToken: (storageCredentials: string, nextLocation: string) => void;
  }
}

export interface AuthCredentials extends IndexedType {
  email: string;
  password: string;
}

export interface User extends IndexedType {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userStatus?: number;
}

export interface Volunteer extends User {
  preferedSupportLanguages: string;
  preferedSupportType: string;
  title?: string;
  coverLetter?: string;
  photo?: string;
  phone?: string;
}