import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import Number from '../pages/Number';

const Stack = createStackNavigator();

function AppNavigator(props) {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Number" component={Number} />
        </Stack.Navigator>
    )
}

export default AppNavigator;
