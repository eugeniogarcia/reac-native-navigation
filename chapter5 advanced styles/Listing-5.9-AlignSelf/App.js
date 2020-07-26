import React, { Component } from 'react';
import { StyleSheet, Text, View} from 'react-native';

/*
So far, all the flex properties have been applied to the parent container. alignSelf is applied directly to an individual flex child. With alignSelf, you can access the alignItems property for
individual elements within the container. In essence, alignSelf gives you the ability to override whatever alignment was set on the parent container, so a child object can be aligned independently of its peers. 

The available options are auto, stretch, center, flexstart, and flex-end. The default value is auto, which takes the value from the parent container’s alignItems setting. The remaining properties affect the layout in the same way as their corresponding properties on alignItems.
*/
export default class App extends Component<{}> {
    render() {
        return (
            <View style={styles.container}>
                <FlexContainer style={[]}>
                    <Example align='auto'>auto</Example>
                    <Example align='stretch'>stretch</Example>
                    <Example align='center'>center</Example>
                    <Example align='flex-start'>flex-start</Example>
                    <Example align='flex-end'>flex-end</Example>
                    <Example>default</Example>
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
    <View style={[styles.example,
                  styles.lightgrey,
                  {alignSelf: props.align || 'auto'},
                  props.style
    ]}>
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
        backgroundColor: '#ededed',
        width: 120,
        height: 180,
        borderWidth: 1,
        margin: 10
    },
    example: {
        height: 25,
        marginBottom: 5,
        backgroundColor: '#666666'
    },
});
