import React, { useState, useEffect, useContext, Children, createContext } from 'react';
import { Grommet } from 'grommet'
import { getCookie, isExpired } from './common';
import Signin from './component/Signin';
import Signup from './component/Signup';
import Description from './component/Description';
import Main from './component/Main';
import Gathering from './component/Gathering';
import Post from './component/Post';
import MessageBox from './component/MessageBox';
import Setting from './component/Setting';
import Exception from './component/Exception';

const RouterContext = createContext({});

const theme = {
  "global": {
    "colors": {
      "background": {
        "light": "#f2f2f2",
        "dark": "#000000"
      }
    },
    "font": {
      "family": "-apple-system,\n         BlinkMacSystemFont, \n         \"Segoe UI\", \n         Roboto, \n         Oxygen, \n         Ubuntu, \n         Cantarell, \n         \"Fira Sans\", \n         \"Droid Sans\",  \n         \"Helvetica Neue\", \n         Arial, sans-serif,  \n         \"Apple Color Emoji\", \n         \"Segoe UI Emoji\", \n         \"Segoe UI Symbol\""
    }
  },
  "icon": {
    size: {
      small: '12px',
      medium: '24px',
      large: '48px',
      xlarge: '96px',
    },
    extend: undefined,
  },
  "button": {
    "extend": [
      null
    ]
  }
}

const Router = ({ children }) => {
  const [path, setPath] = useState('/signin');

  useEffect(() => {
    const token = getCookie('MONASTERYTOKEN');

    if (token && isExpired(token) === false)
      setPath('/main');

    const onPopState = () => setPath(document.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const push = nextPath => {
    if (nextPath !== path) {
      window.history.pushState(undefined, undefined, nextPath);
      setPath(nextPath);
      window.scrollTo(0, 0);
    }
  }

  return (
    <RouterContext.Provider value={{ path, push }}>
      {children}
    </RouterContext.Provider>
  )
}

const Routes = ({ children }) => {
  const { path: contextPath } = useContext(RouterContext);
  let found;
  Children.forEach(children, child => {
    if (!found && contextPath === child.props.path)
      found = child;
  })
  return found;
}

const Route = ({ Component, path, param }) => {
  const { path: contextPath } = useContext(RouterContext);
  if (contextPath === path) {
    if (path === '/main') {
      return (
        <Component 
          RouterContext={RouterContext} 
          setSelectedGatheringId={param.setSelectedGatheringId} 
          setSelectedGatheringName={param.setSelectedGatheringName}
          setSelectedDescription={param.setSelectedDescription}
          setSelectedPrizeVotes={param.setSelectedPrizeVotes}
          setSelectedCautionVotes={param.setSelectedCautionVotes}
          setSelectedConvictionVotes={param.setSelectedConvictionVotes}
        />
      )
    }
    else if (path === '/gathering') {
      return (
        <Component 
          RouterContext={RouterContext} 
          selectedGatheringId={param.selectedGatheringId} 
          selectedGatheringName={param.selectedGatheringName}
          selectedDescription={param.selectedDescription}
          selectedPrizeVotes={param.selectedPrizeVotes}
          selectedCautionVotes={param.selectedCautionVotes}
          selectedConvictionVotes={param.selectedConvictionVotes}
        />
      )
    }
    else if (path === '/post' || path === '/messagebox') {
      return (
        <Component 
          RouterContext={RouterContext} 
          selectedGatheringId={param.selectedGatheringId} 
          selectedGatheringName={param.selectedGatheringName}
        />
      )
    }
    else {
      return (
        <Component RouterContext={RouterContext} />
      )
    }
  }
  else {
    return null;
  }
}

const App = () => {
  const [selectedGatheringId, setSelectedGatheringId] = useState();
  const [selectedGatheringName, setSelectedGatheringName] = useState();
  const [selectedDescription, setSelectedDescription] = useState();
  const [selectedPrizeVotes, setSelectedPrizeVotes] = useState(0);
  const [selectedCautionVotes, setSelectedCautionVotes] = useState(0);
  const [selectedConvictionVotes, setSelectedConvictionVotes] = useState(0);

  return (
    <Grommet full theme={theme}>
      <Router>
        <Routes>
          <Route 
            path="/exception" 
            Component={Exception} 
            param={{ 
              'setSelectedGatheringId': setSelectedGatheringId, 
              'setSelectedGatheringName': setSelectedGatheringName,
              'setSelectedDescription': setSelectedDescription,
              'setSelectedPrizeVotes': setSelectedPrizeVotes,
              'setSelectedCautionVotes': setSelectedCautionVotes,
              'setSelectedConvictionVotes': setSelectedConvictionVotes
            }} 
          />
          <Route 
            path="/main" 
            Component={Main} 
            param={{ 
              'setSelectedGatheringId': setSelectedGatheringId, 
              'setSelectedGatheringName': setSelectedGatheringName,
              'setSelectedDescription': setSelectedDescription,
              'setSelectedPrizeVotes': setSelectedPrizeVotes,
              'setSelectedCautionVotes': setSelectedCautionVotes,
              'setSelectedConvictionVotes': setSelectedConvictionVotes
            }} 
          />
          <Route path="/setting" Component={Setting} />
          <Route 
            path="/gathering" 
            Component={Gathering} 
            param={{
              'selectedGatheringId': selectedGatheringId,
              'selectedGatheringName': selectedGatheringName,
              'selectedDescription': selectedDescription,
              'selectedPrizeVotes': selectedPrizeVotes,
              'selectedCautionVotes': selectedCautionVotes,
              'selectedConvictionVotes': selectedConvictionVotes
            }} 
          />
          <Route 
            path="/post" 
            Component={Post} 
            param={{
              'selectedGatheringId': selectedGatheringId,
              'selectedGatheringName': selectedGatheringName
            }}
          />
          <Route 
            path="/messagebox" 
            Component={MessageBox} 
            param={{
              'selectedGatheringId': selectedGatheringId,
              'selectedGatheringName': selectedGatheringName
            }}
          />
          <Route path="/signin" Component={Signin} />
          <Route path="/description" Component={Description} />
          <Route path="/signup" Component={Signup} />
        </Routes>
      </Router>
    </Grommet>
  )
};

export default App;
