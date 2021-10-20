import React, {useState, useEffect} from 'react';
import { StyleSheet, Text} from 'react-native';
import ModalScreen from '../componenets/ModalScreen';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimonBoard from '../componenets/Board';
import {connect} from 'react-redux';
import {Game} from '../type/types';
// import configureStore from './src/redux/store';
// const store = configureStore();

type Props = {
  navigation: any;
  games:Game[];
  dispatch: any;
};
const GameScreen = (props: Props) => {
  const [modalShow, setModalShow] = useState(false);
  const [winGame, setWinGame] = useState(false);
  const {colors} = useTheme();
  const [userName, setUserName] = useState('');
  const [userLevel, setUserLevel] = useState(0);
  const navigation = props.navigation;
  const reduxState = props.games;
  const maxGamesOnList = 10;
  const sumOfGames:number = reduxState?.length || 0;
  console.log("sumOfGames",sumOfGames);
  

  // CHECK IF GAME'S SCORE IS ENOUGH TO ENTER THE LIST
  const checkifGameEnterList = (score: number) => {
    let otherLowerGame: Game | undefined = reduxState.find(
      (game: Game) => game.score <= score);
    if (otherLowerGame !== undefined) {
      let findGame:any =otherLowerGame; 
      props.dispatch({type: 'DELETEGAME', id: otherLowerGame.id});
      return true;
    } else return false;
  };

  // load games list from storage
  const loadState = async () => {
    try {
      const serializedState = await AsyncStorage.getItem('@games');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };
  // upload storage to state
  const updateStateFromStorage = async () => {
    let listFromStorage = await loadState();
    if (listFromStorage !== undefined) {
      console.log('listFromStorage', listFromStorage);
      let copyToState = listFromStorage.map((game: Game) => {
        props.dispatch({type: 'ADDGAME', name: game.name, score: game.score});
      });
    }
  };
  // WHEN GAME IS FINISH FUNCTION => ENTER/NOT ENTER THE GAME TO THE LIST
  const LevelUp = async () => {
    //if list is less than 10 games -enter the game
    if (sumOfGames < maxGamesOnList) {      
      props.dispatch({type: 'ADDGAME', name: userName, score: userLevel});
    }
    // the list has 10 games- check result to see if the game enter the list
    else {
      let gameEnter:boolean = checkifGameEnterList(userLevel);
      if (gameEnter) {
        props.dispatch({type: 'ADDGAME', name: userName, score: userLevel});
      }
      // game is not joining the list- just navigate to ResultScreen
      else {
        console.log('you are not in the list');
      }
    }
  };
  useEffect(() => {
    console.log('userLevel', userLevel);
  }, [userLevel]);
  useEffect(() => {
    updateStateFromStorage();
  }, []);

  return (
    <LinearGradient
      colors={['#4c669f', '#3f4250', '#111108']}
      style={styles.container}>
      <Text style={styles.title}>GAME BOARD</Text>
      {/* Simon btns */}
      <SimonBoard
        setWinGame={setWinGame}
        navigation={navigation}
        setUserLevel={setUserLevel}
        setModalShow={setModalShow}
        modalShow={modalShow}
      />
      {/* modal to enter user name when game is finished */}
      <ModalScreen
        LevelUp={LevelUp}
        winGame={winGame}
        userName={userName}
        setUserName={setUserName}
        navigation={navigation}
        setModalShow={setModalShow}
        modalShow={modalShow}
      />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: 'white',
  },
});
function mapStateToProps(state: any) {
  return {
    games: state.games,
  };
}

export default connect(mapStateToProps)(GameScreen);
