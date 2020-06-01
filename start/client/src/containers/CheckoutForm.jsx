import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { BookTrips } from "../containers";

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        // Include any additional collected billing details.
        name: "Jenny Rosen",
      },
    });

    return result;
  };

  // const handlePaymentMethodResult = async (result) => {
  //   if (result.error) {
  //     // An error happened when collecting card details,
  //     // show `result.error.message` in the payment form.
  //   } else {
  //     // Otherwise send paymentMethod.id to your server (see Step 3)
  //     const response = await fetch("/pay", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         payment_method_id: result.paymentMethod.id,
  //       }),
  //     });

  //     const serverResponse = await response.json();

  //     handleServerResponse(serverResponse);
  //   }
  // };

  // const handleServerResponse = (serverResponse) => {
  //   if (serverResponse.error) {
  //     // An error happened when charging the card,
  //     // show the error in the payment form.
  //   } else {
  //     console.log(serverResponse); // Show a success message
  //   }
  // };

  const handleCardChange = (event) => {
    if (event.error) {
      // Show `event.error.message` in the payment form.
    }
  };

  return (
    <form>
      <CardElement onChange={handleCardChange} />
      <BookTrips
        stripe={stripe}
        submit={(e) => handleSubmit(e)}
        cartItems={!!props.data ? props.data.cartItems : []}
      />
    </form>
  );
}

//<button type="submit" disabled={!stripe}>
//       Submit Payment
//     </button>
