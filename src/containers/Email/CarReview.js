
import { Body, Container, Column, Head, Heading, Html, Preview, Row, Section, Text, } from "@react-email/components";
import { APP_FOLLOW_STATUS_DONE, APP_FOLLOW_STATUS_WAITING } from "configs/constant";
import HeaderEmail from "./HeaderEmail";
import ESig from "./ESig";
import { formatDateDayjs } from "utils/textUtils";
import { CAR_WORK_TYPE } from "configs/localData";
import { arrayNotEmpty, formatMoney } from "utils/dataUtils";
import UserService from "services/UserService";
import * as React from 'react';

const nRow = {
  marginBottom: "10px",
  paddingLeft: "8px",
  paddingRight: "8px",
  width: "100%",
};

const nRowMarTop50 = {
  ...nRow,
  marginTop: "50px"
}

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: '700px',
  margin: '0 auto'
};

const h2 = {
  color: "#1d1c1d",
  fontSize: "25px",
  fontWeight: "500",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
  textAlign: "center"
};

const pstyle = {
  padding: "0px",
  margin: "0px"
};

export const CarReview = ({
  management,
  record,
  owrnerInfo
}) => {

  let sigChecked = false, sigConfirm = false;
  if ((record?.status ?? 0) !== 0) {
    sigChecked = record?.status !== APP_FOLLOW_STATUS_WAITING;
    sigConfirm = record?.status === APP_FOLLOW_STATUS_DONE;
  }

  return (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* <HeaderEmail /> */}
          <Heading style={h2}>ĐẶT XE CÔNG TÁC <br /> REGISTRATION FOR RENTAL CAR</Heading>

          <Row style={nRowMarTop50}>
            <Column style={{ width: "50%" }}>
              <Text style={pstyle}>Tên người đề nghị (Applicant Name):</Text>
            </Column>
            <Column style={{ width: "50%" }}>
              <Text style={pstyle}>
                <span>{record?.userCreate ?? owrnerInfo.fullName}</span>
                <span style={{ marginLeft: 30 }}>(Ngày {formatDateDayjs(record.createdAt)})</span>
              </Text>
            </Column>
          </Row>
          <Row style={nRow}>
            <Column style={{ width: "50%" }}>
              <Text style={pstyle}>Bộ phận (Department):</Text>
            </Column>
            <Column style={{ width: "50%" }}>
              <Text style={pstyle}>{owrnerInfo?.userBranch?.department ?? ''}</Text>
            </Column>
          </Row>

          <Section>
            <Text style={{ fontWeight: 'bold' }}>Lịch trình xe / Journey schedule</Text>
          </Section>
          <TableItem
            scheduleBusList={record?.scheduleBusList ?? []}
          />

          <Section>
            <Text>Kính mong Ban lãnh đạo xem xét và chấp thuận.I kindly request the management to review and approve this request.</Text>
          </Section>

          <ESig
            management={management}
            record={record}
            owrnerInfo={owrnerInfo}
            sigChecked={sigChecked}
            sigConfirm={sigConfirm}
          />
        </Container>
      </Body>
    </Html>
  )
};

/*
const TableRender = () => {
  return (
    <table style={tTables}>
      <tbody>
        <tr style={tBorder}>
          <th rowSpan={2} style={tBorder}>Giờ đón /<br/> Pickup time</th>
          <th rowSpan={2} style={tBorder}>Địa điểm đón /<br/> Pick up Location</th>
          <th colSpan={2} style={tBorder}> Thông tin khách <br /> Guest </th>
          <th rowSpan={2} style={tBorder}> Địa điểm đến/ <br /> Destination </th>
          <th rowSpan={2} style={tBorder}> Địa chỉ/ <br /> Address </th>
        </tr>
        <tr style={tBorder}>
          <th style={tBorder}>Tên /Name</th>
          <th style={tBorder}>Công ty/ Company</th>
        </tr>
        <tr style={tBorder}>
          <td style={tBorder}>1.9</td>
          <td style={tBorder}>1.9</td>
          <td style={tBorder}>1.9</td>
          <td style={tBorder}>0.003</td>
          <td style={tBorder}>40%</td>
          <td style={tBorder}>40%</td>
        </tr>
      </tbody>
    </table>
  )
}
*/

