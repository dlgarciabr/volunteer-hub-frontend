import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
// import { useSelector, useDispatch } from 'react-redux';

import { AppContext, actions } from '../../context/App';
import MainArea from 'views/MainArea';
import { loadLocaleMessages, locales } from '../../utils/i18n';
import useNotification from '../../hooks/notificationHandler';
import { Props } from '../../types';
import logo from '../../logo.svg';
import './style.css';
import Dummy from '../Dummy';
import notifierEffect from './notifierEffect';
import { useSnackbar } from 'notistack';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../utils/reduxStore';

// import { useGetUserByNameQuery } from '../../services/user';
import { useGetTreeNodeByIdQuery, useCreateTreeNodeMutation, TreeNode } from '../../services/familyTreeApi';

const App: React.FC<Props> = () => {
  // const reduxDispatch = useDispatch();
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { showSuccessNotification, showInfoNotification, showErrorNotification } = useNotification();
  const { appSettings: { messages, locale, name, loadInitialData }, dispatch: contextDispatch } = React.useContext(AppContext);
  const { data, error, isLoading } = useGetTreeNodeByIdQuery({ treeNodeId: 3434 });
  const [createTreeNode, { isLoading: createLoading }] = useCreateTreeNodeMutation();

  const changeLanguage = async (newLocale: string) => {
    const newMessages = await loadLocaleMessages(newLocale);
    contextDispatch({
      type: actions.LOCALE_CHANGED,
      messages: newMessages,
      locale: newLocale
    });
  };

  const createRelative = async () => {
    const treeNode = {
      id: 0,
      name: 'string'
    } as TreeNode;

    createTreeNode({ treeNode });
  };

  if (isLoading) {
    // console.log("loading")
  } else {
    // console.log(data);
  }

  notifierEffect();

  useEffect(() => {
    contextDispatch({
      type: actions.INITIAL_DATA_LOADED
    });
  }, []);

  useEffect(() => {
    if (!loadInitialData) {
      showInfoNotification('locale changed to ' + locale);
    }
  }, [locale]);

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
    >
      <div className='App'>
        <MainArea />
        {/* <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            App:
            {name}
          </p>
          <p>
            Selected locale:
            {locale}
          </p>
          <button type='button' onClick={() => createRelative()}>Create node</button>
          <Dummy />
        </header> */}
      </div>
    </IntlProvider>

  );
};

export default App;