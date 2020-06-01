import React, { useState } from "react"; // preserve-line
import { useMutation } from "@apollo/react-hooks"; // preserve-line
import gql from "graphql-tag";

import Button from "../components/button"; // preserve-line
import { GET_LAUNCH } from "./cart-item"; // preserve-line

export const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!, $payMethodId: String) {
    bookTrips(launchIds: $launchIds, payMethodId: $payMethodId) {
      success
      paymentStatus
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

const BookTrips = (props) => {
  const [id, setId] = useState("");

  const [bookTrips, { loading }] = useMutation(BOOK_TRIPS, {
    variables: { launchIds: props.cartItems, payMethodId: id },
    refetchQueries: props.cartItems.map((launchId) => ({
      query: GET_LAUNCH,
      variables: { launchId },
    })),

    update(cache, result) {
      if (result.data.bookTrips.success) {
        cache.writeData({ data: { cartItems: [] } });
      }
      alert(result.data.bookTrips.paymentStatus);
    },
  });

  return loading ? (
    <Button disabled={true}>Loading...</Button>
  ) : (
    <Button
      disabled={!props.stripe}
      onClick={(e) =>
        props.submit(e).then((res) => {
          if (!res.error) {
            setId(res.paymentMethod.id);
            bookTrips();
          }
        })
      }
      data-testid="book-button"
    >
      Book All
    </Button>
  );
};

export default BookTrips;