const TableItem = ({ scheduleBusList }) => {
  return <>
    <table style={{ width: "100%", border: "1px solid #ddd", borderCollapse: "collapse", padding: 10 }}>
      <tbody>
        <tr style={{ borderBottom: "1px solid #ddd", background: "#3dbeb3", color: "#fff" }} >
          <th style={{ padding: 10, textAlign: "center" }}>STT</th>
          <th style={{ padding: 10, textAlign: "center" }}>Nội dung</th>
          <th style={{ padding: 10, textAlign: "center" }}>Chi phí</th>
        </tr>
        {scheduleBusList?.map((item, id) => (
          <React.Fragment key={id}>
            <tr style={{ borderBottom: "1px solid #cccccc8c" }}>
              <td
                rowSpan={2}
                style={{ borderRight: "1px solid #ccc", padding: 10, textAlign: "center" }}
              >
                {id + 1}
              </td>
              <td style={{ padding: 10, textAlign: "left" }}>
                <strong>Ngày / Date: {formatDateDayjs(item.pickupTime)}</strong>
              </td>
              <td style={{ padding: 10, textAlign: "center" }} />
            </tr>
            <tr style={{ borderBottom: "1px solid #cccccc8c" }}>
              <td style={{ padding: 10, textAlign: "left", width: '70%' }}>
                <div>Đối tác cung cấp dịch vụ: {item.supplier}</div>
                <div>Loại xe/ Car type: {item.typeCar}</div>

                <div>
                  <strong>Địa điểm đón/ Pick up Location:</strong>
                  {arrayNotEmpty(item.listPickup) &&
                    item.listPickup.map((pickup, key) =>
                      <div style={pstyle} key={key}>
                        - Ngày {formatDateDayjs(pickup.pickupTime, "DD-MM-YYYY HH:mm")}, Địa điểm đón: {pickup.address}
                      </div>
                    )}
                </div>

                <div>
                  <strong>Địa điểm đến/ Destination:</strong>
                  {arrayNotEmpty(item.listDestinations) &&
                    item.listDestinations.map((dest, key) =>
                      <div style={pstyle} key={key}>
                        - Ngày {formatDateDayjs(dest.pickupTime, "DD-MM-YYYY HH:mm")}, Địa điểm đến: {dest.address}
                      </div>
                    )}
                </div>

                <div>Địa chỉ/ Address: {item.address}</div>
                <div>Hình thức / Type: {item.status === CAR_WORK_TYPE ? 'Đi công tác' : 'Không công tác'}</div>

                {item.nameGuest &&
                  <div>
                    Khách hàng/ Guest: {item.nameGuest}
                    {item.companyGuest ? (' - ' + item.companyGuest) : ''}
                  </div>
                }

                {arrayNotEmpty(item.userId) &&
                  <div>
                    Nhân viên/ Employe: {item.userId.map((id) => UserService.fetchNameById(id)).join(", ")}
                  </div>
                }
              </td>
              <td style={{ textAlign: "center" }}>
                <div>{formatMoney(item.price)}</div>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>

    <table style={{ width: "100%" }}>
      <tbody>
        <tr>
          <td valign="top" width="100%" style={{ padding: "16px 0" }}>
            <table border={0} width="100%" style={{ textAlign: "right" }}>
              <tbody>
                <tr id="vorh">
                  <td align="right" width="70%" style={{ padding: "12px 12px 0" }}>
                    <strong>Tổng thanh toán / Total Paid:</strong>
                  </td>
                  <td className="total" width="30%" style={{ padding: "12px 12px 0" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, ...pstyle }}>
                      {formatMoney(scheduleBusList?.map(item => item.price).reduce((sum, num) => sum + num, 0))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </>
}


export default CarReview;