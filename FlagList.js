import React, { useState } from 'react';
import {
    Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text,
    Accordion, Card, CardItem, Thumbnail, ListItem,
    CheckBox, DatePicker, DeckSwiper, View, Fab,
    Badge, Form, Item, Input, Label, Picker, Textarea,
    Switch, Radio, Spinner, Tab, Tabs, TabHeading,
    ScrollableTab, H1, H2, H3, Drawer,
} from 'native-base';
import { ScrollView, Modal, Dimensions, Image } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Ionicons } from '@expo/vector-icons';
import { countryFlag } from './countryFlag'

export default function FlagList(props) {
    const flagButton = (currency) => {
        return <Button transparent onPress={() => { props.close(); props.country_selection(currency) }}>
            <Image
                style={{ width: 50, height: 40, marginTop: 5 }}
                source={countryFlag[currency]}
            />
        </Button>
    }

    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={props.show}
        >
            <Container style={{ backgroundColor: '#1C2833' }}>
                <Header >
                    <Left>
                        <Button transparent onPress={() => props.close()}>
                            <Ionicons name='ios-arrow-round-back' size={40} color="white"></Ionicons>
                        </Button>
                    </Left>
                    <Body style={{ alignItems: 'center' }}>
                        <Title>Select Country</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <View style={{ flex: 1, justifyContent: 'space-around' }}>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                        {flagButton('CAD')}
                        {flagButton('USD')}
                        {flagButton('CNY')}
                        {flagButton('EUR')}
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                        {flagButton('JPY')}
                        {flagButton('AUD')}
                        {flagButton('GBP')}
                        {flagButton('RUB')}
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                        {flagButton('HKD')}
                        {flagButton('CHF')}
                        {flagButton('KRW')}
                        {flagButton('ISK')}
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                        {flagButton('PHP')}
                        {flagButton('DKK')}
                        {flagButton('HUF')}
                        {flagButton('CZK')}
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                        {flagButton('RON')}
                        {flagButton('SEK')}
                        {flagButton('IDR')}
                        {flagButton('INR')}
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                        {flagButton('BRL')}
                        {flagButton('HRK')}
                        {flagButton('THB')}
                        {flagButton('MYR')}
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                        {flagButton('BGN')}
                        {flagButton('TRY')}
                        {flagButton('NOK')}
                        {flagButton('NZD')}
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
                        {flagButton('ZAR')}
                        {flagButton('MXN')}
                        {flagButton('SGD')}
                        {flagButton('ILS')}
                        {flagButton('PLN')}
                    </View>
                </View>
            </Container>
        </Modal>
    )
}