import {ADDGAME, DELETEGAME} from './actions';
import {ActionGame,Game,InitialState} from '../type/types';

const initialState:InitialState={
  games:[]
}

const mainReducer = (state:InitialState = initialState, action:ActionGame) => {
  switch (action.type) {
    case ADDGAME: {
      return {
        ...state,
        games: state.games.concat({
          name: action.name,
          score: action.score,
          id: new Date(),
        }),
      };
    }
    case DELETEGAME: {
      let newList:Game[] = state.games.filter((game:Game) => game.id !== action.id);
      return {...state, games: newList};
    }
    default: {
      return state;
    }
  }
};
export default mainReducer;
