import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, StyleSheet, Text, Button} from 'react-native';
import {connect} from 'react-redux';
import GamesList from '../componenets/GamesList';
import FadeInView from '../componenets/FadeInView';
import {Game} from '../type/types';
interface Props {
  navigation: any;
  games: [];
  dispatch: any;
}
const ResultScreen = (props: Props) => {
  const reduxState: Game[] = props.games;
  let listByOrder: Game[] | undefined = orderList(reduxState);
  const gamesList:Game[]=(listByOrder ? listByOrder : []);
//sort games list
  function orderList(list: Game[]) {
    if (list !== undefined) {
      let orderedList = list.sort((a, b) => (a.score < b.score ? 1 : -1));
      return orderedList;
    }
    return undefined;
  }
//update local storage
  useEffect(() => {
    reduxState && AsyncStorage.setItem('@games', JSON.stringify(reduxState));
  }, [reduxState]);
//back to the game
  const navigateGameScreen = () => {
    props.navigation.navigate('GameScreen');
  };

  return (
    <View style={styles.container}>
      {/* list */}
      <FadeInView>
        {gamesList.length > 0 ? (
          <GamesList gamesList={gamesList} />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.userText}>The list is empty</Text>
            <Text style={styles.userText}>Press start to play</Text>
          </View>
        )}
      </FadeInView>
      <Button title="Game Screen" onPress={navigateGameScreen} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, maxWidth: '100%'},
  userText: {
    color: 'white',
  },
});
function mapStateToProps(state: any) {
  return {
    games: state.games,
  };
}

export default connect(mapStateToProps)(ResultScreen);
