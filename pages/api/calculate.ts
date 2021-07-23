import { loopCalculation } from "../../utils";

export default (req, res) => {
  try {
    const { stockItems, cutItems, bladeSize, constantD } = req.body;
    console.log({ stockItems, cutItems, bladeSize, constantD });
    const result = loopCalculation(stockItems, cutItems, bladeSize, constantD);
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json({ error });
  }
};
