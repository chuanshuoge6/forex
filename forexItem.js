import React, { Component } from 'react';
import {
    Container, Header, Title, Content, Footer,
    FooterTab, Button, Left, Right, Body, Icon, Text,
    Accordion, Card, CardItem, Thumbnail, ListItem,
    CheckBox, DatePicker, DeckSwiper, View, Fab,
    Badge, Form, Item, Input, Label, Picker, Textarea,
    Switch, Radio, Spinner, Tab, Tabs, TabHeading,
    ScrollableTab, H1, H2, H3, Drawer,
} from 'native-base';
import { Image } from 'react-native';
import { countryFlag } from './countryFlag'

export default class ForexListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { currency, rate, CAD, buttonPress, buttonLongPress } = this.props
        const amount = currency === 'BTC' ? (rate * CAD).toFixed(4) : (rate * CAD).toFixed(2)

        return (
            <Button style={{ flex: 1, margin: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                onPress={() => buttonPress(amount)}
                onLongPress={() => buttonLongPress()}>
                {currency ?
                    <Image
                        style={{ width: 50, height: 40 }}
                        source={countryFlag[currency]}
                    />
                    : null}
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: 'white', fontSize: 12 }}>{amount}</Text>
                    <Text style={{ color: 'gold', fontSize: 12 }}>{currency}</Text>

                </View>
            </Button>
        )
    }
}