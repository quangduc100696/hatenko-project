
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import { Form, Card, Typography, Row, Col, Table } from 'antd';
import DashboardFilter from './Filter';
import { useEffect, useState } from 'react';
import RequestUtils from 'utils/RequestUtils';
import { dataArray, dataObj, dateFormatOnSubmit, formatMoney } from 'utils/dataUtils';
import { DashboardWrapper } from './styles';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { DualAxes } from '@ant-design/plots';
import { Line } from '@ant-design/charts';
import { genNerateChartLeave, genNerateChartOverTime } from './utils';
import UserService from 'services/UserService';
import SummaryCard from 'components/SummaryCard';
import { 
  TagOutlined, 
  HourglassFilled,
  TeamOutlined,
  PaperClipOutlined,
  PhoneOutlined, 
  SubnodeOutlined, 
  ShoppingCartOutlined 
} from '@ant-design/icons';

const { Title } = Typography;
const title = "General report on administrative activities";

const columns = [
  { title: 'Employee', dataIndex: 'name', key: 'name' },
  { title: 'Number of leave', dataIndex: 'v', key: 'v' }
];

const columnsOt = [
  { title: 'Employee', dataIndex: 'name', key: 'name' },
  { title: 'Hours Ot', dataIndex: 'total', key: 'total' }
];

const DashBoard = () => {

  const [ form ] = Form.useForm();
  const [ filter, setFilter ] = useState({
    from: dayjs().startOf('month'),
    to: dayjs().endOf('month')
  });

  const [ users, setUser ] = useState([]);
  const [ data, setData ] = useState({});
  const [ chartDataLeave, setChartLeave ] = useState({});

  const onFinish = values => {
    setFilter(pre => ({...pre, ...values}));
  }

  useEffect(() => {
    UserService.loadAll().then(setUser);
  }, []);

  useEffect(() => {
    const dataFilter = cloneDeep(filter);
    let year = dayjs().get('year');
    if(dataFilter.from) {
      year = dayjs(dataFilter.from).get('year');
    }
    dateFormatOnSubmit(dataFilter, ['from', 'to']);
    (async()=>{
      const [ chartFee, chartPersional, chartLeaveOf, chartOverTime  ] = await Promise.all([
        RequestUtils.Get("/dashboard/chart-price", dataFilter).then(dataArray),
        RequestUtils.Get("/dashboard/chart-personnel").then(dataObj),
        RequestUtils.Get("/dashboard/chart-leave_of", {...dataFilter, year }).then(dataObj),
        RequestUtils.Get("/dashboard/chart-over-time", {...dataFilter, year }).then(dataObj),
      ]);
      const dataInChartLeave = genNerateChartLeave({ data: chartLeaveOf });
      setChartLeave(dataInChartLeave);

      const chartOT = genNerateChartOverTime({ data: chartOverTime });
      const [ dataFee, sumary ] = chartFee;
      setData({ chartFee: { dataFee, sumary }, chartPersional, chartOT });
    })()
  }, [filter]);

  const leaveOfChartConfig = {
    xField: 'time',
    children: [
      {
        data: chartDataLeave?.chart ?? [],
        type: 'interval',
        yField: 'value',
        stack: true,
        percent: false,
        colorField: 'label',
        style: { maxWidth: 80 },
        axis: { y: { title: 'Annual leave chart', style: { titleFill: '#5B8FF9' } } },
        interaction: { elementHighlight: { background: true } }
      },
      {
        data: chartDataLeave?.itemNghiCoLuong ?? [],
        type: 'line',
        yField: 'Paid leave',
        colorField: () => 'Paid leave',
        style: { lineWidth: 2 },
        axis: {
          y: { position: 'right', style: { titleFill: '#5AD8A6' } }
        },
        interaction: {
          tooltip: { crosshairs: false, marker: false }
        }
      }
    ]
  };

  const configLineChartOt = {
    data: data?.chartOT?.chart ?? [],
    xField: 'time',
    yField: 'HoursOT'
  };

  const hoursOT = data?.chartOT?.otUser?.reduce((n, { total }) => n + total, 0) || 0;
  const SUMMARIES = [
    {
      IconCPN: PhoneOutlined,
      title: `Hotel book: ${data?.chartFee?.sumary?.totalHotel ?? 0}`,
      value: formatMoney(data?.chartFee?.dataFee?.priceHotel ?? 0),
      color: '#fff',
      backgroundShape: 'rgb(102, 92, 167)',
    },
    {
      IconCPN: ShoppingCartOutlined,
      title: `Flight book: ${data?.chartFee?.sumary?.totalFlight ?? 0}`,
      value: formatMoney(data?.chartFee?.dataFee?.priceFlight ?? 0),
      color: '#fff',
      backgroundShape: '#3D95F8'
    },
    {
      IconCPN: SubnodeOutlined,
      title: `Bus book: ${data?.chartFee?.sumary?.totalBus ?? 0}`,
      value: formatMoney(data?.chartFee?.dataFee?.priceBus ?? 0),
      color: '#fff',
      backgroundShape: '#3DD598'
    },
    {
      IconCPN: TagOutlined,
      title: `Total overtime: ${hoursOT} Hours`,
      value: `${hoursOT * 60} Minutes`,
      color: '#fff',
      backgroundShape: '#FFC015'
    }
  ];

  return (
    <div className='my__content'>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <DashboardWrapper>
        <CustomBreadcrumb
          data={[{ title: 'Home' }, { title: title }]}
        />
        <Form form={form} onFinish={onFinish}>
          <DashboardFilter />
        </Form>

        <CardTitle title={'Personnel Synthesis'} icon={<TeamOutlined />} />
        <Row gutter={16}>
          <Col span={16}>
            <Card size="small" title="Total number of employees" style={{ width: '100%' }}>
              <ChartPersionalTeam dataDepartment={data?.chartPersional?.byDepartment ?? []}/>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Statistics by position" style={{ width: '100%' }}>
              <ChartPersionalPosition dataLevel={data?.chartPersional?.byLevel ?? []}/>
            </Card>
          </Col>
        </Row>

        <div className="mb-30" style={{marginTop: 35}}>
          <Row gutter={[20, 20]}>
            {SUMMARIES.map((sumary, index) => (
              <Col key={String(index)} xl={6} lg={8} md={12} xs={24}>
                <SummaryCard {...sumary} />
              </Col>
            ))}
          </Row>
        </div>

        <div style={{marginTop: 30}}>
          <Row gutter={16}>
            <Col span={16}>
              <CardTitle title={'Leave statistics chart'} icon={<TeamOutlined />} />
              <div style={{height: 450}}>
                <DualAxes {...leaveOfChartConfig} />
              </div>
            </Col>
            <Col span={8}>
              <Card 
                size="small" 
                title={ <CardTitle title={'List leave by employee'} icon={<PaperClipOutlined />} /> }
                style={{ width: '100%' }}
              >
                <div style={{height: 410, overflow: 'auto'}}>
                  <Table 
                    pagination={false}
                    columns={columns}
                    dataSource={users.map((item) => ({name: item.fullName, v: String(chartDataLeave?.leaves?.find(i => i.userId === item.id)?.value ?? 0).concat(" Days")  }))}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        <div style={{marginTop: 30}}>
          <Row gutter={16}>
            <Col span={16}>
              <CardTitle title={'Overtime chart by month'} icon={<HourglassFilled />} />
              <div style={{height: 450}}>
                <Line {...configLineChartOt} />
              </div>
            </Col>
            <Col span={8}>
              <Card 
                size="small" 
                title={ <CardTitle title={'List OT by employee'} icon={<PaperClipOutlined />} /> }
                style={{ width: '100%' }}
              >
                <div style={{height: 410, overflow: 'auto'}}>
                  <Table 
                    pagination={false}
                    columns={columnsOt}
                    /* eslint-disable-next-line */
                    dataSource={users.map((item) => ({name: item.fullName, total: String(data?.chartOT?.otUser?.find(i => i.userId == item.id)?.total ?? 0).concat("H")  }))}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </DashboardWrapper>
    </div>
  )
}

