import AsyncStorage from "@react-native-async-storage/async-storage";

async function getUrl() {
    let result = [];
    let drwNum;

    let listData = await AsyncStorage.getItem( 'list' );
    listData = JSON.parse(listData);
    
    if( listData === null ) {
        for(let i = 1; i > 0; i++) {
            try {
                let response = await axios.get(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${i}`);
                
                if( response.data.returnValue === "success" ) {
                    result.push(response.data);
                    drwNum = i;
                } else if( response.data.returnValue === "fail" ) {
                    setList(result);
                    store(drwNum, result);
                    setIsLoading( false );
                    break;
                }
            } catch(error) {
                alert( error.message );
            }
           
        }
    } else {
        result = data;
        for(let i = drwNum+1; i > 0; i++) {
            try {
                let response = await axios.get(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${i}`);
                
                if( response.data.returnValue === "success" ) {
                    result.push(response.data);
                    drwNum = i;
                } else if( response.data.returnValue === "fail" ) {
                    setList(result);
                    store(drwNum, result);
                    setIsLoading( false );
                    break;
                }
            } catch(error) {
                alert( error.message );
            }
           
        }
    }
}