import React, { Component } from 'react';
import { StyleSheet, Text, View} from 'react-native';

/*
alignItems defines how to align children along the secondary axis of their container.
This property is declared on the parent view and affects its flex children just as flex-
Direction did. There are four possible values for alignItems: stretch, center,
flex-start, and flex-end.

stretch is the default. Each component is stretched to fill its parent container. With the other options: center, flex-start, and flex-end. Because a precise width isn’t specified for the example components, they only take up as much space horizontally as is necessary to render their contents rather than stretching to fill the space
*/
export default class App extends Component<{}> {
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.flexContainer,{alignItems: 'center'}]}>
                    <Example style={[styles.darkgrey]}>A 50%</Example>
                    <Example>B 50%</Example>
                </View>
                <View style={[styles.flexContainer,{alignItems: 'flex-start'}]}>
                    <Example style={[styles.darkgrey]}>C 33%</Example>
                    <Example style={{flex: 2}}>D 66%</Example>
                </View>
                <View style={[styles.flexContainer,{alignItems: 'flex-end'}]}>
                    <Example style={[styles.darkgrey]}>E 25%</Example>
                    <Example style={{flex: 3}}>F 75%</Example>
                </View>
            </View>
        );
    }
}

const Example = (props) => (
    <View style={[styles.example,styles.lightgrey,props.style]}>
        <Text>
            {props.children}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        alignItems: 'center',
        flex: 1
    },
    flexContainer: {
        width: 150,
        height: 150,
        borderWidth: 1,
        margin: 10
    },
    darkgrey: {
        backgroundColor: '#666666'
    },
    lightgrey: {
        backgroundColor: '#ededed'
    },
    example: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});