const CardTitle = ({ icon, title }) => (
  <div className='title'>
    <Title level={3}>
      {icon}
      <span className='text'>{title}</span>
    </Title>
  </div>
)

const ChartPersionalTeam = ({ dataDepartment }) => {
  const length = dataDepartment.length;
  let arr1 = dataDepartment.slice(0, 3);
  let arr2 = length > 3 ? dataDepartment.slice(3) : [];
  return (
    <Row gutter={16}>
      <Col span={5} className='pestional-icon'>
        <img src="/img/all-team-icon.png" alt=''/>
      </Col>
      <Col span={9} className='pestional'>
        {arr1.map( (item, key) => (
          <p key={key} className='pestional-item'>{item.department}: <strong> {item.total} </strong></p>
        ))}
      </Col>
      <Col span={10} className='pestional s-start'>
        {arr2.map( (item, key) => (
          <p key={key} className='pestional-item'>{item.department}: <strong> {item.total} </strong></p>
        ))}
      </Col>
    </Row>
  )
}

const ChartPersionalPosition = ({ dataLevel }) => {
  return (
    <Row gutter={16}>
      <Col span={9} className='pestional-icon'>
        <img src="/img/pestional-position.png" alt=''/>
      </Col>
      <Col span={15} className='pestional'>
        {dataLevel.map( (item, key) => (
          <p key={key} className='pestional-item'>{item.position}: <strong> {item.total} </strong></p>
        ))}
      </Col>
    </Row>
  )
}

export default DashBoard;