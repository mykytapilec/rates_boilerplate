import React, { Component } from 'react'
import ApexChart from 'react-apexcharts'
import moment from 'moment'
import { StyledContainer } from './style'
import { Dropdown, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'


type RatesSate = {
  chartSeries: object,
  dateTo: string,
  dateFrom: string,
  curValue: string,
  phrase: string
}

class Rates extends Component<{}, RatesSate> {

  state = {
    chartSeries: [{
      name: "Rate",
      data: [],
    }],
    dateTo: moment().format('YYYY-MM-DD'),
    dateFrom: moment().subtract(6,'d').format('YYYY-MM-DD'),
    curValue: '145',
    phrase: 'BLR & USD'
  }

  componentDidMount(){
    this.request(this.state.curValue)
  }

  request = currency => {
    const url = `https://www.nbrb.by/API/ExRates/Rates/Dynamics/${currency}?startDate=${this.state.dateFrom}&endDate=${this.state.dateTo}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          chartSeries: [{
            name: "Rate",
            data: data.map(item => item.Cur_OfficialRate)
          }]
        })
      })
  }

  menu = (
    <Menu>
      <Menu.Item>
        <div onClick={() => {
          this.setState({
            curValue: '145',
            phrase: 'BLR & USD'
          })
          this.request('145')
        }}>USD</div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => {
          this.setState({
            curValue: '292',
            phrase: 'BLR & EUR'
          })
          this.request('292')
        }}>EUR</div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => {
          this.setState({
            curValue: '298',
            phrase: 'BLR & RUB'
          })
          this.request('298')
        }}>RUB</div>
      </Menu.Item>
    </Menu>
  )

  chartOptions = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        this.state.dateFrom,
        moment(this.state.dateFrom).add(1, 'days').format('YYYY-MM-DD'),
        moment(this.state.dateFrom).add(2, 'days').format('YYYY-MM-DD'),
        moment(this.state.dateFrom).add(3, 'days').format('YYYY-MM-DD'),
        moment(this.state.dateFrom).add(4, 'days').format('YYYY-MM-DD'),
        moment(this.state.dateFrom).add(5, 'days').format('YYYY-MM-DD'),
        this.state.dateTo,
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
  }


  render(){
    return (
      <StyledContainer>
        <h1 style={{
          color: 'blue',
          fontSize: 20  
        }}>{this.state.phrase}</h1>
        
        <ApexChart
          options={this.chartOptions}
          series={this.state.chartSeries}
          type={'area'}
          width={1000}
          height={500}
        />

        <Dropdown overlay={this.menu}>
          <a onClick={e => e.preventDefault()}>
            SELECT CURRENCY <DownOutlined />
          </a>
        </Dropdown>
      </StyledContainer>
    )
  }
}


export default Rates