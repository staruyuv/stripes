import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Header, Loading } from "../components";
import { CartItem } from "../containers";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../containers/CheckoutForm";

const stripePromise = loadStripe("pk_test_U6nOrkoKej2P3cRigIyhy7UH00jcq9XtPC");

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

const Cart = () => {
  const { data, loading, error } = useQuery(GET_CART_ITEMS);

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <Fragment>
      <Header>My Cart</Header>
      {!data || (!!data && data.cartItems.length === 0) ? (
        <p data-testid="empty-message">No items in your cart</p>
      ) : (
        <Fragment>
          {!!data &&
            data.cartItems.map((launchId) => (
              <CartItem key={launchId} launchId={launchId} />
            ))}
          <Elements stripe={stripePromise}>
            <CheckoutForm data={data} />
          </Elements>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
