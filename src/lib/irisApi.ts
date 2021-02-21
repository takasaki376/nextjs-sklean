import { READ_IRIS } from "./type";
import axios from "axios";

export const apinUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}train/iris/`;
export const apiPredUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/IrisPredict/`;
// export const fetcher = (url: string) => axios.get(url).then((res) => res.data);
// export const post = (url: string) => axios.post(url).then((res) => res.data);

// ------------------------------------
// アイリス　学習データ
// ------------------------------------
export async function getIrisTrainData() {
  const res = await axios.get<READ_IRIS>(apinUrl);
  return res.data;
}
