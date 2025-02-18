import PaymentForm from './components/PaymentForm';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51QtBigQNY7vDIzEvYixGmlsFvUXaw5pNrflSYbUkvNLvPiDbBrcLszi4DWDGB1z6LpsjL2iEnrFSA9VbxxtVKhsL00e5DlVnHN');

export default function Payments() {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: '{{CLIENT_SECRET}}',
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm />
    </Elements>
  );
};