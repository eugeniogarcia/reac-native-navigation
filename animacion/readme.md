# Introduction

To walk through the examples, we need to update `index.js`:

```js
import {AppRegistry} from 'react-native';

//import App from './animaciones/AnimatedTiming';
//import App from './animaciones/AnimatedInput';
//import App from './animaciones/AnimatedLoop';
//import App from './animaciones/AnimatedParallel';
import App from './animaciones/AnimatedSequence';
//import App from './animaciones/AnimatedStagger';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

# AnimatedTiming

To create an animatio we define a property that is to be animated, use that property withing an style in a control that supports the animation. Finally we have to define the rule to animate the property, timing and values it ought to take. This is done in four steps:

1. Import Animated from React Native

```js
import {StyleSheet, View, Animated, Button} from 'react-native';
```

2. Create an animatable value using the Animated API

```js
marginTop = new Animated.Value(20);
```

3. Attach the value to a component as a style

```js
<Animated.View style={[styles.box, {marginTop: this.marginTop}]} />
```

4. Animate the animatable value using a function

```js
  animate = () => {
    Animated.timing(this.marginTop, {
      toValue: 200,
      duration: 500,
    }).start();
  };
```

Out of the box, four types of animatable components ship with the Animated API:

- View
- ScrollView
- Text
- Image

In this example, we attach the animate method to an onPress handler so we can call it:

```js
<Button title="Animate Box" onPress={this.animate} />
```

Finally we use the Animated.View component instead of the regular View component:

```js
<Animated.View style={[styles.box, {marginTop: this.marginTop}]} />
```

The timing function takes two arguments: a starting value and a configuration object. The configuration object is passed a toValue to set the value the animation should animate to, and a duration in milliseconds to set the length of the animation.

```js
Animated.timing(this.marginTop, {
      toValue: 200,
      duration: 500,
    }).start();
```

Rather than a View component, you use an Animated.View. Animated has four components that can be animated out of the box: View, Image, ScrollView, and Text. In the styling of the Animated.View, you pass in an array of styles consisting of a base style (styles.box) and an animated style (marginTop).

# AnimatedInput

In this example, you’ll create a basic form input that expands when the user focuses it, and contracts when the input is blurred. This is a popular UI pattern.

The property we want to animate. We set it initially to 200:

```js
animatedWidth = new Animated.Value(200);
```

It will be animated to a `value`, over 750 ms:

```js
animate = (value) => {
    Animated.timing(this.animatedWidth, {
      toValue: value,
      duration: 750,
    }).start();
  };
```

When we focus on the input, the width of the view will go to 325. When we blur, the width will go back to 200:

```js
<Animated.View style={{width: this.animatedWidth}}>
    <TextInput // D
    style={[styles.input]}
    onBlur={() => this.animate(200)}
    onFocus={() => this.animate(325)}
    ref={(input) => (this.input = input)}
    />
```

# AnimatedLoop

Many times, you need to create animations that are infinite loops, such as loading indicators and activity indicators. One easy way to create such animations is to use the __Animated.loop__ function. In this section, you use Animated.loop along with the Easing module to create a loading indicator, spinning an image in an infinite loop!:

```js
animatedRotation = new Animated.Value(0);
```

Animated.loop runs a given animation continuously. Each time it reaches the end, it resets to the beginning and starts again. Note that we are still using __Animated.timing__, only that we do that witing an __Animated.loop__, and that it is this loop that we `start()`. The easing is a paramter in Animated.timing:

```js
animate = () => {
    Animated.loop(
      Animated.timing(this.animatedRotation, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
      }),
    ).start();
  };
