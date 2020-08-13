import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const dateNow = new Date(
        new Date().toLocaleString("en-US", { timeZone: "UTC" })
      );
      const milsLeft =
        new Date(
          new Date(order.expiresAt).toLocaleString("en-US", { timeZone: "UTC" })
        ) - dateNow;
      setTimeLeft(Math.round(milsLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51HEdAqLn6sD5AkFURFHV5IPgHDlMQJK6vCLPDLsYEfLcaXrxg0sxBZCXqKo6Jhm3Ft7dHkqAZjAmt7L5KIoCOlSy00OJTeVicR"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
