import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, Dimensions } from 'react-native';
import axios from 'axios'
import * as Font from 'expo-font'
import {
  Container, Header, Title, Content, Footer,
  FooterTab, Button, Left, Right, Body, Icon, Text,
  Accordion, Card, CardItem, Thumbnail, ListItem,
  CheckBox, DatePicker, DeckSwiper, View, Fab,
  Badge, Form, Item, Input, Label, Picker, Textarea,
  Switch, Radio, Spinner, Tab, Tabs, TabHeading,
  ScrollableTab, H1, H2, H3, Drawer,
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import ForexListItem from './forexItem'
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'

export default function App() {
  const [loadfont, setloadfont] = useState(true)
  const [data, setdata] = useState(null)
  const [cad, setcad] = useState(1000)
  const [show_amount, setshow_amount] = useState(false)
  const [input_currency, setinput_currency] = useState('CAD')
  const [input_amount, setinput_amount] = useState(1000)
  const [btc_rate, setbtc_rate] = useState(null)
  const [x, setx] = useState([])
  const [y, sety] = useState([])
  const [show_chart, setshow_chart] = useState(false)

  useEffect(() => {
    initializeApp()
  }, [])

  initializeApp = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    setloadfont(false)

    fetch_latest()
  }

  fetch_latest = () => {
    axios({
      method: 'get',
      url: 'https://api.exchangeratesapi.io/latest?base=CAD',
    })
      .then(response => {
        setdata(response.data.rates)
        fetch_btc(response.data.rates.USD)
      })
      .catch(function (error) {
        alert(error);
        setTimeout(() => {
          fetch_latest()
        }, 5000);
      });
  }

  fetch_btc = (CADUSD) => {
    axios({
      method: 'get',
      url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
    })
      .then(response => {
        const rate = CADUSD / parseFloat(response.data.bpi.USD.rate.replace(',', ''))
        setbtc_rate(rate)
      })
      .catch(function (error) {
        alert(error);
        setTimeout(() => {
          fetch_btc(CADUSD)
        }, 5000);
      });
  }

  forex_button_press = (value, currency) => {
    setshow_amount(true)
    setinput_amount(value)
    setinput_currency(currency)
  }

  exchange_button_press = () => {
    setshow_amount(false)
    input_currency === 'BTC' ?
      setcad(input_amount / btc_rate)
      : setcad(input_amount / data[input_currency])
  }

  load_history = (a, b) => {
    const d = new Date()
    const end = d.toISOString().split('T')[0]
    d.setDate(-30)
    const start = d.toISOString().split('T')[0]

    const url = 'https://api.exchangeratesapi.io/history?start_at=' + start
      + '&end_at=' + end + '&symbols=' + b + '&base=' + a

    axios({
      method: 'get',
      url: url,
    })
      .then(response => {
        const history = JSON.stringify(response.data.rates)
        const history_clean = history.replace(/{/g, '').replace(/}/g, '')
          .replace(/"/g, '').replace(/:/g, '').split(',')

        let date = [], rate = []
        history_clean.sort().map(item => {
          const item_split = item.split(b)
          date.push(item_split[0])
          rate.push(parseFloat(item_split[1]))
        })

        setx(date)
        sety(rate)
        setshow_chart(true)
      })
      .catch(function (error) {
        alert(error);
      });
  }


  if (loadfont || !data) {
    return (<Container style={{ backgroundColor: '#1C2833' }}>
      <Content><Spinner /></Content></Container>)
  }

  return (
    <Container style={{ backgroundColor: '#1C2833', marginTop: 25 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={show_amount}
      >
        <Content>

          <Item style={{ backgroundColor: 'white' }}>
            <Input
              style={{ height: 100, fontSize: 30 }}
              keyboardType="number-pad"
              value={input_amount}
              onChangeText={e => setinput_amount(e ? e.match(/^([0-9]+(\.[0-9]+)?)/g)[0] : '1')}
              onSubmitEditing={() => exchange_button_press()} />
            <Text style={{ fontSize: 30 }}>{input_currency}</Text>
            <Button large transparent onPress={() => exchange_button_press()}>
              <Icon active name='swap' style={{ fontSize: 50 }} />
            </Button>
            <Button large transparent onPress={() => setshow_amount(false)}>
              <Icon active name='close' style={{ fontSize: 50 }} />
            </Button>
          </Item>
        </Content>
      </Modal>

      <Modal
        animationType="fade"
        transparent={false}
        visible={show_chart}
      >
        <Container style={{ backgroundColor: '#1C2833' }}>
          <Header >
            <Left>
              <Button transparent onPress={() => setshow_chart(false)}>
                <Ionicons name='ios-arrow-round-back' size={40} color="white"></Ionicons>
              </Button>
            </Left>
            <Body style={{ alignItems: 'center' }}>
              <Title>Last 30 Day Rate</Title>
            </Body>
            <Right>
            </Right>
          </Header>

          <LineChart
            data={{
              labels: [x[0]],
              datasets: [{
                data: y
              }]
            }}
            width={Dimensions.get('window').width} // from react-native
            height={300}
            chartConfig={{
              backgroundColor: 'blue',
              backgroundGradientFrom: 'green',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 3, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, 0.7)`,

            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </Container>
      </Modal>

      <Content>
        <ScrollView>
          <Grid>
            <Col style={{ alignItems: 'center' }}>
              <Row style={{ height: 50 }}>
                <ForexListItem currency='CAD' rate={data.CAD} CAD={cad}
                  flagPath={require('./assets/flags/Canada.png')}
                  buttonPress={(value) => forex_button_press(value, 'CAD')}
                  buttonLongPress={() => { }}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='CNY' rate={data.CNY} CAD={cad}
                  flagPath={require('./assets/flags/China.png')}
                  buttonPress={(value) => forex_button_press(value, 'CNY')}
                  buttonLongPress={() => load_history('CAD', 'CNY')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='AUD' rate={data.AUD} CAD={cad}
                  flagPath={require('./assets/flags/Australia.png')}
                  buttonPress={(value) => forex_button_press(value, 'AUD')}
                  buttonLongPress={() => load_history('CAD', 'AUD')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='HKD' rate={data.HKD} CAD={cad}
                  flagPath={require('./assets/flags/HongKong.png')}
                  buttonPress={(value) => forex_button_press(value, 'HKD')}
                  buttonLongPress={() => load_history('CAD', 'HKD')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='ISK' rate={data.ISK} CAD={cad}
                  flagPath={require('./assets/flags/Iceland.png')}
                  buttonPress={(value) => forex_button_press(value, 'ISK')}
                  buttonLongPress={() => load_history('CAD', 'ISK')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='HUF' rate={data.HUF} CAD={cad}
                  flagPath={require('./assets/flags/Hungary.png')}
                  buttonPress={(value) => forex_button_press(value, 'HUF')}
                  buttonLongPress={() => load_history('CAD', 'HUF')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='SEK' rate={data.SEK} CAD={cad}
                  flagPath={require('./assets/flags/Sweden.png')}
                  buttonPress={(value) => forex_button_press(value, 'SEK')}
                  buttonLongPress={() => load_history('CAD', 'SEK')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='BRL' rate={data.BRL} CAD={cad}
                  flagPath={require('./assets/flags/Brazil.png')}
                  buttonPress={(value) => forex_button_press(value, 'BRL')}
                  buttonLongPress={() => load_history('CAD', 'BRL')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='MYR' rate={data.MYR} CAD={cad}
                  flagPath={require('./assets/flags/Malaysia.png')}
                  buttonPress={(value) => forex_button_press(value, 'MYR')}
                  buttonLongPress={() => load_history('CAD', 'MYR')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='NOK' rate={data.NOK} CAD={cad}
                  flagPath={require('./assets/flags/Norway.png')}
                  buttonPress={(value) => forex_button_press(value, 'NOK')}
                  buttonLongPress={() => load_history('CAD', 'NOK')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='MXN' rate={data.MXN} CAD={cad}
                  flagPath={require('./assets/flags/Mexico.png')}
                  buttonPress={(value) => forex_button_press(value, 'MXN')}
                  buttonLongPress={() => load_history('CAD', 'MXN')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='PLN' rate={data.PLN} CAD={cad}
                  flagPath={require('./assets/flags/Poland.png')}
                  buttonPress={(value) => forex_button_press(value, 'PLN')}
                  buttonLongPress={() => load_history('CAD', 'PLN')}
                ></ForexListItem>
              </Row>
            </Col>
            <Col>
              <Row style={{ height: 50 }}>
                <ForexListItem currency='USD' rate={data.USD} CAD={cad}
                  flagPath={require('./assets/flags/USA.png')}
                  buttonPress={(value) => forex_button_press(value, 'USD')}
                  buttonLongPress={() => load_history('CAD', 'USD')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='EUR' rate={data.EUR} CAD={cad}
                  flagPath={require('./assets/flags/EU.png')}
                  buttonPress={(value) => forex_button_press(value, 'EUR')}
                  buttonLongPress={() => load_history('CAD', 'EUR')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='GBP' rate={data.GBP} CAD={cad}
                  flagPath={require('./assets/flags/England.png')}
                  buttonPress={(value) => forex_button_press(value, 'GBP')}
                  buttonLongPress={() => load_history('CAD', 'GBP')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='CHF' rate={data.CHF} CAD={cad}
                  flagPath={require('./assets/flags/Switzerland.png')}
                  buttonPress={(value) => forex_button_press(value, 'CHF')}
                  buttonLongPress={() => load_history('CAD', 'CHF')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='PHP' rate={data.PHP} CAD={cad}
                  flagPath={require('./assets/flags/Philippines.png')}
                  buttonPress={(value) => forex_button_press(value, 'PHP')}
                  buttonLongPress={() => load_history('CAD', 'PHP')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='CZK' rate={data.CZK} CAD={cad}
                  flagPath={require('./assets/flags/Czech.png')}
                  buttonPress={(value) => forex_button_press(value, 'CZK')}
                  buttonLongPress={() => load_history('CAD', 'CZK')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='IDR' rate={data.IDR} CAD={cad}
                  flagPath={require('./assets/flags/Indonesia.png')}
                  buttonPress={(value) => forex_button_press(value, 'IDR')}
                  buttonLongPress={() => load_history('CAD', 'IDR')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='HRK' rate={data.HRK} CAD={cad}
                  flagPath={require('./assets/flags/Croatia.png')}
                  buttonPress={(value) => forex_button_press(value, 'HRK')}
                  buttonLongPress={() => load_history('CAD', 'HRK')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='BGN' rate={data.BGN} CAD={cad}
                  flagPath={require('./assets/flags/Bulgaria.png')}
                  buttonPress={(value) => forex_button_press(value, 'BGN')}
                  buttonLongPress={() => load_history('CAD', 'BGN')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='NZD' rate={data.NZD} CAD={cad}
                  flagPath={require('./assets/flags/NewZealand.png')}
                  buttonPress={(value) => forex_button_press(value, 'NZD')}
                  buttonLongPress={() => load_history('CAD', 'NZD')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='SGD' rate={data.SGD} CAD={cad}
                  flagPath={require('./assets/flags/Singapore.png')}
                  buttonPress={(value) => forex_button_press(value, 'SGD')}
                  buttonLongPress={() => load_history('CAD', 'SGD')}
                ></ForexListItem>
              </Row>
            </Col>
            <Col>
              <Row style={{ height: 50 }}>
                {btc_rate ?
                  <ForexListItem currency='BTC' rate={btc_rate} CAD={cad}
                    flagPath={require('./assets/flags/BTC.png')}
                    buttonPress={(value) => forex_button_press(value, 'BTC')}
                    buttonLongPress={() => { }}
                  ></ForexListItem> : <Spinner />
                }
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='JPY' rate={data.JPY} CAD={cad}
                  flagPath={require('./assets/flags/Japan.png')}
                  buttonPress={(value) => forex_button_press(value, 'JPY')}
                  buttonLongPress={() => load_history('CAD', 'JPY')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='RUB' rate={data.RUB} CAD={cad}
                  flagPath={require('./assets/flags/Russia.png')}
                  buttonPress={(value) => forex_button_press(value, 'RUB')}
                  buttonLongPress={() => load_history('CAD', 'RUB')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='KRW' rate={data.KRW} CAD={cad}
                  flagPath={require('./assets/flags/SouthKorea.png')}
                  buttonPress={(value) => forex_button_press(value, 'KRW')}
                  buttonLongPress={() => load_history('CAD', 'KRW')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='DKK' rate={data.DKK} CAD={cad}
                  flagPath={require('./assets/flags/Denmark.png')}
                  buttonPress={(value) => forex_button_press(value, 'DKK')}
                  buttonLongPress={() => load_history('CAD', 'DKK')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='RON' rate={data.RON} CAD={cad}
                  flagPath={require('./assets/flags/Romania.png')}
                  buttonPress={(value) => forex_button_press(value, 'RON')}
                  buttonLongPress={() => load_history('CAD', 'RON')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='INR' rate={data.INR} CAD={cad}
                  flagPath={require('./assets/flags/India.png')}
                  buttonPress={(value) => forex_button_press(value, 'INR')}
                  buttonLongPress={() => load_history('CAD', 'INR')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='THB' rate={data.THB} CAD={cad}
                  flagPath={require('./assets/flags/Thailand.png')}
                  buttonPress={(value) => forex_button_press(value, 'THB')}
                  buttonLongPress={() => load_history('CAD', 'THB')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='TRY' rate={data.TRY} CAD={cad}
                  flagPath={require('./assets/flags/Turkey.png')}
                  buttonPress={(value) => forex_button_press(value, 'TRY')}
                  buttonLongPress={() => load_history('CAD', 'TRY')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='ZAR' rate={data.ZAR} CAD={cad}
                  flagPath={require('./assets/flags/SouthAfrica.png')}
                  buttonPress={(value) => forex_button_press(value, 'ZAR')}
                  buttonLongPress={() => load_history('CAD', 'ZAR')}
                ></ForexListItem>
              </Row>

              <Row style={{ height: 50 }}>
                <ForexListItem currency='ILS' rate={data.ILS} CAD={cad}
                  flagPath={require('./assets/flags/Israel.png')}
                  buttonPress={(value) => forex_button_press(value, 'ILS')}
                  buttonLongPress={() => load_history('CAD', 'ILS')}
                ></ForexListItem>
              </Row>
            </Col>
          </Grid>
        </ScrollView>
      </Content>
    </Container>
  );
}


