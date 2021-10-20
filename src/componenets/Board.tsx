import React, {useState} from 'react';
import {Text,View,StyleSheet,Dimensions,TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {playSoundBtn} from './utils';

// WAIT FUNCTION
const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
interface Props {
  navigation: any;
  setUserLevel: (val: number) => void;
  setModalShow: (val: boolean) => void;
  setWinGame: (val: boolean) => void;
  modalShow: boolean;
};
interface State {
  stage: number[];
  index: number;
}
interface Button{
  percent:number;
  color: string;
  sound:string
}
const Board = (props: Props) => {
  ///////// game setting /////////
  const flashColor = '#e6e6b7';
  const flashTime = 300;
  const gameSpeed = 800;
  // ////////////////////////////
  // start and score btns colors
  const color1 = ['#50d2c2', '#3333a3'];
  const color2 = ['#3333a3'];
  const [pressNotAllowed, setPressNotAllow] = useState<boolean>(true);
  const [flashSimonBtn, setFlashSimonBtn] = useState<number>();
  const [simonSequence, setSimonSequence] = useState<State>({
    stage: [],
    index: 0,
  });
  const userLevel:number = simonSequence.stage.length;
  const errorSound = 'error.mp3';
  const buttonsGameInfo:Button[] = [
    {percent: 0.25, color: 'blue', sound: 'dosoundtwo.mp3'},
    {percent: 0.25, color: 'red', sound: 'resound.m4a'},
    {percent: 0.25, color: 'green', sound: 'misound.m4a'},
    {percent: 0.25, color: 'yellow', sound: 'fasound.m4a'},
  ];
  //show the press action
  const buttonAction = (buttonNumber: number,musicButton:string) => {
    // const musicButton = buttonsGameInfo[buttonNumber].sound;
    playSoundBtn(musicButton);
    setFlashSimonBtn(buttonNumber);
    wait(flashTime).then(() => setFlashSimonBtn(-1));
  };
  //show the user the sequence 
  const runSequence = async (buttonSequence: number[]) => {
    let i = 0;
    let intervalRound = setInterval(() => {
      //   check when the index is at the end of the array - stop interval
      if (buttonSequence[i] === undefined) {
        clearInterval(intervalRound);
        setPressNotAllow(false);
      } else {
        const musicButton = buttonsGameInfo[buttonSequence[i]].sound;
        buttonAction(buttonSequence[i],musicButton);
      }
      i++;
    }, gameSpeed);
  };
  //change the level of the game by update the SimonSequence and runSequence
  const updateLevel = () => {
    setPressNotAllow(true);
    const randomButtonNumber = Math.floor(Math.random() * 4);
    let newButtonSequence = [...simonSequence.stage, randomButtonNumber];
    setSimonSequence({
      index: 0,
      stage: newButtonSequence,
    });
    runSequence(newButtonSequence);
  };
  //restart or start game
  const startGame = () => {
    // setSimonSequence({stage: [], index: 0});
    setPressNotAllow(true);
    updateLevel();
  };
  //check if the user press is corect
  const userPress = async (buttonNumber: number) => {
    if (buttonNumber === simonSequence.stage[simonSequence.index]) {
      const musicButton = buttonsGameInfo[buttonNumber].sound
      await buttonAction(buttonNumber,musicButton);
      setSimonSequence({...simonSequence, index: simonSequence.index + 1});
      if (simonSequence.index === userLevel - 1) {
        updateLevel();
        props.setUserLevel(userLevel);
      }
    } else {
      buttonAction(buttonNumber,errorSound)
      playSoundBtn(errorSound);
      props.setWinGame(false);
      props.setModalShow(true);
      setSimonSequence({stage: [], index: 0});
    }
  };
  // navigate to ResultScreen
  const navigateResult = () => {
    props.navigation.navigate('ResultScreen');
  };
//creating the board 
  let cumulativePercent = 0;
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };
  let buttonsGameList = buttonsGameInfo.map((button:Button, index:number) => {
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += button.percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = button.percent > 0.5 ? 1 : 0;
    const pathData = [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      'L 0 0 ', // Line
    ].join(' ');
    const press = () => {
      userPress(index);
    };
    return (
      
      <Path
        disabled={pressNotAllowed}
        onPress={press}
        d={pathData}
        fill={flashSimonBtn !== index ? button.color : flashColor}
        key={index}
      />
      
    );
  });

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {alignItems: 'center', justifyContent: 'center'},
      ]}>
      {/* status level */}
      <View>
        <View style={styles.statusShape}>
          <Text style={styles.statusText}>Level:</Text>
          <Text style={[styles.statusText]}>{userLevel}</Text>
        </View>
      </View>
      {/* board button */}
      <Svg
        viewBox="-1 -1 2 2"
        style={{
          transform: [{rotate: '-90deg'}],
          width: Dimensions.get('window').width * 0.8,
          height: Dimensions.get('window').width * 0.8,
        }}>
        {buttonsGameList}
      </Svg>
      <View style={styles.Play}>
        {/* START BUTTON */}
        <TouchableOpacity
          disabled={userLevel > 1 && pressNotAllowed}
          onPress={() => startGame()}
          style={styles.btn}>
          <Text style={styles.btnText}>START</Text>
        </TouchableOpacity>
        {/* SCORE BUTTON */}
        <TouchableOpacity onPress={() => navigateResult()} style={styles.btn}>
          <Text style={styles.btnText}>SCORE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnPlayRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSingle: {
    margin: 5,
  },
  statusShape: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    borderColor: '#393956',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 6,
    marginBottom: 7,
  },
  statusText: {
    fontSize: 19,
    color: 'white',
  },
  Play: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // direction: 'ltr',
    width: '100%',
  },
  btn: {
    backgroundColor:"blue",
    padding: 5,
  },
 
  btnText: {
    fontSize: 18,
    color: 'white',
  },
  btnImage: {
    width: 100,
    height: 100,
  },
  fullScreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Board;
