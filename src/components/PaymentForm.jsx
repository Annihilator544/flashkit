import React from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) {
      return
    }
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: 'https://your-frontend-url.com/thank-you' }
    })
    if (error) {
      console.log(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Pay</button>
    </form>
  )
}

export default PaymentForm
