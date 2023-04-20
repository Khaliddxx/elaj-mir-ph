import React, { useState, useEffect, Suspense, useContext } from "react";
import "./Dashboard.scss";
import axios from "axios";
import { Table } from "react-bootstrap";
// import AddNewModal from "./AddNewModal";

import deletebtn from "../Assets/delete.svg";
import plus from "../Assets/plus.svg";
import { UserContext } from "../Context/UserContext";

const Dashboard = () => {
  const [orders, setOrders] = useState();
  const [temp, setTemp] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [show, setShow] = useState(false);
  const [khartoumOrders, setKhartoumOrders] = useState(null);
  const [bahriOrders, setBahriOrders] = useState(null);
  const [omdurmanOrders, setOmdurmanOrders] = useState(null);

  const [canceledOrders, setCanceledOrders] = useState(null);
  const [deliveredOrders, setDeliveredOrders] = useState(null);

  const Auth = useContext(UserContext);

  useEffect(() => {
    if (orders) {
      setKhartoumOrders(
        orders
          .filter((order) => order.city.includes("Khartoum"))
          .filter(
            (order) =>
              order.status !== "delivered" && order.status !== "deleted"
          )
      );
      setBahriOrders(
        orders
          .filter((order) => order.city.includes("Bahri"))
          .filter(
            (order) =>
              order.status !== "delivered" && order.status !== "deleted"
          )
      );
      setOmdurmanOrders(
        orders
          .filter((order) => order.city.includes("Omdurman"))
          .filter(
            (order) =>
              order.status !== "delivered" && order.status !== "completed"
          )
      );
      setCanceledOrders(
        orders.filter((order) => order.status.includes("deleted"))
      );
      setDeliveredOrders(
        orders.filter((order) => order.status.includes("delivered"))
      );
    }
  }, [filtered]);

  useEffect(() => {
    console.log(Auth);
    axios
      .get(
        `http://elaj-env.eba-2mybvpfj.eu-west-3.elasticbeanstalk.com/api/orders`
      )
      .then((res) => {
        setOrders(res.data);
        console.log(res.data);
        setFiltered(true);
      });
  }, [temp]);

  const deleteOrder = (id) => {
    console.log("remove by id");
    axios
      .post(
        `http://elaj-env.eba-2mybvpfj.eu-west-3.elasticbeanstalk.com/api/orders/remove/${id}`
      )
      .then((res) => {
        setTemp(!temp);
      });
  };
  const updateOrderStatus = (id, status) => {
    console.log("update order status");
    axios
      .post(
        `http://elaj-env.eba-2mybvpfj.eu-west-3.elasticbeanstalk.com/api/orders/update-status/${id}/${status}`
      )
      .then((res) => {
        setTemp(!temp);
        setFiltered(false);
      });
  };
  return (
    <>
      {Auth.user.isAuthenticated &&
      (Auth.user.type === "deliveryManager" ||
        Auth.user.type === "delivery") ? (
        <div className="orders">
          <h1 className="header-text">Orders</h1>
          <div className="header">
            <h1 className="cat-text content__padding">Khartoum</h1>
          </div>
          <>
            <div
              className="member-table"
              style={{
                marginBottom: "0px !important",
                overflow: "scroll",
                width: "90%",
                margin: "auto",
                borderRadius: "4px",
              }}
            >
              <Table striped hover fixed>
                <thead
                  style={{
                    position: "sticky",
                    top: "0",
                    backgroundColor: "#4a46d0",
                    color: "white",
                    verticalAlign: "middle",
                    position: "relative",
                  }}
                  variant="dark"
                >
                  <tr>
                    <th className="theader">Time</th>
                    <th className="theader">id</th>
                    <th className="theader">Book</th>
                    <th className="theader">Received</th>
                    <th className="theader">Delivered</th>
                    <th className="theader">Prescription</th>
                    <th className="theader">Products</th>
                    <th className="theader">Name</th>
                    <th className="theader">Total</th>
                    <th className="theader">Pharmacy</th>
                    <th className="theader">City</th>
                    <th className="theader">Address</th>
                    <th className="theader">Phone</th>
                    <th className="theader">Status</th>
                    <th className="theader">Location</th>
                    {Auth.user.type == "deliveryManager" && (
                      <th className="theader">Delete</th>
                    )}
                  </tr>
                </thead>
                <Suspense>
                  <tbody>
                    {khartoumOrders &&
                      khartoumOrders
                        .slice(0)

                        .sort((a, b) => {
                          if (
                            a.status === "delivered" &&
                            b.status !== "delivered"
                          )
                            return 1;
                          if (
                            a.status !== "delivered" &&
                            b.status === "delivered"
                          )
                            return -1;
                          return b.id - a.id;
                        })
                        // .reverse()
                        .map((order, idx) => (
                          <tr
                            key={order.id}
                            style={{
                              backgroundColor:
                                order.status === "placed"
                                  ? "transparent"
                                  : order.status === "received"
                                  ? "rgb(252, 223, 173)"
                                  : order.status === "delivered"
                                  ? "rgb(237, 255, 236)"
                                  : order.status === "booked"
                                  ? "rgb(251, 255, 181)"
                                  : order.status === "deleted"
                                  ? "rgb(252, 196, 196)"
                                  : "transparent",
                            }}
                          >
                            <td style={{ minWidth: "100px" }}>
                              {new Date(order.createdAt).toLocaleString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  day: "numeric",
                                  month: "numeric",
                                }
                              )}
                            </td>
                            <td>{order.id}</td>
                            <td>
                              <button
                                className="booked-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "booked")
                                }
                              >
                                Book
                              </button>
                            </td>
                            <td>
                              <button
                                className="received-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "received")
                                }
                              >
                                Received
                              </button>
                            </td>
                            <td>
                              <button
                                className="delivered-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "delivered")
                                }
                              >
                                Delivered
                              </button>
                            </td>{" "}
                            {/* add a unique key */}
                            <td>
                              {order.prescription && (
                                <>
                                  <a
                                    href={order.prescription}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Prescription
                                  </a>
                                </>
                              )}
                            </td>
                            <td style={{ minWidth: "200px" }}>
                              {order.cartItems &&
                                order.cartItems.map((item, idx) => (
                                  <div key={idx}>{`👉🏽 ${item.name} `}</div>
                                ))}
                            </td>
                            <td>{order.name}</td>
                            <td>{order.total}</td>
                            <td>{order.pharmacyName}</td>
                            <td>{order.city}</td>
                            <td>{order.address}</td>
                            <td>{order.phone}</td>
                            <td>{order.status}</td>
                            {order.selectedLocation && (
                              <td>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${order.selectedLocation.lat},${order.selectedLocation.lng}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Location
                                </a>
                              </td>
                            )}
                            {Auth.user.type == "deliveryManager" && (
                              <td>
                                <button
                                  className="delete-btn"
                                  onClick={(e) =>
                                    updateOrderStatus(order._id, "deleted")
                                  }
                                >
                                  <img src={deletebtn} alt="delete button" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </Suspense>
              </Table>
            </div>
          </>
          <div className="header">
            <h1 className="cat-text content__padding">Bahri</h1>
          </div>
          <>
            <div
              className="member-table"
              style={{
                marginBottom: "0px !important",
                overflow: "scroll",
                width: "90%",
                margin: "auto",
                borderRadius: "4px",
              }}
            >
              <Table striped hover fixed>
                <thead
                  style={{
                    position: "sticky",
                    top: "0",
                    backgroundColor: "#4a46d0",
                    color: "white",
                    verticalAlign: "middle",
                    position: "relative",
                  }}
                  variant="dark"
                >
                  <tr>
                    <th className="theader">Time</th>
                    <th className="theader">id</th>
                    <th className="theader">Book</th>
                    <th className="theader">Received</th>
                    <th className="theader">Delivered</th>
                    <th className="theader">Prescription</th>
                    <th className="theader">Products</th>
                    <th className="theader">Name</th>
                    <th className="theader">Total</th>
                    <th className="theader">Pharmacy</th>
                    <th className="theader">City</th>
                    <th className="theader">Address</th>
                    <th className="theader">Phone</th>
                    <th className="theader">Status</th>
                    <th className="theader">Location</th>
                    {Auth.user.type == "deliveryManager" && (
                      <th className="theader">Delete</th>
                    )}
                  </tr>
                </thead>
                <Suspense>
                  <tbody>
                    {bahriOrders &&
                      bahriOrders
                        .slice(0)

                        .sort((a, b) => {
                          if (
                            a.status === "delivered" &&
                            b.status !== "delivered"
                          )
                            return 1;
                          if (
                            a.status !== "delivered" &&
                            b.status === "delivered"
                          )
                            return -1;
                          return b.id - a.id;
                        })
                        // .reverse()
                        .map((order, idx) => (
                          <tr
                            key={order.id}
                            style={{
                              backgroundColor:
                                order.status === "placed"
                                  ? "transparent"
                                  : order.status === "received"
                                  ? "rgb(252, 223, 173)"
                                  : order.status === "delivered"
                                  ? "rgb(237, 255, 236)"
                                  : order.status === "booked"
                                  ? "rgb(251, 255, 181)"
                                  : order.status === "deleted"
                                  ? "rgb(252, 196, 196)"
                                  : "transparent",
                            }}
                          >
                            <td style={{ minWidth: "100px" }}>
                              {new Date(order.createdAt).toLocaleString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  day: "numeric",
                                  month: "numeric",
                                }
                              )}
                            </td>
                            <td>{order.id}</td>
                            <td>
                              <button
                                className="booked-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "booked")
                                }
                              >
                                Book
                              </button>
                            </td>
                            <td>
                              <button
                                className="received-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "received")
                                }
                              >
                                Received
                              </button>
                            </td>
                            <td>
                              <button
                                className="delivered-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "delivered")
                                }
                              >
                                Delivered
                              </button>
                            </td>{" "}
                            {/* add a unique key */}
                            <td>
                              {order.prescription && (
                                <>
                                  <a
                                    href={order.prescription}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Prescription
                                  </a>
                                </>
                              )}
                            </td>
                            <td style={{ minWidth: "200px" }}>
                              {order.cartItems &&
                                order.cartItems.map((item, idx) => (
                                  <div key={idx}>{`👉🏽 ${item.name} `}</div>
                                ))}
                            </td>
                            <td>{order.name}</td>
                            <td>{order.total}</td>
                            <td>{order.pharmacyName}</td>
                            <td>{order.city}</td>
                            <td>{order.address}</td>
                            <td>{order.phone}</td>
                            <td>{order.status}</td>
                            {order.selectedLocation && (
                              <td>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${order.selectedLocation.lat},${order.selectedLocation.lng}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Location
                                </a>
                              </td>
                            )}
                            {Auth.user.type == "deliveryManager" && (
                              <td>
                                <button
                                  className="delete-btn"
                                  onClick={(e) =>
                                    updateOrderStatus(order._id, "deleted")
                                  }
                                >
                                  <img src={deletebtn} alt="delete button" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </Suspense>
              </Table>
            </div>
          </>
          <div className="header">
            <h1 className="cat-text content__padding">Omdurman</h1>
          </div>
          <>
            <div
              className="member-table"
              style={{
                marginBottom: "0px !important",
                overflow: "scroll",
                width: "90%",
                margin: "auto",
                borderRadius: "4px",
              }}
            >
              <Table striped hover fixed>
                <thead
                  style={{
                    position: "sticky",
                    top: "0",
                    backgroundColor: "#4a46d0",
                    color: "white",
                    verticalAlign: "middle",
                    position: "relative",
                  }}
                  variant="dark"
                >
                  <tr>
                    <th className="theader">Time</th>
                    <th className="theader">id</th>
                    <th className="theader">Book</th>
                    <th className="theader">Received</th>
                    <th className="theader">Delivered</th>
                    <th className="theader">Prescription</th>
                    <th className="theader">Products</th>
                    <th className="theader">Name</th>
                    <th className="theader">Total</th>
                    <th className="theader">Pharmacy</th>
                    <th className="theader">City</th>
                    <th className="theader">Address</th>
                    <th className="theader">Phone</th>
                    <th className="theader">Status</th>
                    <th className="theader">Location</th>
                    {Auth.user.type == "deliveryManager" && (
                      <th className="theader">Delete</th>
                    )}
                  </tr>
                </thead>
                <Suspense>
                  <tbody>
                    {omdurmanOrders &&
                      omdurmanOrders
                        .slice(0)

                        .sort((a, b) => {
                          if (
                            a.status === "delivered" &&
                            b.status !== "delivered"
                          )
                            return 1;
                          if (
                            a.status !== "delivered" &&
                            b.status === "delivered"
                          )
                            return -1;
                          return b.id - a.id;
                        })
                        // .reverse()
                        .map((order, idx) => (
                          <tr
                            key={order.id}
                            style={{
                              backgroundColor:
                                order.status === "placed"
                                  ? "transparent"
                                  : order.status === "received"
                                  ? "rgb(252, 223, 173)"
                                  : order.status === "delivered"
                                  ? "rgb(237, 255, 236)"
                                  : order.status === "booked"
                                  ? "rgb(251, 255, 181)"
                                  : order.status === "deleted"
                                  ? "rgb(252, 196, 196)"
                                  : "transparent",
                            }}
                          >
                            <td style={{ minWidth: "100px" }}>
                              {new Date(order.createdAt).toLocaleString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  day: "numeric",
                                  month: "numeric",
                                }
                              )}
                            </td>
                            <td>{order.id}</td>
                            <td>
                              <button
                                className="booked-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "booked")
                                }
                              >
                                Book
                              </button>
                            </td>
                            <td>
                              <button
                                className="received-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "received")
                                }
                              >
                                Received
                              </button>
                            </td>
                            <td>
                              <button
                                className="delivered-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "delivered")
                                }
                              >
                                Delivered
                              </button>
                            </td>{" "}
                            {/* add a unique key */}
                            <td>
                              {order.prescription && (
                                <>
                                  <a
                                    href={order.prescription}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Prescription
                                  </a>
                                </>
                              )}
                            </td>
                            <td style={{ minWidth: "200px" }}>
                              {order.cartItems &&
                                order.cartItems.map((item, idx) => (
                                  <div key={idx}>{`👉🏽 ${item.name} `}</div>
                                ))}
                            </td>
                            <td>{order.name}</td>
                            <td>{order.total}</td>
                            <td>{order.pharmacyName}</td>
                            <td>{order.city}</td>
                            <td>{order.address}</td>
                            <td>{order.phone}</td>
                            <td>{order.status}</td>
                            {order.selectedLocation && (
                              <td>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${order.selectedLocation.lat},${order.selectedLocation.lng}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Location
                                </a>
                              </td>
                            )}
                            {Auth.user.type == "deliveryManager" && (
                              <td>
                                <button
                                  className="delete-btn"
                                  onClick={(e) =>
                                    updateOrderStatus(order._id, "deleted")
                                  }
                                >
                                  <img src={deletebtn} alt="delete button" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </Suspense>
              </Table>
            </div>
          </>
          <div className="header">
            <h1 className="cat-text content__padding">Canceled Orders</h1>
          </div>
          <>
            <div
              className="member-table"
              style={{
                marginBottom: "0px !important",
                overflow: "scroll",
                width: "90%",
                margin: "auto",
                borderRadius: "4px",
              }}
            >
              <Table striped hover fixed>
                <thead
                  style={{
                    position: "sticky",
                    top: "0",
                    backgroundColor: "#4a46d0",
                    color: "white",
                    verticalAlign: "middle",
                    position: "relative",
                  }}
                  variant="dark"
                >
                  <tr>
                    <th className="theader">Time</th>
                    <th className="theader">id</th>
                    <th className="theader">Book</th>
                    <th className="theader">Received</th>
                    <th className="theader">Delivered</th>
                    <th className="theader">Prescription</th>
                    <th className="theader">Products</th>
                    <th className="theader">Name</th>
                    <th className="theader">Total</th>
                    <th className="theader">Pharmacy</th>
                    <th className="theader">City</th>
                    <th className="theader">Address</th>
                    <th className="theader">Phone</th>
                    <th className="theader">Status</th>
                    <th className="theader">Location</th>
                    {Auth.user.type == "deliveryManager" && (
                      <th className="theader">Delete</th>
                    )}
                  </tr>
                </thead>
                <Suspense>
                  <tbody>
                    {canceledOrders &&
                      canceledOrders
                        .slice(0)

                        .sort((a, b) => {
                          if (
                            a.status === "delivered" &&
                            b.status !== "delivered"
                          )
                            return 1;
                          if (
                            a.status !== "delivered" &&
                            b.status === "delivered"
                          )
                            return -1;
                          return b.id - a.id;
                        })
                        // .reverse()
                        .map((order, idx) => (
                          <tr
                            key={order.id}
                            style={{
                              backgroundColor:
                                order.status === "placed"
                                  ? "transparent"
                                  : order.status === "received"
                                  ? "rgb(252, 223, 173)"
                                  : order.status === "delivered"
                                  ? "rgb(237, 255, 236)"
                                  : order.status === "booked"
                                  ? "rgb(251, 255, 181)"
                                  : order.status === "deleted"
                                  ? "rgb(252, 196, 196)"
                                  : "transparent",
                            }}
                          >
                            <td style={{ minWidth: "100px" }}>
                              {new Date(order.createdAt).toLocaleString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  day: "numeric",
                                  month: "numeric",
                                }
                              )}
                            </td>
                            <td>{order.id}</td>
                            <td>
                              <button
                                className="booked-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "booked")
                                }
                              >
                                Book
                              </button>
                            </td>
                            <td>
                              <button
                                className="received-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "received")
                                }
                              >
                                Received
                              </button>
                            </td>
                            <td>
                              <button
                                className="delivered-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "delivered")
                                }
                              >
                                Delivered
                              </button>
                            </td>{" "}
                            {/* add a unique key */}
                            <td>
                              {order.prescription && (
                                <>
                                  <a
                                    href={order.prescription}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Prescription
                                  </a>
                                </>
                              )}
                            </td>
                            <td style={{ minWidth: "200px" }}>
                              {order.cartItems &&
                                order.cartItems.map((item, idx) => (
                                  <div key={idx}>{`👉🏽 ${item.name} `}</div>
                                ))}
                            </td>
                            <td>{order.name}</td>
                            <td>{order.total}</td>
                            <td>{order.pharmacyName}</td>
                            <td>{order.city}</td>
                            <td>{order.address}</td>
                            <td>{order.phone}</td>
                            <td>{order.status}</td>
                            {order.selectedLocation && (
                              <td>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${order.selectedLocation.lat},${order.selectedLocation.lng}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Location
                                </a>
                              </td>
                            )}
                            {Auth.user.type == "deliveryManager" && (
                              <td>
                                <button
                                  className="delete-btn"
                                  onClick={(e) =>
                                    updateOrderStatus(order._id, "deleted")
                                  }
                                >
                                  <img src={deletebtn} alt="delete button" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </Suspense>
              </Table>
            </div>
          </>
          <div className="header">
            <h1 className="cat-text content__padding">Delivered Orders</h1>
          </div>
          <>
            <div
              className="member-table"
              style={{
                marginBottom: "0px !important",
                overflow: "scroll",
                width: "90%",
                margin: "auto",
                borderRadius: "4px",
              }}
            >
              <Table striped hover fixed>
                <thead
                  style={{
                    position: "sticky",
                    top: "0",
                    backgroundColor: "#4a46d0",
                    color: "white",
                    verticalAlign: "middle",
                    position: "relative",
                  }}
                  variant="dark"
                >
                  <tr>
                    <th className="theader">Time</th>
                    <th className="theader">id</th>
                    <th className="theader">Book</th>
                    <th className="theader">Received</th>
                    <th className="theader">Delivered</th>
                    <th className="theader">Prescription</th>
                    <th className="theader">Products</th>
                    <th className="theader">Name</th>
                    <th className="theader">Total</th>
                    <th className="theader">Pharmacy</th>
                    <th className="theader">City</th>
                    <th className="theader">Address</th>
                    <th className="theader">Phone</th>
                    <th className="theader">Status</th>
                    <th className="theader">Location</th>
                    {Auth.user.type == "deliveryManager" && (
                      <th className="theader">Delete</th>
                    )}
                  </tr>
                </thead>
                <Suspense>
                  <tbody>
                    {deliveredOrders &&
                      deliveredOrders
                        .slice(0)

                        .sort((a, b) => {
                          if (
                            a.status === "delivered" &&
                            b.status !== "delivered"
                          )
                            return 1;
                          if (
                            a.status !== "delivered" &&
                            b.status === "delivered"
                          )
                            return -1;
                          return b.id - a.id;
                        })
                        // .reverse()
                        .map((order, idx) => (
                          <tr
                            key={order.id}
                            style={{
                              backgroundColor:
                                order.status === "placed"
                                  ? "transparent"
                                  : order.status === "received"
                                  ? "rgb(252, 223, 173)"
                                  : order.status === "delivered"
                                  ? "rgb(237, 255, 236)"
                                  : order.status === "booked"
                                  ? "rgb(251, 255, 181)"
                                  : order.status === "deleted"
                                  ? "rgb(252, 196, 196)"
                                  : "transparent",
                            }}
                          >
                            <td style={{ minWidth: "100px" }}>
                              {new Date(order.createdAt).toLocaleString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  day: "numeric",
                                  month: "numeric",
                                }
                              )}
                            </td>
                            <td>{order.id}</td>
                            <td>
                              <button
                                className="booked-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "booked")
                                }
                              >
                                Book
                              </button>
                            </td>
                            <td>
                              <button
                                className="received-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "received")
                                }
                              >
                                Received
                              </button>
                            </td>
                            <td>
                              <button
                                className="delivered-btn"
                                onClick={(e) =>
                                  updateOrderStatus(order._id, "delivered")
                                }
                              >
                                Delivered
                              </button>
                            </td>{" "}
                            {/* add a unique key */}
                            <td>
                              {order.prescription && (
                                <>
                                  <a
                                    href={order.prescription}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Prescription
                                  </a>
                                </>
                              )}
                            </td>
                            <td style={{ minWidth: "200px" }}>
                              {order.cartItems &&
                                order.cartItems.map((item, idx) => (
                                  <div key={idx}>{`👉🏽 ${item.name} `}</div>
                                ))}
                            </td>
                            <td>{order.name}</td>
                            <td>{order.total}</td>
                            <td>{order.pharmacyName}</td>
                            <td>{order.city}</td>
                            <td>{order.address}</td>
                            <td>{order.phone}</td>
                            <td>{order.status}</td>
                            {order.selectedLocation && (
                              <td>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${order.selectedLocation.lat},${order.selectedLocation.lng}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Location
                                </a>
                              </td>
                            )}
                            {Auth.user.type == "deliveryManager" && (
                              <td>
                                <button
                                  className="delete-btn"
                                  onClick={(e) =>
                                    updateOrderStatus(order._id, "deleted")
                                  }
                                >
                                  <img src={deletebtn} alt="delete button" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </Suspense>
              </Table>
            </div>
          </>
        </div>
      ) : (
        <h1 className="loginpls">
          Delivery or Delivery manager <br /> Please log in 🔐
        </h1>
      )}
    </>
  );
};

export default Dashboard;
