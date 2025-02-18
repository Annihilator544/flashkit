import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { createStore } from 'polotno/model/store';
import { unstable_setAnimationsEnabled } from 'polotno/config';
import { Auth0Provider } from '@auth0/auth0-react';
import { createProject, ProjectContext } from './plotNoFeatures/project';

import './index.css';
import App from './App';
import './plotNoFeatures/logger';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashBoard from 'Dashboard';
import Signup from 'Signup';
import Login from 'Login';
import ProtectedRoute from 'layouts/ProtectedRoute';
import PrivacyPolicy from 'PrivacyPolicy';
import TermsOfService from 'TermsOfService';
import Secret from 'Secret';
import Billing from 'Billing';
import PublicView from 'PublicView';
import DataConsistency from 'layouts/DataConsistency';
import { Toaster } from './components/ui/toaster';
import Legal from 'Legal';
import FAQ from 'FAQ';
import AboutUs from 'AboutUs';
import Onboarding from 'Onboarding';
import Payments from 'Payments';

// if (window.location.host !== 'studio.polotno.com') {
//   console.log(
//     `%cWelcome to Polotno Studio! Thanks for your interest in the project!
// This repository has many customizations from the default version Polotno SDK.
// I don't recommend to use it as starting point. 
// Instead, you can start from any official demos, e.g.: https://polotno.com/docs/full-canvas-editor 
// or direct sandbox: https://codesandbox.io/s/github/polotno-project/polotno-site/tree/source/examples/polotno-demo?from-embed.
// But feel free to use this repository as a reference for your own project and to learn how to use Polotno SDK.`,
//     'background: rgba(54, 213, 67, 1); color: white; padding: 5px;'
//   );
// }

unstable_setAnimationsEnabled(true);

const store = createStore({ key: 'iRIwFHCuH539pYGokN6n' });
window.store = store;
store.addPage();

const project = createProject({ store });
window.project = project;

const root = ReactDOM.createRoot(document.getElementById('root'));

const AUTH_DOMAIN = 'polotno-studio.eu.auth0.com';
const PRODUCTION_ID = process.env.REACT_APP_AUTH0_ID;
const LOCAL_ID = process.env.REACT_APP_AUTH0_ID;

const isLocalhost =
  typeof window !== "undefined" && window.location.href.indexOf('localhost') >= 0;
const ID = isLocalhost ? LOCAL_ID : PRODUCTION_ID;
const REDIRECT = isLocalhost
  ? 'http://localhost:3000'
  : 'https://canva-sable.vercel.app/';

function Fallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <p>Something went wrong in the app.</p>
        <p>Try to reload the page.</p>
        <p>If it does not work, clear cache and reload.</p>
        <button
          onClick={async () => {
            await project.clear();
            window.location.reload();
          }}
        >
          Clear cache and reload
        </button>
      </div>
    </div>
  );
}
const ExternalRedirect = () => {
const isLocalhost =
typeof window !== "undefined" && window.location.href.indexOf('localhost') >= 0;
  useEffect(() => {
    window.location.href =isLocalhost? '/dashboard' : 'https://www.flashkit.co.uk/';
  }, []);
  return null;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <ExternalRedirect />, // Redirect to external URL,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DataConsistency><DashBoard store={store}/></DataConsistency></ProtectedRoute>,
  },
  {
    path: "/legal",
    element: <Legal />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/aboutus",
    element: <AboutUs />,
  },
  {
    path: "/terms",
    element: <TermsOfService />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/canvas",
    element: <ProtectedRoute><DataConsistency><App store={store} /></DataConsistency></ProtectedRoute>,
  },
  {
    path: "/public",
    element: <PublicView  store={store} />,
  },
  {
    path: "/payments",
    element: <ProtectedRoute><Payments/></ProtectedRoute>,
  },
  {
    path: "/billing",
    element: <Billing />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  }
]);

root.render(
  <ErrorBoundary
    FallbackComponent={Fallback}
    onReset={(details) => {
      // Reset the state of your app so the error doesn't happen again
    }}
    onError={(e) => {
      if (window.Sentry) {
        window.Sentry.captureException(e);
      }
    }}
  >
  <Toaster />
    <ProjectContext.Provider value={project}>
      <Auth0Provider domain={AUTH_DOMAIN} clientId={ID} redirectUri={REDIRECT}>
        <RouterProvider router={router}>
          <App store={store} />
        </RouterProvider>
      </Auth0Provider>
    </ProjectContext.Provider>
  </ErrorBoundary>
);
