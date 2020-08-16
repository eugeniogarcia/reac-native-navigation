# Introduction

The first way to target platform-specific code is to __name the file with the correct file extension__, depending on the platform you wish to target. For example, one component that differs quite a bit between iOS and Android is DatePicker. If you want specific styling around DatePicker, writing all the code in the main component may become verbose and difficult to maintain. Instead, you __create two files__ — `DatePicker.ios.js` and `DatePicker.android.js`— and __import them into the main component__. When you run the project, __React Native will automatically choose the correct file__ and __render it based on the platform you’re using__.

The file for iOS:

```js
import React from 'react'
import { View, Text, DatePickerIOS } from 'react-native'

export default () => (
    <View>
        <Text>This is an iOS specific component</Text>
        <DatePickerIOS />
    </View>
)
```

The file for Android:

```js
import React from 'react'
import { View, Text, DatePickerAndroid } from 'react-native'

export default () => (
    <View>
        <Text>This is an Android specific component</Text>
        <DatePickerAndroid />
    </View>
)
```

We import the component - without specifing the _.ios.js_ or the _.android.js_ extensions:

```js
import React from 'react'
import DatePicker from './DatePicker'

const MainComponent = () => (
<View>
    ...
    <DatePicker />
    ...
</View>
)
```

Another way to detect and perform logic based on the platform is to use the Platform API. Platform has two properties. The first is an OS key that reads either ios or android, depending on the platform:

```js
import React from 'react'
import { View, Text, Platform } from 'react-native'

const PlatformExample = () => (
    <Text style={{ marginTop: 100, color: Platform.OS === 'ios' ? 'blue' : 'green' }}>
    Hello { Platform.OS }
    </Text>
)
```

Here, you check whether the value of Platform.OS is equal to the string 'ios' and, if it is, return a color of 'blue'. If it isn’t, you return 'green'. The second property of Platform is a method called select. select takes in an object containing the Platform.OS strings as keys (either ios or android) and returns the value for the platform you’re running.

```js
import React from 'react'
import { View, Text, Platform } from 'react-native'

const ComponentIOS = () => (
    <Text>Hello from IOS</Text>
)

const ComponentAndroid = () => (
    <Text>Hello from Android</Text>
)

const Component = Platform.select({
    ios: () => ComponentIOS,
    android: () => ComponentAndroid,
})();

const PlatformExample = () => (
    <View style={{ marginTop: 100 }}>
        <Text>Hello from my App</Text>
        <Component />
    </View>
)
```

# Datepicker

DatePickerIOS provides an easy way to implement a native date picker component on iOS. It has three modes that come in handy when working with dates and times: date, time, and dateTime.

DatePickerIOS has the props listed in the next table. The minimum props that need to be passed are date (the date that’s the beginning or current date choice) and an onDateChange method. When any of the date values are changed, onDateChange is called, passing the function the new date value:


|Prop|Type|Description|
|-------|-------|-------|
|date|Date|Currently selected date|
|maximumDate|Date|Maximum allowed date|
|minimumDate|Date|Minimum allowed date|
|minuteInterval|Enum|Interval at which minutes can be selected|
|mode|String: date, time, or datetime|Date picker mode|
|onDateChange|Function: on DateChange(date) { }|Function called when the date changes|
|timeZoneOffsetInMinutes|Number|Time zone offset in minutes; overrides the default (the device time zone)|



