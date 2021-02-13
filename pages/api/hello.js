// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { howToCutBoards1D } from "stock-cutting";

export default (req, res) => {
  console.log(req.body);
  const { inputState } = req.body;
  // const {
  //   query: { id, name },
  //   method,
  // } = req

  const result = howToCutBoards1D({
    stockSizes: inputState.stockSizes1D,
    bladeSize: inputState.bladeSize,
    requiredCuts: inputState.input1D,
  });
  res.statusCode = 200;
  res.json(result);
};
