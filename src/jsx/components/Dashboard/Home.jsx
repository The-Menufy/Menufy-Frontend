import React, { useState } from "react";
import { Link } from "react-router-dom";
import pMinDelay from "p-min-delay";
import loadable from "@loadable/component";
import { Dropdown, Nav, Tab } from "react-bootstrap";
import ChartDonught2 from "../Sego/Home/donught2";
import ChartDonught3 from "../Sego/Home/donught3";
import ActivityLineChart from "../Sego/Home/ActivityLineChart";
import TimeLineChart from "../Sego/Home/TimeLineChart";
import TimeLineChart2 from "../Sego/Home/TimeLineChart2";
import TimeLineChart3 from "../Sego/Home/TimeLineChart3";
import menu9 from "../../../assets/images/menus/9.png";
import menu10 from "../../../assets/images/menus/10.png";
import menu11 from "../../../assets/images/menus/11.png";
import menu12 from "../../../assets/images/menus/12.png";
import { useTranslation } from "react-i18next";

const BarChart = loadable(() =>
  pMinDelay(import("../Sego/Home/BarChart"), 1000)
);
const RadialBarChart = loadable(() =>
  pMinDelay(import("../Sego/Home/RadialBarChart"), 1000)
);

function Home() {
  const { t } = useTranslation();
  const [session, setSession] = useState(t("session_month"));

  return (
    <>
      <div className="row">
        {/* Stats cards */}
        <div className="col-xl-3 col-xxl-6 col-sm-6">
          <div className="card grd-card">
            <div className="card-body">
              <div className="media align-items-center">
                <div className="media-body me-2">
                  <h2 className="text-white font-w600">459</h2>
                  <span className="text-white">{t("total_menus")}</span>
                </div>
                <div className="d-inline-block position-relative donut-chart-sale">
                  <ChartDonught3
                    backgroundColor="#FFFFFF"
                    backgroundColor2="#F6B4AF"
                    height="100"
                    width="100"
                    value="75"
                  />
                  <span className="circle bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-6 col-sm-6">
          <div className="card grd-card">
            <div className="card-body">
              <div className="media align-items-center">
                <div className="media-body me-2">
                  <h2 className="text-white font-w600">$ 87,561</h2>
                  <span className="text-white">{t("total_revenue")}</span>
                </div>
                <div className="d-inline-block position-relative donut-chart-sale">
                  <ChartDonught3
                    backgroundColor="#FFFFFF"
                    backgroundColor2="#F6B4AF"
                    height="100"
                    width="100"
                    value="40"
                  />
                  <span className="circle bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-6 col-sm-6">
          <div className="card grd-card">
            <div className="card-body">
              <div className="media align-items-center">
                <div className="media-body me-2">
                  <h2 className="text-white font-w600">247</h2>
                  <span className="text-white">{t("total_orders")}</span>
                </div>
                <div className="d-inline-block position-relative donut-chart-sale">
                  <ChartDonught3
                    backgroundColor="#FFFFFF"
                    backgroundColor2="#F6B4AF"
                    height="100"
                    width="100"
                    value="50"
                  />
                  <span className="circle bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-6 col-sm-6">
          <div className="card grd-card">
            <div className="card-body">
              <div className="media align-items-center">
                <div className="media-body me-2">
                  <h2 className="text-white font-w600">872</h2>
                  <span className="text-white">{t("total_customers")}</span>
                </div>
                <div className="d-inline-block position-relative donut-chart-sale">
                  <ChartDonught3
                    backgroundColor="#FFFFFF"
                    backgroundColor2="#F6B4AF"
                    height="100"
                    width="100"
                    value="90"
                  />
                  <span className="circle bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Orders Summary */}
        <div className="col-xl-6">
          <div className="card">
            <Tab.Container defaultActiveKey="monthly">
              <div className="card-header d-sm-flex flex-wrap d-block pb-0 border-0">
                <div className="me-auto pe-3">
                  <h4 className="text-black fs-20">{t("orders_summary")}</h4>
                  <p className="fs-13 mb-0 text-black">
                    {t("orders_summary_desc")}
                  </p>
                </div>
                <div className="card-action card-tabs mt-3 mt-sm-0 mt-3 mb-sm-0 mb-3 mt-sm-0">
                  <Nav as="ul" className="nav nav-tabs" role="tablist">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        className="nav-link"
                        eventKey="monthly"
                        role="tab"
                      >
                        {t("monthly")}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        className="nav-link"
                        eventKey="weekly"
                        role="tab"
                      >
                        {t("weekly")}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        className="nav-link"
                        eventKey="today"
                        role="tab"
                      >
                        {t("today")}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              <div className="card-body">
                <Tab.Content className="tab-content">
                  <Tab.Pane
                    eventKey="monthly"
                    className="tab-pane fade"
                    id="Monthly"
                  >
                    <div className="row align-items-center">
                      <div className="col-sm-6">
                        <RadialBarChart series={85} />
                      </div>
                      <div className="col-sm-6 mb-sm-0 mb-3 text-center">
                        <h3 className="fs-28 text-black font-w600">
                          $456,005.56
                        </h3>
                        <span className="mb-3 d-block">
                          {t("from_amount", { amount: "$500,000.00" })}
                        </span>
                        <p className="fs-14">{t("orders_summary_detail")}</p>
                        <Link
                          to="post-details"
                          className="btn btn-primary light btn-rounded"
                        >
                          {t("more_details")}
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            25
                          </h3>
                          <span className="fs-18 text-primary">
                            {t("on_delivery")}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            60
                          </h3>
                          <span className="fs-18 text-primary">
                            {t("delivered")}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">7</h3>
                          <span className="fs-18 text-primary">
                            {t("canceled")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="weekly"
                    className="tab-pane fade"
                    id="Weekly"
                  >
                    <div className="row align-items-center">
                      <div className="col-sm-6">
                        <RadialBarChart series={40} />
                      </div>
                      <div className="col-sm-6 mb-sm-0 mb-3 text-center">
                        <h3 className="fs-28 text-black font-w600">
                          $150,002.00
                        </h3>
                        <span className="mb-3 d-block">
                          {t("from_amount", { amount: "$400,000.00" })}
                        </span>
                        <p className="fs-14">{t("orders_summary_detail")}</p>
                        <Link
                          to="post-details"
                          className="btn btn-primary light btn-rounded"
                        >
                          {t("more_details")}
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            30
                          </h3>
                          <span className="fs-18 text-primary">
                            {t("on_delivery")}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            55
                          </h3>
                          <span className="fs-18 text-primary">
                            {t("delivered")}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">9</h3>
                          <span className="fs-18 text-primary">
                            {t("canceled")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane
                    eventKey="today"
                    className="tab-pane fade"
                    id="Today"
                  >
                    <div className="row align-items-center">
                      <div className="col-sm-6">
                        <RadialBarChart series={55} />
                      </div>
                      <div className="col-sm-6 mb-sm-0 mb-3 text-center">
                        <h3 className="fs-28 text-black font-w600">
                          $856,005.56
                        </h3>
                        <span className="mb-3 d-block">
                          {t("from_amount", { amount: "$800,000.00" })}
                        </span>
                        <p className="fs-14">{t("orders_summary_detail")}</p>
                        <Link
                          to="post-details"
                          className="btn btn-primary light btn-rounded"
                        >
                          {t("more_details")}
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            45
                          </h3>
                          <span className="fs-18 text-primary">
                            {t("on_delivery")}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            90
                          </h3>
                          <span className="fs-18 text-primary">
                            {t("delivered")}
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">3</h3>
                          <span className="fs-18 text-primary">
                            {t("canceled")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </div>
        {/* Revenue Section */}
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header d-sm-flex d-block pb-0 border-0">
              <div className="me-auto pe-3">
                <h4 className="text-black fs-20">{t("revenue")}</h4>
                <p className="fs-13 mb-0 text-black">{t("revenue_desc")}</p>
              </div>
              <Dropdown className="dropdown mt-sm-0 mt-3">
                <Dropdown.Toggle
                  type="button"
                  className="btn btn-primary light dropdown-toggle"
                >
                  {session}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="dropdown-menu dropdown-menu-right"
                  align="end"
                >
                  <Dropdown.Item onClick={() => setSession(t("session_month"))}>
                    {t("month")}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSession(t("session_day"))}>
                    {t("day")}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSession(t("session_week"))}>
                    {t("week")}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSession(t("session_year"))}>
                    {t("year")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body" id="user-activity">
              <Tab.Container defaultActiveKey="all-food">
                <div className="d-flex flex-wrap mb-4">
                  <div className="me-auto mb-2 pe-3 d-flex align-items-center">
                    <div className="ms-3">
                      <p className="fs-12 mb-1">{t("income")}</p>
                      <span className="fs-22 text-black font-w600">
                        $126,000
                      </span>
                    </div>
                  </div>
                  <div className="card-action revenue-tabs">
                    <Nav as="ul" className="nav nav-tabs" role="tablist">
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link
                          className="nav-link"
                          data-toggle="tab"
                          eventKey="all-food"
                          role="tab"
                        >
                          {t("all_food")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link
                          className="nav-link"
                          data-toggle="tab"
                          eventKey="food"
                          role="tab"
                        >
                          {t("food")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link
                          className="nav-link"
                          data-toggle="tab"
                          eventKey="beverages"
                          role="tab"
                        >
                          {t("beverages")}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                </div>
                <Tab.Content className="tab-content" id="myTabContent">
                  <Tab.Pane className="tab-pane fade" eventKey="all-food">
                    <ActivityLineChart dataActive={0} />
                  </Tab.Pane>
                  <Tab.Pane className="tab-pane fade" eventKey="food">
                    <ActivityLineChart dataActive={1} />
                  </Tab.Pane>
                  <Tab.Pane className="tab-pane fade" eventKey="beverages">
                    <ActivityLineChart dataActive={2} />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
        </div>
        {/* Customer Map */}
        <div className="col-xl-9 col-xxl-8">
          <div className="row">
            <div className="col-xl-12">
              <div className="card">
                <Tab.Container defaultActiveKey="monthly">
                  <div className="card-header d-sm-flex d-block pb-0 border-0">
                    <div className="me-auto pe-3">
                      <h4 className="text-black fs-20">{t("customer_map")}</h4>
                      <p className="fs-13 mb-0 text-black">
                        {t("customer_map_desc")}
                      </p>
                    </div>
                    <div className="card-action card-tabs mt-3 mt-sm-0 mt-3 mb-sm-0 mb-3 mt-sm-0">
                      <Nav as="ul" className="nav nav-tabs" role="tablist">
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link
                            className="nav-link"
                            eventKey="monthly"
                            role="tab"
                          >
                            {t("monthly")}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link
                            className="nav-link"
                            eventKey="weekly"
                            role="tab"
                          >
                            {t("weekly")}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-item">
                          <Nav.Link
                            className="nav-link"
                            eventKey="today"
                            role="tab"
                          >
                            {t("today")}
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </div>
                  <div className="card-body pb-0">
                    <Tab.Content className="tab-content" id="myTabContent">
                      <Tab.Pane
                        className="tab-pane fade"
                        eventKey="monthly"
                        id="tab1"
                      >
                        <TimeLineChart />
                      </Tab.Pane>
                      <Tab.Pane
                        className="tab-pane fade"
                        eventKey="weekly"
                        id="tab2"
                      >
                        <TimeLineChart2 />
                      </Tab.Pane>
                      <Tab.Pane
                        className="tab-pane fade"
                        eventKey="today"
                        id="tab3"
                      >
                        <TimeLineChart3 />
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                </Tab.Container>
              </div>
            </div>
            {/* Transactions Summary */}
            <div className="col-xl-8 col-xxl-12 col-lg-8">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h4 className="text-black fs-20 mb-0">
                    {t("transactions_summary")}
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6 mb-sm-0 mb-3">
                      <div className="media align-items-center">
                        <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                          <ChartDonught2
                            backgroundColor="#53CB50"
                            backgroundColor2="#FAFAFA"
                            height="100"
                            width="100"
                            value="75"
                          />
                          <small className="text-black">86%</small>
                        </div>
                        <div>
                          <h4 className="fs-28 font-w600 text-black mb-0">
                            585
                          </h4>
                          <span>{t("succesfull_order")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="media align-items-center">
                        <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                          <ChartDonught2
                            backgroundColor="#FD376F"
                            backgroundColor2="#FAFAFA"
                            height="100"
                            width="100"
                            value="40"
                          />
                          <small className="text-black">14%</small>
                        </div>
                        <div>
                          <h4 className="fs-28 font-w600 text-black mb-0">
                            165
                          </h4>
                          <span>{t("unsuccesfull_order")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Average */}
            <div className="col-xl-4 col-xxl-12 col-lg-4">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h4 className="text-black fs-20 mb-0">{t("average")}</h4>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-end" id="BarChart">
                    <div>
                      <h4 className="fs-28 font-w600 text-black mb-0">
                        87,456
                      </h4>
                      <span>{t("order")}</span>
                    </div>
                    <BarChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Daily Trending Menus */}
        <div className="col-xl-3 col-xxl-4">
          <div className="row">
            <div className="col-xl-12">
              <div className="card trending-menus">
                <div className="card-header d-sm-flex d-block pb-0 border-0">
                  <div>
                    <h4 className="text-black fs-20">
                      {t("daily_trending_menus")}
                    </h4>
                    <p className="fs-13 mb-0 text-black">
                      {t("daily_trending_menus_desc")}
                    </p>
                  </div>
                </div>
                <div className="card-body">
                  {[1, 2, 3, 4, 5].map((num, idx) => {
                    const menus = [
                      { title: t("trending_menu_1"), img: menu9 },
                      { title: t("trending_menu_2"), img: menu10 },
                      { title: t("trending_menu_3"), img: menu11 },
                      { title: t("trending_menu_4"), img: menu12 },
                      { title: t("trending_menu_5"), img: menu9 },
                    ];
                    return (
                      <div
                        className={
                          "d-flex pb-3 mb-3 border-bottom tr-row align-items-center" +
                          (num === 5 ? "" : "")
                        }
                        key={num}
                      >
                        <span className="num">#{num}</span>
                        <div className="me-auto pe-3">
                          <Link to="post-details">
                            <h2 className="text-black fs-14">
                              {menus[idx].title}
                            </h2>
                          </Link>
                          <span className="text-black font-w600 d-inline-block me-3">
                            $5.6{" "}
                          </span>
                          <span className="fs-14">
                            {t("order_x", { count: 89 })}
                          </span>
                        </div>
                        <img
                          src={menus[idx].img}
                          alt={`menu${num}`}
                          width={60}
                          className="rounded"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
