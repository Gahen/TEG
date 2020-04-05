import {Color} from 'src/type/color';

export enum ObjectiveTypes {
  DESTROY,
  CONQUER,
};

interface IObjectiveDestroy {
  type: ObjectiveTypes.DESTROY;
  value: Color;
}

interface IObjectiveConquer {
  type: ObjectiveTypes.CONQUER;
  value: {
    africa? : number,
    limitrofes? : number,
    europa? : number,
    asia? : number,
    oceania? : number,
    'america del sur'? : number,
    'america del norte'? : number,
  };
}

export type IObjective = IObjectiveConquer | IObjectiveDestroy;

export const Objectives: IObjective[] = [
  { type: ObjectiveTypes.DESTROY, value: Color.green },
  { type: ObjectiveTypes.DESTROY, value: Color.blue },
  { type: ObjectiveTypes.DESTROY, value: Color.black },
  { type: ObjectiveTypes.DESTROY, value: Color.pink },
  { type: ObjectiveTypes.DESTROY, value: Color.yellow },
  { type: ObjectiveTypes.DESTROY, value: Color.red },
  {
    type: ObjectiveTypes.CONQUER,
    value: {
      'africa': 6,
      'america del norte': 5,
      'europa': 4
    },
  },
  {
    type: ObjectiveTypes.CONQUER,
    value: {
      'america del sur': 6,
      'limitrofes': 3,
      'europa': 7
    }
  },
  {
    type: ObjectiveTypes.CONQUER,
    value: {
      'europa': 9,
      'asia': 4,
      'america del sur': 2
    }
  },
  {
    type: ObjectiveTypes.CONQUER,
    value: {
      'asia': 15,
      'america del norte': 5,
      'europa': 4
    }
  },
  {
    type: ObjectiveTypes.CONQUER,
    value: {
      'oceania': 2,
      'america del norte': 10,
      'asia': 4
    }
  },
  {
    type: ObjectiveTypes.CONQUER,
    value: {
      'oceania': 2,
      'america del norte': 4,
      'asia': 3,
      'africa': 2,
      'america del sur': 2,
      'europa': 3
    }
  },
  {
    type: ObjectiveTypes.CONQUER,
    value: {
      'europa': 2,
      'america del norte': 10,
      'oceania': 4
    }
  },
  {
    type: ObjectiveTypes.CONQUER,
    value: {
      'africa': 6,
      'america del sur': 6,
      'america del norte': 5
    }
  },
]