```

Easing basically allows you to control the animation’s motion. In this example, you want a smooth, even motion for the spin effect, so you’ll use a linear easing function.

It is a component. We define the initial state, and we update it within a 2 secs timer that starts once the component has been mounted. So in a word, the value of the state will be `loading: true` until 2 secs after mounting the component. The animation starts once the component has been mounted:

```js
export default class RNAnimations extends Component {
  state = {
    loading: true,
  };
  componentDidMount() {
    this.animate();
    setTimeout(() => this.setState({loading: false}), 2000);
  }
```

When the state is `loading: true` we show the `Animated.Image`. Notice that we use a __transform__ to actually rotate the image:

```js
<View style={styles.container}>
    {loading ? (
        <Animated.Image
        source={require('./spinner.png')}
        style={{width: 40, height: 40, transform: [{rotate: rotation}]}}
        />
    ) : (
        <Text>Welcome</Text>
    )}
</View>
```

Another point to highlight is that the value we specify in the style, `rotation`, is not the property that we have directly animated, `animatedRotation`. Animated has a class method called interpolate that you can use to manipulate animated values, changing them into other values that you can also use. The interpolate method takes a configuration object with two keys: inputRange (array) and outputRange (also an array). inputRange is the original animated values you work with in a class, and outputRange specifies the values the original values should be changed to;

```js
    const rotation = this.animatedRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
```

So here we are building `rotation` to go go between 0 and 360 degrees, when `animatedRotation` goes between 0 and 1.

# AnimatedParallel

Show how to create multiple animations at once and have them run simultaneously. The Animated library has a class method called __Animated.parallel__ we can use to do this. parallel starts an array of animations at the same time. 

We are to animate three values:

```js
animatedTitle = new Animated.Value(-200);
animatedSubtitle = new Animated.Value(600);
animatedButton = new Animated.Value(800);
```

We will start the animation when the component is mounted:

```js
componentDidMount() {
    this.animate();
}
```

The animation uses the __Animated.paralell__ method to start the three animations at the same time. We create an array with the three animations and call start once. We are still using __Animated.timing__. We start the paralell:

```js
animate = () => {
    Animated.parallel([
      Animated.timing(this.animatedTitle, {
        toValue: 200,
        duration: 800,
      }),
      Animated.timing(this.animatedSubtitle, {
        toValue: 0,
        duration: 1400,
        delay: 800,
      }),
      Animated.timing(this.animatedButton, {
        toValue: 0,
        duration: 1000,
        delay: 2200,
      }),
    ]).start();
  };
```

We use these animated properties in an `<Animated.Text` and an `Animated.View`:


```js
<Animated.Text style={[styles.title, {marginTop: this.animatedTitle}]}>
    Welcome
</Animated.Text>
<Animated.Text
    style={[styles.subTitle, {marginLeft: this.animatedSubtitle}]}>
    Thanks for visiting our app!
</Animated.Text>
<Animated.View style={{marginTop: this.animatedButton}}>
    <TouchableHighlight style={styles.button}>
    <Text>Get Started</Text>
    </TouchableHighlight>
</Animated.View>
```

# AnimatedSequence

An animated sequence is a series of animations that occur one after another, with each animation waiting for the previous animation to complete before it begins. You can create an animated sequence with __Animated.sequence__. Like parallel, sequence takes an array of animations:

```js
  AnimatedValue1 = new Animated.Value(-30);
  AnimatedValue2 = new Animated.Value(-30);
  AnimatedValue3 = new Animated.Value(-30);
```

These values are animated using an __Animated.timing__, but we do start an __Animated.sequence__: 

```js
  animate = () => {
    const createAnimation = (value) => {
      return Animated.timing(value, {
        toValue: 290,
        duration: 500,
        useNativeDriver: true,
      });
    };
    Animated.sequence([
      createAnimation(this.AnimatedValue1),
      createAnimation(this.AnimatedValue2),
      createAnimation(this.AnimatedValue3),
    ]).start();
  };
```

The animated property is setting the `marginTop`. We starta with a negative value so that the text is not shown initially - is off the screen.

# AnimatedStagger

Animated.stagger. Like parallel and sequence, stagger takes an array of animations. The array of animations starts in parallel, but the start time is staggered equally across all the animations. Unlike parallel and sequence, the first argument to stagger is the stagger time, and the second argument is the array of animations:

```js
Animated.stagger(
    100,
    [
        Animation1,
        Animation2,
        Animation3
    ]
).start()
```

We define a large number of properties to animate:

```js
this.animatedValues = [];
for (let i = 0; i < 1000; i++) {
    this.animatedValues[i] = new Animated.Value(0);
}
```

We define an array with the actual animations:

```js
this.animations = this.animatedValues.map((value) => {
    return Animated.timing(value, {
    toValue: 1,
    duration: 6000,
    });
});
```

We'll start the animation as soon as the component is mounted. Each of the 1000 animated values will start the animations with a shift of 15:

```js
  componentDidMount() {
    this.animate();
  }
  animate = () => {
    Animated.stagger(15, this.animations).start();
  };
```

We'll display 1000 Animated.Views, and the style we update is the `opacity`:

```js
<View style={styles.container}>
    {this.animatedValues.map((value, index) => (
        <Animated.View key={index} style={[{opacity: value}, styles.box]} />
    ))}
</View>
```

# Other useful tips for using the Animated library

## Resetting an animated value

If you’re calling an animation, you can reset the value to whatever you want by using setValue(value). This is __useful if you’ve already called an animation__ on a value and __need to call the animation again__, and you want to reset the value to either the original value or a new value:

```js
animate = () => {
    this.animatedValue.setValue(300);
    #continue here with the new animated value
}
```

## Invoking a callback

When an animation is completed, an optional callback function can be fired, as shown here:

```js
Animated.timing(
    this.animatedValue,
    {
    toValue: 1,
    duration: 1000
    }
).start(() => console.log('animation is complete!'))
```

## Offloading animations to the native thread

Out of the box, the Animated library performs animations using the __JavaScript thread__. In most cases, this works fine, and you shouldn’t have many performance problems. But if anything is blocking the JavaScript thread, you may see issues like frames being skipped, causing laggy or jumpy animations. There’s a way around using the JavaScript thread: you can use a configuration
Boolean called useNativeDriver. useNativeDriver offloads the animation to the __native UI thread__, and the native code can then update the views directly on the UI thread, as shown here:

```js
Animated.timing(
    this.animatedValue,
        {
        toValue: 100,
        duration: 1000,
        useNativeDriver: true
        }
).start();
```

### NativeDriver 

[NativeDriver](https://reactnative.dev/blog/2017/02/14/using-native-driver-for-animated)

The Animated API was designed with a very important constraint in mind, it is serializable. This means we can send everything about the animation to native before it has even started and allows native code to perform the animation on the UI thread without having to go through the bridge on every frame. It is very useful because once the animation has started, the JS thread can be blocked and the animation will still run smoothly. In practice this can happen a lot because user code runs on the JS thread and React renders can also lock JS for a long time.

First, let's check out how animations currently work using Animated with the JS driver. When using Animated most of the work happens on the JS thread. If it is blocked the animation will skip frames. It also needs to go through the JS to Native bridge on every frame to update native views. What the native driver does is move all of these steps to native. Since Animated produces a graph of animated nodes, it can be serialized and sent to native only once when the animation starts, eliminating the need to callback into the JS thread; the native code can take care of updating the views directly on the UI thread on every frame.

#### Caveats

Not everything you can do with Animated is currently supported in Native Animated. The main limitation is that you can only animate non-layout properties, things like transform and opacity will work but Flexbox and position properties won't. Another one is with Animated.event, it will only work with direct events and not bubbling events. This means it does not work with PanResponder but does work with things like ScrollView#onScroll.