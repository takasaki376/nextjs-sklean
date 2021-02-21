import useSWR from "swr";
import clsx from "clsx";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { GetStaticProps } from "next";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  TextField,
  FormControl,
  Button,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
} from "@material-ui/core";
import { Scatter } from "react-chartjs-2";
import { getIrisTrainData, apiPredUrl, apinUrl } from "../lib/irisApi";
import { READ_IRIS, IRIS_DATA, POST_IRIS, PRED_IRIS, PRED } from "../lib/type";
import Layout from "../components/Layout";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: "25ch",
    backgroundColor: "white",
  },
  table: {
    tableLayout: "fixed",
    minWidth: 350,
  },
}));

interface Props {
  iris: READ_IRIS;
}

export const getStaticProps: GetStaticProps = async () => {
  const iris = await getIrisTrainData();

  return {
    props: { iris },
  };
};

export default function Iris({ iris }: Props) {
  const classes = useStyles();

  const { register, errors, handleSubmit } = useForm();
  // 予測するデータ（画面入力）
  const [predIris, setPredIris] = useState<POST_IRIS>({
    sepal_length: null,
    sepal_width: null,
    petal_length: null,
    petal_width: null,
  });
  // 予測結果
  const [predSeSetosa, setPredSeSetosa] = useState<IRIS_DATA[]>([]);
  const [predSeVersicolor, setPredSeVersicolor] = useState<IRIS_DATA[]>([]);
  const [predSeVirginica, setPredSeVirginica] = useState<IRIS_DATA[]>([]);
  const [predPeSetosa, setpredPeSetosa] = useState<IRIS_DATA[]>([]);
  const [predPeVersicolor, setPredPeVersicolor] = useState<IRIS_DATA[]>([]);
  const [predPeVirginica, setPredPeVirginica] = useState<IRIS_DATA[]>([]);
  const [predData, setPredData] = useState<PRED[]>([]);

  // 予測する
  const predict = async () => {
    const predIrisList: POST_IRIS[] = [];
    predIrisList.push(predIris);
    const res = await axios.post<PRED_IRIS>(apiPredUrl, predIrisList);
    const {
      se_setosa,
      se_versicolor,
      se_virginica,
      pe_setosa,
      pe_versicolor,
      pe_virginica,
      pred,
    } = res.data;
    // // 予測結果を格納する
    setPredSeSetosa([...predSeSetosa, se_setosa]);
    setPredSeVersicolor([...predSeVersicolor, se_versicolor]);
    setPredSeVirginica([...predSeVirginica, se_virginica]);

    setpredPeSetosa([...predPeSetosa, pe_setosa]);
    setPredPeVersicolor([...predPeVersicolor, pe_versicolor]);
    setPredPeVirginica([...predPeVirginica, pe_virginica]);
    setPredData([...predData, pred]);
  };

  // 学習する
  const train = async () => {
    const res = await axios.post(apinUrl);
  };

  // 予測結果の表示
  const pred_display = (pred: number) => {
    if (pred === 0) {
      return "setosa";
    } else if (pred === 1) {
      return "versicolor";
    } else if (pred === 2) {
      return "virginica";
    } else {
      return "None";
    }
  };

  // ガクの長さと幅での分布　表示用の定義
  const sepal_data = {
    datasets: [
      {
        label: "setosa train",
        backgroundColor: "rgba(96, 165, 250)",
        boderColor: "tranperent",
        data: iris.se_setosa,
      },
      {
        label: "versicolor train",
        backgroundColor: "rgba(248, 113, 113)",
        boderColor: "tranperent",
        data: iris.se_versicolor,
      },
      {
        label: "virginica train",
        backgroundColor: "rgba(52, 211, 153)",
        boderColor: "tranperent",
        data: iris.se_virginica,
      },
      {
        label: "setosa prediction",
        backgroundColor: "rgba(37, 99, 235)",
        boderColor: "tranperent",
        data: predSeSetosa,
      },
      {
        label: "versicolor prediction",
        backgroundColor: "rgba(220, 38, 38)",
        boderColor: "tranperent",
        data: predSeVersicolor,
      },
      {
        label: "virginica prediction",
        backgroundColor: "rgba(5, 150, 105)",
        boderColor: "tranperent",
        data: predSeVirginica,
      },
    ],
  };
  const petal_data = {
    datasets: [
      {
        label: "setosa train",
        backgroundColor: "rgba(96, 165, 250)",
        boderColor: "tranperent",
        data: iris.pe_setosa,
      },
      {
        label: "versicolor train",
        backgroundColor: "rgba(248, 113, 113)",
        boderColor: "tranperent",
        data: iris.pe_versicolor,
      },
      {
        label: "virginica train",
        backgroundColor: "rgba(52, 211, 153)",
        boderColor: "tranperent",
        data: iris.pe_virginica,
      },

      {
        label: "setosa prediction",
        backgroundColor: "rgba(37, 99, 235)",
        boderColor: "tranperent",
        data: predPeSetosa,
      },
      {
        label: "versicolor prediction",
        backgroundColor: "rgba(220, 38, 38)",
        boderColor: "tranperent",
        data: predPeVersicolor,
      },
      {
        label: "virginica prediction",
        backgroundColor: "rgba(5, 150, 105)",
        boderColor: "tranperent",
        data: predPeVirginica,
      },
    ],
  };
  const sepal_options = {
    title: {
      display: true,
      fontSize: 14,
      text: "ガクの長さと幅での分布",
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "width",
            fontSize: 12,
          },
          ticks: {
            // min: 2,
            // max: 5,
            fontSize: 10,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "length",
            fontSize: 12,
          },
          ticks: {
            // min: 4,
            // max: 8,
            fontSize: 10,
          },
        },
      ],
    },
  };
  const petal_options = {
    title: {
      display: true,
      fontSize: 14,
      text: "花弁の長さと幅での分布",
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "width",
            fontSize: 12,
          },
          ticks: {
            // min: 0,
            // max: 3,
            fontSize: 10,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "length",
            fontSize: 12,
          },
          ticks: {
            // min: 1,
            // max: 8,
            fontSize: 10,
          },
        },
      ],
    },
  };
  return (
    <Layout title="IRIS dataset">
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12} md={6} xl={3}>
          <Scatter data={sepal_data} options={sepal_options} />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <Scatter data={petal_data} options={petal_options} />
        </Grid>
        <Grid item md={1} xl={1}>
          <></>
        </Grid>
        <Grid item xs={12} md={5} xl={2}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // handleSubmit(predict);
              predict();
            }}
          >
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <TextField
                id="sepallength"
                name="sepallength"
                color="secondary"
                variant="outlined"
                placeholder="sepal length"
                inputRef={register({
                  min: 4,
                  max: 8,
                  pattern: /^[+-]?[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?$/i,
                })}
                value={predIris.sepal_length}
                onChange={(e) => {
                  setPredIris({
                    ...predIris,
                    sepal_length: e.target.value,
                  });
                }}
              />
            </FormControl>
            {errors.sepallength?.type === "min" && "４以上を入力して下さい"}
            {errors.sepallength?.type === "max" && "８以下を入力して下さい"}
            {errors.sepallength?.type === "pattern" && "数値を入力して下さい"}
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <TextField
                id="sepalwidth"
                name="sepalwidth"
                color="secondary"
                variant="outlined"
                placeholder="sepal width"
                inputRef={register({
                  min: 2,
                  max: 4.5,
                  pattern: /^[+-]?[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?$/i,
                })}
                value={predIris.sepal_width}
                onChange={(e) => {
                  setPredIris({
                    ...predIris,
                    sepal_width: e.target.value,
                  });
                }}
              />
            </FormControl>
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <TextField
                id="petallength"
                name="petallength"
                color="secondary"
                variant="outlined"
                placeholder="petal length"
                inputRef={register({
                  min: 1,
                  max: 7,
                  pattern: /^[+-]?[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?$/i,
                })}
                value={predIris.petal_length}
                onChange={(e) => {
                  setPredIris({
                    ...predIris,
                    petal_length: e.target.value,
                  });
                }}
              />
            </FormControl>
            <FormControl className={clsx(classes.margin, classes.textField)}>
              <TextField
                id="petalwidth"
                name="petalwidth"
                color="secondary"
                variant="outlined"
                placeholder="petal width"
                inputRef={register({
                  min: 0,
                  max: 2.5,
                  pattern: /^[+-]?[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?$/i,
                })}
                value={predIris.petal_width}
                onChange={(e) => {
                  setPredIris({
                    ...predIris,
                    petal_width: e.target.value,
                  });
                }}
              />
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              予測する
            </Button>
          </form>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              train();
            }}
          >
            学習する
          </Button>
        </Grid>

        <Grid item xs={12} md={6} xl={3}>
          {predData && (
            <TableContainer>
              <Table stickyHeader size="small" className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <strong>sepal length</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>sepal width</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>petal length</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>petal width</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>prediction</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {predData.map((data, rowIndex) => (
                    <TableRow hover key={rowIndex}>
                      <TableCell align="center" key={`${rowIndex}1`}>
                        <span>{data.sepal_length}</span>
                      </TableCell>

                      <TableCell align="center" key={`${rowIndex}2`}>
                        <span>{data.sepal_width}</span>
                      </TableCell>

                      <TableCell align="center" key={`${rowIndex}3`}>
                        <span>{data.petal_length}</span>
                      </TableCell>
                      <TableCell align="center" key={`${rowIndex}4`}>
                        <span>{data.petal_width}</span>
                      </TableCell>
                      <TableCell align="center" key={`${rowIndex}5`}>
                        <span>{pred_display(data.pred)}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
}
