// export interface READ_IRIS {
//   no: number;
//   se_len: number;
//   se_wd: number;
//   pe_len: number;
//   pe_wd: number;
//   y: number;
// }
export interface IRIS_DATA {
  x: number | null;
  y: number | null;
}

export interface READ_IRIS {
  se_setosa: IRIS_DATA[];
  se_versicolor: IRIS_DATA[];
  se_virginica: IRIS_DATA[];
  pe_setosa: IRIS_DATA[];
  pe_versicolor: IRIS_DATA[];
  pe_virginica: IRIS_DATA[];
}

export interface POST_IRIS {
  sepal_length: string | null;
  sepal_width: string | null;
  petal_length: string | null;
  petal_width: string | null;
}

export interface PRED {
  sepal_length: number;
  sepal_width: number;
  petal_length: number;
  petal_width: number;
  pred: number;
}

export interface PRED_IRIS {
  se_setosa: IRIS_DATA;
  se_versicolor: IRIS_DATA;
  se_virginica: IRIS_DATA;
  pe_setosa: IRIS_DATA;
  pe_versicolor: IRIS_DATA;
  pe_virginica: IRIS_DATA;
  pred: PRED;
}
