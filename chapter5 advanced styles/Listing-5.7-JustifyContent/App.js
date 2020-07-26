import React, { Component } from 'react';
import { StyleSheet, Text, View} from 'react-native';

//Defining how space is used around a component with justifyContent
/*
- center causes the children to be centered within the parent container. The free
space is distributed on both sides of the clustered group of children.

- flex-start groups the components at the beginning of the flex column or
row, depending on what value is assigned to flexDirection. flex-start is the
default value for justifyContent.

- flex-end acts in the opposite manner: it groups items together at the end of the
container.

- space-around attempts to evenly distribute space around each element. Don’t
confuse this with distributing the elements evenly in the container; the space is
distributed around the elements. If it were based on the elements, you’d expect
space – element – space – element – space

Instead, flexbox allocates the same amount of space on each side of the element,
yielding

- space – element – space – space – element – space

In both cases, the amount of whitespace is the same; but in the latter, the space
between elements is greater.

- space-between doesn’t apply spacing at the start or end of the container. The
space between any two consecutive elements is the same as the space between any
other two consecutive elements.
*/
export default class App extends Component<{}> {
    render() {
        return (
            <View style={styles.container}>
                <FlexContainer style={[{justifyContent: 'center'}]}>
                    <Example>center</Example>
                    <Example>center</Example>
                </FlexContainer>
                <FlexContainer style={[{justifyContent: 'flex-start'}]}>
                    <Example>flex-start</Example>
                    <Example>flex-start</Example>
                </FlexContainer>
                <FlexContainer style={[{justifyContent: 'flex-end'}]}>
                    <Example>flex-end</Example>
                    <Example>flex-end</Example>
                </FlexContainer>
                <FlexContainer style={[{justifyContent: 'space-around'}]}>
                    <Example>space-around</Example>
                    <Example>space-around</Example>
                </FlexContainer>
                <FlexContainer style={[{justifyContent: 'space-between'}]}>
                    <Example>space-between</Example>
                    <Example>space-between</Example>
                </FlexContainer>
            </View>
        );
    }
}

const FlexContainer = (props) => (
    <View style={[styles.flexContainer,props.style]}>
        {props.children}
    </View>
);

const Example = (props) => (
    <View style={[styles.example,props.style]}>
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
        alignItems: 'stretch',
        backgroundColor: '#ededed',
        width: 120,
        height: 100,
        borderWidth: 1,
        margin: 10
    },
    example: {
        width: 120,
        height: 15,
        backgroundColor: '#666666'
    },
});