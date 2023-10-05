import PropTypes from "prop-types";
import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { multilanguage, loadLanguages } from "redux-multilanguage";
import { connect } from "react-redux";
import { BreadcrumbsProvider } from "react-breadcrumbs-dynamic";

import { fetchProducts } from "./redux/actions/productActions";
import { fetchReviews } from "./redux/actions/reviewsAction";

// home pages
const HomeBookStore = lazy(() => import("./pages/home/HomeBookStore"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

// shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));
const ProductTabLeft = lazy(() =>
  import("./pages/shop-product/ProductTabLeft")
);
//other
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const Cart = lazy(() => import("./pages/other/Cart"));
const ManageUser = lazy(() => import("./pages/admin/ManageUser"));
const ManageCategory = lazy(() => import("./pages/admin/ManageCategory"));
const ManageProducts = lazy(() => import("./pages/admin/ManageProducts"));
const Checkout = lazy(() => import("./pages/other/Checkout"));
const ManageOrder = lazy(() => import("./pages/admin/ManageOrder"))
const NotFound = lazy(() => import("./pages/other/NotFound"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"))
const Dashboard = lazy(() => import("./pages/admin/Dashboard"))

const App = (props) => {
  useEffect(() => {
    props.dispatch(
      loadLanguages({
        languages: {
          en: require("./translations/english.json"),
          fn: require("./translations/french.json"),
          de: require("./translations/germany.json"),
        },
      })
    );

    const fetchData = async () => {
      const response1 = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/products/"
      );
      const response2 = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/reviews/"
      )
      const products = await response1.json();
      const reviews = await response2.json();
      props.dispatch(fetchProducts(products));
      props.dispatch(fetchReviews(reviews));
    };

    fetchData();
  });

  return (
    <ToastProvider placement="bottom-left">
      <BreadcrumbsProvider>
        <Router>
          <Suspense
            fallback={
              <div className="flone-preloader-wrapper">
                <div className="flone-preloader">
                  <span></span>
                  <span></span>
                </div>
              </div>
            }
          >
            <Switch>
              <Route
                exact
                path={process.env.PUBLIC_URL + "/"}
                component={HomeBookStore}
              />

              {/* Homepages */}

              {/* Shop pages */}
              <Route
                path={process.env.PUBLIC_URL + "/shop-grid-standard"}
                component={ShopGridStandard}
              />
              <Route
                path={process.env.PUBLIC_URL + "/product-tab-left/:id"}
                component={ProductTabLeft}
              />

              {/* Other pages */}
              <Route
                path={process.env.PUBLIC_URL + "/login-register"}
                component={LoginRegister}
              />
              <Route
                path={process.env.PUBLIC_URL + "/my-account"}
                component={MyAccount}
              />

              <Route
                path={process.env.PUBLIC_URL + "/about"}
                component={About}
              />
              <Route
                path={process.env.PUBLIC_URL + "/contact"}
                component={Contact}
              />
              <Route path={process.env.PUBLIC_URL + "/cart"} component={Cart} />
              <Route
                path={process.env.PUBLIC_URL + "/admin/dashboard"}
                component={Dashboard}
              />
              <Route
                path={process.env.PUBLIC_URL + "/admin/users"}
                component={ManageUser}
              />
              <Route
                path={process.env.PUBLIC_URL + "/admin/categories"}
                component={ManageCategory}
              />
              <Route
                path={process.env.PUBLIC_URL + "/admin/products"}
                component={ManageProducts}
              />
              <Route
                path={process.env.PUBLIC_URL + "/checkout"}
                component={Checkout}
              />
              <Route
                path={process.env.PUBLIC_URL + "/admin/orders"}
                component={ManageOrder}
              />
              <Route
                path={process.env.PUBLIC_URL + "/wishlist"}
                component={Wishlist}
              />
              <Route exact component={NotFound} />
            </Switch>
          </Suspense>
        </Router>
      </BreadcrumbsProvider>
    </ToastProvider>
  );
};

App.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(multilanguage(App));

