import React from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

const SafeAreaView = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const NumBox = styled.TouchableOpacity`
    flex-direction: column;
    height: 30%;
    width: 95%;
    border-radius: 10px;
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
    margin: 5px;
`;

const DrwContainer = styled.View`
    justify-content: center;
    align-items: center;
    margin: 15px;
`;

const DrwNo = styled.Text`
    font-size: 24px;

`;

const DrwDay = styled.Text`
    font-size: 18px;
    color: #a9a9a9;
`;

const WinimantCotainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;


const FirstWinamnt = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-top: 10px;
`;

const MoneyEach = styled.Text`
    font-size: 18px;
    color: #6a6a6a;
`;


const BallContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
`;

const Ball = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 5px;
    justify-content: center;
    align-items: center;
    ${ props => {
        if( props.number < 11 ) {
            return 'background: #fbc400;'; //노란색
        }
        else if( props.number < 21 ) {
            return 'background: #69c8f2;'; //파란색
        }
        else if( props.number < 31 ) {
            return 'background: #ff7272;'; //빨간색
        }
        else if( props.number < 41 ) {
            return 'background: #aaa;'; //검정색
        }
        else {
            return 'background: #b0d840;'; // 초록색
        }
    }}
`;

const BonusText = styled.Text`
    font-size: 24px;
`;

const BallFont = styled.Text`
    font-size: 18px;
    color: black;
`;

const GuidText = styled.Text`
    font-size: 10px;
    color: #a9a9a9;
    margin-bottom: 15px;
`;

const SmallBoxContainer = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin: 5px;
`;

const SmallBox = styled.TouchableOpacity`
    height: 15%;
    width: 47%;
    border-radius: 10px;
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
    margin: 5px;
`;

const Text = styled.Text`
    font-size: 18px;
`;

const Column = styled.View`
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;


function Home(props) {
    const [list, setList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState( true );

    // 저장소에 최신 회차를 저장함
    const store = async (info) => {
        try{
            await AsyncStorage.setItem( 'list',  JSON.stringify(info));
        } catch (error) {
            alert( error.message );
        }
        
    }
    
    // 로또 API를 반복문을 이용해서 데이터 받아오는 함수 => 제일 최신 회차를 찾기 위해
    async function getUrl() {
        let result = [];
    
        let listData = await AsyncStorage.getItem( 'list' );    
        listData = JSON.parse(listData);
    
        if( listData === null ) {
            for(let i = 1; i > 0; i++) {
                try {
                    let response = await axios.get(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${i}`);
                    
                    if( response.data.returnValue === "success" ) {
                        result.push(response.data);
                    } else if( response.data.returnValue === "fail" ) {
                        setList(result);
                        store(result);
                        setIsLoading( false );
                        break;
                    }
                } catch(error) {
                    alert( error.message );
                }
               
            }
        } else {
            result = listData;
            for(let i = result.length+1; i > 0; i++) {
                try {
                    let response = await axios.get(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${i}`);
                    
                    if( response.data.returnValue === "success" ) {
                        result.push(response.data);
                    } else if( response.data.returnValue === "fail" ) {
                        setList(result);
                        store(result);
                        setIsLoading( false );
                        break;
                    }
                } catch(error) {
                    alert( error.message );
                }
               
            }
        }
    }

    React.useEffect( () => {
        getUrl();
    }, []);

    
    // 돈에 단위 붙이는 함수
    function numberToKorean(number){
        var inputNumber  = number < 0 ? false : number;
        var unitWords    = ['', '만 ', '억 ', '조 ', '경 '];
        var splitUnit    = 10000;
        var splitCount   = unitWords.length;
        var resultArray  = [];
        var resultString = '';
    
        for (var i = 0; i < splitCount; i++){
             var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
            unitResult = Math.floor(unitResult);
            if (unitResult > 0){
                resultArray[i] = unitResult;
            }
        }
    
        let resultIndex1 = String(resultArray[1]);
        let covToList = resultIndex1.split("");

        if( covToList.length === 4 && Number(covToList[0]) >= 5 ) {
            let resultIndex2 = resultArray[2] + 1;
            return String(resultIndex2) + "억원";
        } else {
            return String(resultArray[2]) + "억원";
        }

    }

    return(
        <SafeAreaView>

            <NumBox style={{ elevation: 10 }} onPress={ () => {props.navigation.navigate( 'Number' )}}>
                {isLoading ? (
                    <>
                        <Column>
                            <ActivityIndicator size={ 'large' } color='#0000ff' style={{ margin: 20 }} />
                            <GuidText>초기 실행시 데이터를 받아오는데 시간이 걸릴 수 있습니다.</GuidText>
                        </Column>
                    </>
                ) : (<>
                        <DrwContainer>
                            <DrwNo>{list[list.length-1].drwNo}회</DrwNo>
                            <DrwDay>{list[list.length-1].drwNoDate}</DrwDay>
                            <WinimantCotainer>
                                <FirstWinamnt>{numberToKorean(list[list.length-1].firstWinamnt * list[list.length-1].firstPrzwnerCo)}</FirstWinamnt>
                                {/* <MoneyEach>{numberToKorean(Number(list[list.length-1].firstWinamnt))}</MoneyEach> */}
                            </WinimantCotainer>
                        </DrwContainer>

                        <BallContainer>
                            <Ball number={list[list.length-1].drwtNo1}>
                                <BallFont>{list[list.length-1].drwtNo1}</BallFont>
                            </Ball>  

                            <Ball number={list[list.length-1].drwtNo2}>
                                <BallFont>{list[list.length-1].drwtNo2}</BallFont>
                            </Ball>  

                            <Ball number={list[list.length-1].drwtNo3}>
                                <BallFont>{list[list.length-1].drwtNo3}</BallFont>
                            </Ball> 

                            <Ball number={list[list.length-1].drwtNo4}>
                                <BallFont>{list[list.length-1].drwtNo4}</BallFont>
                            </Ball> 

                            <Ball number={list[list.length-1].drwtNo5}>
                                <BallFont>{list[list.length-1].drwtNo5}</BallFont>
                            </Ball> 

                            <Ball number={list[list.length-1].drwtNo6}>
                                <BallFont>{list[list.length-1].drwtNo6}</BallFont>
                            </Ball> 

                            <BonusText>+</BonusText>

                            <Ball number={list[list.length-1].bnusNo}>
                                <BallFont>{list[list.length-1].bnusNo}</BallFont>
                            </Ball> 
                        </BallContainer>
                        <GuidText>다른 회차 정보를 원한다면 터치</GuidText>
                    </>
                ) }
                

                

            </NumBox>

            <SmallBoxContainer>

                <SmallBox style={{ elevation: 10 }}>
                    <Text>hi</Text>
                </SmallBox>

                <SmallBox style={{ elevation: 10 }}>
                    <Text>hi</Text>
                </SmallBox>

                <SmallBox style={{ elevation: 10 }}>
                    <Text>hi</Text>
                </SmallBox>

                <SmallBox style={{ elevation: 10 }}>
                    <Text>hi</Text>
                </SmallBox>

                <SmallBox style={{ elevation: 10 }}>
                    <Text>hi</Text>
                </SmallBox>

                <SmallBox style={{ elevation: 10 }}>
                    <Text>hi</Text>
                </SmallBox>

                <SmallBox style={{ elevation: 10 }}>
                    <Text>hi</Text>
                </SmallBox>

                <SmallBox style={{ elevation: 10 }}>
                    <Text>hi</Text>
                </SmallBox>

            </SmallBoxContainer>
        </SafeAreaView>
    )
}

export default Home;