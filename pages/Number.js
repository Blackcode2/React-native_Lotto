import React from 'react';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchView = styled.View`
    height: 10%;
    width: 100%;
    flex: 1;
    border: 1px solid red;
`;

const View = styled.View`
    flex: 1;
`;

const Text = styled.Text`
    font-size: 24px;
`;

const Button = styled.Button`

`;

function Number(props, route) {

    const [list, setList] = React.useState([]);
    const [ready, setReady] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    async function getData2() {
        try {
            let data = await AsyncStorage.getItem( 'list' );
            data = JSON.parse(data);
            setList(data);
            setLoading(true);
            console.log(list);
        } catch (error) {
            alert( error.message );
        }
    }

    async function getData() {
        try {
            let data = await AsyncStorage.getItem( 'list' );
            data = JSON.parse(data);
            setList(data);
            setReady(false)
        } catch (error) {
            alert( error.message );
        }
    }
   

    React.useEffect( () => {
        getData();
    }, [])

    React.useEffect( () => {
        getData2();
    }, [ready])

    return(
        <View>
            {loading ? (<Text>{list[0].drwNoDate}</Text>) : (<Text>ready</Text>)}
            
            {/* <Text>{list[list.length-1].drwNoDate}</Text> */}
            <Button title="button" onPress={() => (setList(list + 1))} />
            <Button title="go back" onPress={ () => props.navigation.goBack() } />
        </View>
    )
}

export default Number;