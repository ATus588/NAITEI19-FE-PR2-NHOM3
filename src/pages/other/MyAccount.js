import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { connect } from 'react-redux';
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/actions/authAction";
import { updateUser as updateUserServer } from "../../serverAPI";
import { useToasts } from "react-toast-notifications";
import Addresses from "../../components/my-account/Addresses";
import serverAPI from "../../serverAPI";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip,
} from "@material-ui/core";

const MyAccount = ({ location, user, id }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { pathname } = location;

  const [currentUser, setCurrentUser] = useState(user)
  const [passForm, setPassForm] = useState({ password: '', newPass: '', passConfirm: '' })
  const [open, setOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', street: '', ward: '', district: '', city: '' })
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách đơn hàng của người dùng hiện tại
    async function fetchUserOrders() {
      try {
        const response = await serverAPI.get(`/orders?userId=${user.id}`);
        setUserOrders(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        addToast("Lỗi khi lấy danh sách đơn hàng", { appearance: "error", autoDismiss: true });
      }
    }

    if (user) fetchUserOrders();
  }, [id, addToast]);

  useEffect(async () => {
    const status = await updateUserServer(currentUser, user.id);
    dispatch(updateUser(currentUser));
    addToast('Update successfully', { appearance: 'success', autoDismiss: true });
  }, [currentUser])

  //info update
  function onChangeInfo(e) {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    setCurrentUser({ ...currentUser, [name]: value });
  }
  async function onSubmitInfor(e) {
    e.preventDefault();
  }

  //password update
  function onChangePass(e) {
    e.preventDefault();
    const value = e.target.value;
    const name = e.target.name;
    setPassForm({ ...passForm, [name]: value });
  }
  async function onSubmitPass(e) {
    e.preventDefault();
    if (passForm.password === currentUser.password && passForm.newPass === passForm.passConfirm && passForm.newPass !== passForm.password) {
      setCurrentUser({ ...currentUser, password: passForm.newPass })
    } else addToast("Update failed, please check the input", { appearance: 'error', autoDismiss: true })
  }

  //address update
  async function onDelete(e, id) {
    e.preventDefault();
    const newAddresses = currentUser.addresses.filter((address) => address.id != id)
    setCurrentUser({ ...currentUser, addresses: newAddresses })
  }
  function onAdd(e) {
    e.preventDefault();
    setOpen(true);
  }
  function onChangeAddress(e) {
    e.preventDefault();
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  }
  async function onConfirmAdd(e) {
    e.preventDefault();
    setCurrentUser({ ...currentUser, addresses: [...currentUser.addresses, addressForm] })
    setAddressForm({ name: '', street: '', ward: '', district: '', city: '' })
  }

  return (
    <Fragment>
      <MetaTags>
        <title>Flone | My Account</title>
        <meta
          name="description"
          content="My Account Page"
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        My Account
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ml-auto mr-auto col-lg-9">
                <div className="myaccount-wrapper">
                  {user && (
                    <Accordion defaultActiveKey="0">
                      <Card className="single-my-account mb-20">
                        <Card.Header className="panel-heading">
                          <Accordion.Toggle variant="link" eventKey="0">
                            <h3 className="panel-title">
                              <span>1 .</span> Edit your account information{" "}
                            </h3>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div className="myaccount-info-wrapper">
                              <div className="account-info-wrapper">
                                <h4>My Account Information</h4>
                                <h5>Your Personal Details</h5>
                              </div>
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>First Name</label>
                                    <input type="text" value={currentUser.firstname} name="firstname" onChange={onChangeInfo} />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>Last Name</label>
                                    <input type="text" value={currentUser.lastname} name="lastname" onChange={onChangeInfo} />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>Email Address</label>
                                    <input type="email" value={currentUser.email} name="email" onChange={onChangeInfo} />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>Telephone</label>
                                    <input type="text" value={currentUser.phone} name="phone" onChange={onChangeInfo} />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="billing-info">
                                    <label>Fax</label>
                                    <input type="text" value={currentUser.fax} name="fax" onChange={onChangeInfo} />
                                  </div>
                                </div>
                              </div>
                              <div className="billing-back-btn">
                                <div className="billing-btn">
                                  <button type="submit" onClick={onSubmitInfor}>Continue</button>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card className="single-my-account mb-20">
                        <Card.Header className="panel-heading">
                          <Accordion.Toggle variant="link" eventKey="1">
                            <h3 className="panel-title">
                              <span>2 .</span> Change your password
                            </h3>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                          <Card.Body>
                            <div className="myaccount-info-wrapper">
                              <div className="account-info-wrapper">
                                <h4>Change Password</h4>
                                <h5>Your Password</h5>
                              </div>
                              <div className="row">
                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>Password</label>
                                    <input type="password" onChange={onChangePass} name="password" value={passForm.password} />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>New Password</label>
                                    <input type="password" onChange={onChangePass} name="newPass" value={passForm.newPass} />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="billing-info">
                                    <label>Password Confirm</label>
                                    <input type="password" onChange={onChangePass} name="passConfirm" value={passForm.passConfirm} />
                                  </div>
                                </div>
                              </div>
                              <div className="billing-back-btn">
                                <div className="billing-btn">
                                  <button type="submit" onClick={onSubmitPass}>Continue</button>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card className="single-my-account mb-20">
                        <Card.Header className="panel-heading">
                          <Accordion.Toggle variant="link" eventKey="2">
                            <h3 className="panel-title">
                              <span>3 .</span> Modify your address book entries{" "}
                            </h3>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="2">
                          <Card.Body>
                            <div className="myaccount-info-wrapper">
                              <div className="account-info-wrapper">
                                <h4>Address Book Entries</h4>
                              </div>
                              <Addresses onDelete={onDelete} />
                              <div className="billing-back-btn">
                                <div className="billing-btn">
                                  <button type="button" onClick={onAdd}>Add</button>
                                </div>
                              </div>
                              {open && (
                                <form className="row">
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>Profile name</label>
                                      <input type="text" name="name" onChange={onChangeAddress} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>Street</label>
                                      <input type="text" name="street" onChange={onChangeAddress} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>Ward</label>
                                      <input type="text" name="ward" onChange={onChangeAddress} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>District</label>
                                      <input type="text" name="district" onChange={onChangeAddress} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>City</label>
                                      <input type="text" name="city" onChange={onChangeAddress} />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 billing-back-btn">
                                    <div className="billing-btn">
                                      <button type="button" onClick={onConfirmAdd}>Confirm</button>
                                    </div>
                                  </div>
                                </form>
                              )}
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                      <Card className="single-my-account mb-20">
                        <Card.Header className="panel-heading">
                          <Accordion.Toggle variant="link" eventKey="3">
                            <h3 className="panel-title">
                              <span>4 .</span> Đơn hàng của bạn{" "}
                            </h3>
                          </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="3">
                          <Card.Body>
                            <div className="myaccount-info-wrapper">
                              <div className="account-info-wrapper">
                                <h4>Danh sách đơn hàng</h4>
                              </div>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Họ</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>SĐT</TableCell>
                                    <TableCell>Ngày đặt hàng</TableCell>
                                    <TableCell>Ngày giao hàng </TableCell>
                                    <TableCell>Tổng tiền</TableCell>
                                    <TableCell>Chi tiết</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {userOrders && userOrders.length > 0 ? (
                                    userOrders.map((order) => (
                                      <TableRow key={order.id}>
                                        {/* <TableCell>{order.id}</TableCell> */}
                                        <TableCell>
                                          <Chip
                                            label={order.status}
                                            style={{
                                              backgroundColor: order.statusColor,
                                              color: "#fff",
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          {order.FirstName}
                                        </TableCell>
                                        <TableCell>
                                          {order.LastName}
                                        </TableCell>
                                        <TableCell>
                                          {order.phone}
                                        </TableCell>

                                        <TableCell>
                                          {order.orderDate}
                                          {/* {format(
                                        new Date(order.orderDate),
                                        "dd/MM/yyyy"
                                      )} */}
                                        </TableCell>
                                        <TableCell>
                                          {order.deliveryDate}
                                          {/* {" "}
                                      {console.log("Value of order.shippingDate:", order.deliveryDate)}
                                      {order.deliveryDate ? format(new Date(order.deliveryDate), "dd/MM/yyyy") : 'chua co ngay giao hang'} */}

                                        </TableCell>
                                        <TableCell>
                                          {order.totalPrice} VND
                                        </TableCell>
                                        <TableCell>
                                          {/* <Link to={`/order-detail/${order.id}`}> */}
                                          Xem
                                          {/* </Link> */}
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <p>chưa có đơn hàng nào.</p>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion>
                  )
                  }
                  {
                    !user && (
                      <div className="d-flex justify-content-center align-items-center mb-3">
                        Fotgot to login?
                        <a href="/login-register">
                          <button type="button" className="btn btn-dark ml-2">
                            Login
                          </button>
                        </a>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

MyAccount.propTypes = {
  location: PropTypes.object,
  user: PropTypes.object,
  id: PropTypes.any,
};


const mapStateToProps = state => {
  return {
    user: state.authData.currentUser,
    id: state.authData.currentUser ? state.authData.currentUser.id : '',
  }
}

export default connect(mapStateToProps)(MyAccount);

