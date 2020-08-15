# Alert 

An alert is a common UI pattern across both the web and mobile devices, and it’s an easy way to let the user know about something happening in the application such as an error or success. 

Alert launches a platform-specific alert dialog with a title, a message, __and optional methods__ that can be called __when an alert button is pressed__. Alert can be triggered by calling the alert method (Alert.alert), which takes four arguments Alert.alert(title, message, buttons, options).

# AppState

AppState will tell you whether the app is active, inactive, or in the background. It basically calls a method whenever the app state changes, allowing you to perform actions or call other methods based on the state of the app. AppState triggers whenever the app state changes and then returns active, inactive, or background. To respond to app state changes, add an event listener and call a method when the event is fired. The events that AppState uses to respond are change and memorywarning.

AppState is a useful API, and frequently comes in handy. Many times, when the app is pulled into the foreground, you may want to do things such as fetch fresh data from your API—and that’s a great use case for AppState.

# AsyncStorage

AsyncStorage is a great way to __persist and store data__: it’s asynchronous,
meaning you can __retrieve data using a promise or async await__, and it uses a
__key-value__ system to store and retrieve data. When you use an application and then close it, its state will be reset the next time you open it. One of the main benefits of AsyncStorage is that it lets you __store the data directly to the user’s device__ and retrieve it whenever you need it!.

|Method|Arguments|Description|
|------|------|------|
|setItem|key, value, callback|Stores an item in AsyncStorage|
|getItem|key, callback|Retrieves an item from AsyncStorage|
|removeItem|key, callback|Removes an item from AsyncStorage|
|mergeItem|key, value, callback|Merges an existing value with another existing value (both values must be stringified JSON)|
|clear|callback|Erases all values in AsyncStorage|
|getAllKeys|callback|Gets all keys stored in your app|
|flushGetRequests|None|Flushes any pending requests|
|multiGet|[keys], callback|Allows you to get multiple values using an array of keys|
|multiSet|[keyValuePairs], callback|Allows you to set multiple key-value pairs at once|
|multiRemove|[keys], callback|Allows you to delete multiple values using an array of keys|
|multiMerge|[keyValuePairs],callback|Allows you to merge multiple key-value pairs into one method|

# Clipboard

Clipboard lets you save and retrieve content from the clipboard on both iOS and
Android. Clipboard has two methods: getString() and setString(). 

# Dimensions

Dimensions gives you a way to get the device screen’s height and width. This is a good way to perform calculations based on the screen’s dimensions.

# Geolocation

Geolocation is achieved in React Native using the same API used in the browser, with the navigator.geolocation global variable available anywhere in the app. You don’t need to import anything to begin using this, because it’s again available as a global.

# Keyboard

|Method|Arguments|Description|
|------|------|------|
|addListener|event, callback|Connects a method to be called based on native keyboard events such as keyboardWillShow, keyboardDidShow, keyboardWillHide, keyboardDidHide, keyboardWillChangeFrame, and keyboardDidChangeFrame|
|removeAllListeners|eventType|Removes all listeners of the type specified dismiss None Dismisses the keyboard|

# NetInfo

NetInfo is an API that allows you to access data describing whether the device is online or offline. In order to use the NetInfo API on Android, you need to add the required permission to AndroidManifest.xml:

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

iOS and Android have different connectivity types.

|Cross platform (iOS and Android)|Android|
|------|------|
|none|bluetooth|
|wifi|ethernet|
|cellular|wimax|
|unknown||

Access to them depends on the actual connectivity type of the user’s connection. To determine the connection, you can use these methods:

|Method|Arguments|Description|
|------|------|------|
|isConnectionExpensive|None|Returns a promise that returns a Boolean specifying whether the connection is or isn’t expensive|
|isConnected|None|Returns a promise that returns a Boolean specifying whether the device is or isn’t connected|
|addEventListener|eventName, callback|Adds an event listener for the specified event|
|removeEventListener|eventName, callback|Removes an event listener for the specified event|
|getConnectionInfo|None|Returns a promise that returns an object with type and effectiveType.|

# PanResponder (gesture information)

The PanResponder API offers a way to use data from touch events. With it, you can granularly respond to and manipulate the application state based on single and multiple touch events, such as swiping, tapping, pinching, scrolling, and more.

Because the fundamental functionality of PanResponder is to determine the current
touches happening on the user’s device, the use cases are unlimited. 

- Create a swipeable stack of cards where an item is removed from the stack when
swiped out of view (think Tinder)
- Create an animatable overlay that the user can close by clicking a button or move out of view by swiping down
- Give the user the ability to rearrange items in a list by pressing part of a list item and moving to the desired location

