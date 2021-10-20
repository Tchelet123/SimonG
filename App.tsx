import * as React from 'react';
import {NavigationContainer, NavigationContainerProps} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import {Provider} from 'react-redux';
import configureStore from './src/redux/store';

const Stack = createStackNavigator<RootStackParamList>();
const store = configureStore();

export type RootStackParamList = {
  GameScreen: undefined;
  ResultScreen: undefined;
};

const MyTheme:any = {
  dark: false,
  colors: {
    primary: '#50d2c2',
    background: 'black',
    card: '#3333a3',
    header: '#535264',
    text: 'white',
    // border: 'rgb(180, 179, 191)',
    btn1: ['#50d2c2','#3333a3'],
    btn2: ['#3333a3',],
    white:"white",
    firstPlace:"#aaaa0e",
    topThree:"#bbbb96",
    restOfPlayers:"#707061"
  },
};
const App: React.FC<RootStackParamList> = () => {
  return (
   <Provider store={store}>
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name={"GameScreen"} component={GameScreen} />
        <Stack.Screen name={"ResultScreen"} component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
   </Provider>
  );
};


export default App;