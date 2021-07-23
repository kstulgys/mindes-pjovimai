/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";

export function useAuthUser() {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const router = useRouter();

  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => setUser(user))
      .catch(() => router.push("/auth"))
      .finally(() => setIsLoading(false));
  }, []);
  return { isLoading, user };
}

export function loopCalculation(
  stockItems,
  cutItems,
  bladeSize,
  timeforCalculation
) {
  let answerExport = [];
  let totalUsedStockLength = Number.MAX_SAFE_INTEGER;
  const t0 = Date.now();
  let mustBeInteger = true;
  let notEnoughStockItems = true;
  // Gets an object of sizes/cuts
  function Information(importCutInformation, isCutInfo) {
    const sizes = [];
    const quantities = [];
    let indexI = 0;
    const names = [];
    const angle1 = [];
    const angle2 = [];
    importCutInformation.sort(function (a, b) {
      return b.length - a.length;
    });
    importCutInformation.forEach((element) => {
      if (
        !Number.isInteger(element.length) ||
        !Number.isInteger(element.quantity)
      )
        mustBeInteger = false;

      if (element.length > 0 && element.quantity > 0) {
        sizes[indexI] = element.length;
        quantities[indexI] = element.quantity;
        names[indexI] = element.name;
        if (isCutInfo) {
          angle1[indexI] = element.angle1;
          angle2[indexI] = element.angle2;
        }
        indexI++;
      }
    });
    return {
      sizes: sizes,
      quantities: quantities,
      names: names,
      angle1: angle1,
      angle2: angle2,
    };
  }
  let cutInformationExport = Information(cutItems, true);
  const cutInformationString = JSON.stringify(cutInformationExport);
  // console.log(cutInformationExport);
  let stockInformationExport = Information(stockItems, false);
  const stockInformationString = JSON.stringify(stockInformationExport);
  // console.log(stockInformationExport);
  // Check inputs 1. Inputs must be integer;
  if (!mustBeInteger) return checkIfInteger();
  // Check inputs 2. Ratio between max stock and min cut must be not bigger than 1000 times;
  if (checkMaxRatioStockAndCut(stockInformationExport, cutInformationExport))
    return checkMaxRatioStockAndCut(
      stockInformationExport,
      cutInformationExport
    );

  function calculation(
    stockInformation,
    cutInformation,
    bladeSize,
    constantDe
  ) {
    // Creates an array of possible cuts. Checks how many fits on one stock length.
    //If fits all then creates combinations for all, otherwise for only how many fits.
    //Creates combination on the longest stock length.

    function getIndexFirstMember(arrQuantities) {
      // Get longest cut which still has quantities to cut.
      for (let i = 0; i < arrQuantities.length; i++) {
        if (arrQuantities[i] > 0) return i;
      }
    }
    function membersOfCombinations(sizes1, quantities1) {
      const cut = [];
      const longestStock = stockInformation.sizes[0];
      const firstSize = sizes1[getIndexFirstMember(quantities1)];
      for (let i = 0; i < sizes1.length; i++) {
        let element = 0;
        let j = 0;
        if (quantities1[i] === 0) continue;
        if (
          (longestStock - (firstSize + bladeSize)) / (sizes1[i] + bladeSize) >
          quantities1[i]
        ) {
          element = quantities1[i];
        } else {
          element = Math.floor(
            (longestStock - (firstSize + bladeSize) + bladeSize) /
              (sizes1[i] + bladeSize)
          );
        }
        if (firstSize === sizes1[i] && element !== quantities1[i]) {
          element++;
        }
        while (j < element) {
          j++;
          cut.push([
            (sizes1[i] + bladeSize) * j - bladeSize, // To paties pjovimo suma be paskutinio pjuvio tako.
            i, // Pjovimo index'as is pjovimo saraso. Pasitikrinti ar nera duplikato.
            j, // Kiek vienetu atlikta būtent šio pjovimo
            sizes1[i], // Pjovimo ilgis
          ]);
        }
      }
      return cut;
    }

    const calculationDepthConstant = constantDe;
    let bestLastElement = [];
    let matchedCombination = [];
    let found = false;
    let afterThatSTOP = true;

    let firstGlobalElement = cutInformation.sizes[0];
    let alliterationSteps = 0;
    let oneIterationSteps = 0;
    let howDeep = 0;

    let lengthToUseFound = [0];
    let lengthToUseNotFound = [0];
    let smallestFoundDifference = [Number.MAX_SAFE_INTEGER];
    // All possible cut combinations of one stock
    const combinations = (elements) => {
      //if (howDeep > calculationDepthConstant) console.log(howDeep);
      if (elements.length === 0 || howDeep > calculationDepthConstant)
        return [[]];

      const firstEl = elements[0];
      const rest = elements.slice(1);
      howDeep++;
      const combsWithoutFirst = combinations(rest);
      const combsWithFirst = [];

      for (let i = 0; i < combsWithoutFirst.length; i++) {
        if (!afterThatSTOP) return [[]];
        //First and second member have different lengths
        if (
          (combsWithoutFirst[i][0] &&
            firstEl[1] !== combsWithoutFirst[i][0][1]) ||
          !combsWithoutFirst[i][0]
        ) {
          alliterationSteps++;
          oneIterationSteps++;

          const element = [firstEl, ...combsWithoutFirst[i]];
          const comparisonSum = element.reduce(
            (a, b) => a + b[0] + bladeSize,
            0
          );
          // All lenghts shorter than longest stock length
          if (stockInformation.sizes[0] + bladeSize >= comparisonSum) {
            // A length that has no residual end.
            if (firstGlobalElement === firstEl[3]) {
              if (checkIfSomethingMatches(comparisonSum)) {
                afterThatSTOP = false;
                found = true;
                matchedCombination = [];
                matchedCombination.push(element);
                return [[]]; // Best first element
              }
              // A length that has no duplicate member in the sequance and is longer/better.
              const firstStockSizeLongerThanSum = StockSizeLongerThanSum(
                comparisonSum
              );
              if (
                smallestFoundDifference[0] > // There is only one element
                firstStockSizeLongerThanSum - comparisonSum
              ) {
                lengthToUseNotFound = [];
                lengthToUseNotFound.push(firstStockSizeLongerThanSum);
                smallestFoundDifference = [];
                smallestFoundDifference.push(
                  firstStockSizeLongerThanSum - comparisonSum
                );
                bestLastElement = [];
                bestLastElement.push(element);
              }
            }
            combsWithFirst.push(element);
          }
        }
      }
      return [...combsWithFirst, ...combsWithoutFirst];
    };

    //Between sizes
    function checkIfSomethingMatches(cutComboLength) {
      let doWhileThis = true;
      for (let index = 0; index < stockInformation.sizes.length; index++) {
        const element = stockInformation.sizes[index];
        if (
          cutComboLength <= element &&
          element <= cutComboLength + bladeSize
        ) {
          lengthToUseFound = [];
          lengthToUseFound.push(element);
          doWhileThis = false;
          break;
        }
      }
      // console.log(!doWhileThis);
      return !doWhileThis;
    }

    function StockSizeLongerThanSum(length) {
      const stockSizes1 = stockInformation.sizes;
      let lengthExport = 0;
      for (let i = stockSizes1.length - 1; i >= 0; i--) {
        if (stockSizes1[i] + bladeSize >= length) {
          lengthExport = stockSizes1[i];
          //console.log(stockSizes1 + "stockSizes");
          break;
        }
      }
      if (lengthExport === 0) {
        // console.log("stockSizes1");
        // console.log(stockSizes1);
        // console.log("length");
        // console.log(length);
      }
      return lengthExport;
    }

    function eliminate(importedCutCombination, lengthToUse1) {
      // Finds out how many of certain cut combinations can be made.
      let cutNumberFloor = Number.MAX_SAFE_INTEGER;
      let hasAtLeastOneCut = true;
      const stockLengthIndex = stockInformation.sizes.indexOf(lengthToUse1);
      const stockName = stockInformation.names[stockLengthIndex];
      for (let index = 0; index < importedCutCombination.length; index++) {
        const element = importedCutCombination[index];
        const cutLengthIndex = element[1];
        //const cutLengthIndex = cutInformation.sizes.indexOf(element[3]);
        const cutNumberAccCutQuantity = Math.floor(
          cutInformation.quantities[cutLengthIndex] / element[2]
        );

        if (cutNumberAccCutQuantity <= 0 || isNaN(cutNumberAccCutQuantity)) {
          hasAtLeastOneCut = false;
          cutNumberFloor = 0;
          return {
            klaida: "nera pjuviu",
            importedCutCombination: getSums(importedCutCombination),
            lengthToUse1: lengthToUse1,
          };
        }
        if (
          cutNumberFloor > cutNumberAccCutQuantity &&
          hasAtLeastOneCut === true &&
          cutNumberAccCutQuantity > 0
        ) {
          if (
            cutNumberAccCutQuantity <=
            stockInformation.quantities[stockLengthIndex]
          ) {
            cutNumberFloor = cutNumberAccCutQuantity; // Quantity number according cut number
          } else {
            cutNumberFloor = stockInformation.quantities[stockLengthIndex]; // Quantity number according stock number
          }
        }
      }
      //Subtract components with the number of how many certain cut combinations can be made.
      const itemsToExport = [];
      if (hasAtLeastOneCut === true) {
        for (let j = 0; j < importedCutCombination.length; j++) {
          const length = importedCutCombination[j];
          const quantityInCombo = length[2];
          //const quantityIndex = cutInformation.sizes.indexOf(length[3]);
          const quantityIndex1 = length[1];
          // for (i = 0; i < quantityInCombo; i++) {
          itemsToExport.push([
            {
              cutQuantity: quantityInCombo,
              cutLength: length[3],
              cutName: cutInformation.names[quantityIndex1],
              angle1: cutInformation.angle1[quantityIndex1],
              angle2: cutInformation.angle2[quantityIndex1],
            },
          ]);
          // }
          cutInformation.quantities[quantityIndex1] =
            cutInformation.quantities[quantityIndex1] -
            cutNumberFloor * quantityInCombo;
        }
      }
      //Subtracts used stocks
      stockInformation.quantities[stockLengthIndex] =
        stockInformation.quantities[stockLengthIndex] - cutNumberFloor;
      if (stockInformation.quantities[stockLengthIndex] === 0) {
        stockInformation.quantities.splice(stockLengthIndex, 1);
        stockInformation.sizes.splice(stockLengthIndex, 1);
        stockInformation.names.splice(stockLengthIndex, 1);
      }
      return {
        quantity: cutNumberFloor,
        stockLength: lengthToUse1,
        stockName: stockName,
        waste: lengthToUse1 - getSums(importedCutCombination),
        items: itemsToExport,
      };
    }

    const timeA1 = Date.now();

    function implement() {
      let z = 0; //a number of different cut combinations
      const answer = [];
      let lengthToUse = 0;
      const exactMatch = []; // [[cutElement1,stockElement1],[cutElement2,stockElement2],..]
      //Check if there is an exact match of stock and cut
      let indexExact = 0;
      stockInformation.sizes.forEach((stockElement) => {
        cutInformation.sizes.forEach((cutElement, index) => {
          if (
            stockElement >= cutElement &&
            cutElement + bladeSize >= stockElement
          ) {
            exactMatch[indexExact] = [cutElement, stockElement, index];
            indexExact++;
          }
        });
      });
      exactMatch.forEach((element) => {
        const combinationExact = [[0, element[2], 1, element[0]]];
        answer[z] = eliminate(combinationExact, element[1]); //eliminate(cut,stock)
        z++;
      });
      //Regular check of cuts
      let hasCutAll = false;
      cutInformation.quantities.forEach((element) => {
        //Stops if all quantities are zero.
        if (element > 0) {
          hasCutAll = true;
        }
      });
      while (hasCutAll || z > 330) {
        // while (cutInformation.sizes.length > 0) {
        hasCutAll = false;
        bestLastElement = [];
        found = false;
        howDeep = 0;
        // @ts-ignore
        oneIterationSteps = 0;
        afterThatSTOP = true;
        smallestFoundDifference = [Number.MAX_SAFE_INTEGER];

        const cut = membersOfCombinations(
          cutInformation.sizes,
          cutInformation.quantities
        );
        firstGlobalElement =
          cutInformation.sizes[
            // @ts-ignore
            [getIndexFirstMember(cutInformation.quantities)]
          ];
        let combinationNew = combinations(cut);

        if (found === false) {
          combinationNew = bestLastElement[0];
          lengthToUse = lengthToUseNotFound[0];
        } else {
          combinationNew = matchedCombination[0];
          lengthToUse = lengthToUseFound[0];
        }
        // console.log(combinationNew);
        if (!combinationNew) {
          // window.alert('Not enough stock items');
          notEnoughStockItems = false;
          answer[z] = ["Not enough stock items"];
          return answer;
        }
        answer[z] = eliminate(combinationNew, lengthToUse);
        cutInformation.quantities.forEach((element) => {
          //Stops if all quantities are zero.
          if (element > 0) {
            hasCutAll = true;
          }
        });
        z++; //Safety trigger
      }
      return answer;
    }
    function getSums(array) {
      let returnSum = 0;
      array.forEach((elements) => {
        for (let z = 0; z < elements[2]; z++) {
          returnSum = returnSum + bladeSize + elements[3];
        }
      });
      return returnSum;
    }

    return implement();
  }

  for (let i = 5; i < 150; i++) {
    // i - how deep the recursive function gets. Iterates till time limit.
    cutInformationExport = JSON.parse(cutInformationString);
    stockInformationExport = JSON.parse(stockInformationString);
    const element = calculation(
      stockInformationExport,
      cutInformationExport,
      bladeSize,
      i
    );

    if (!notEnoughStockItems) return checkIfEnoughStockItems();

    const totalUsedStockLengthCompare = element.reduce(
      (a, b) => a + b.stockLength * b.quantity,
      0
    );
    console.log(totalUsedStockLengthCompare / 1000 + " m");
    if (totalUsedStockLengthCompare < totalUsedStockLength) {
      totalUsedStockLength = totalUsedStockLengthCompare;
      answerExport = element;
    }
    if (Date.now() - t0 > timeforCalculation * 1000 && answerExport.length) {
      console.log("Time limit " + timeforCalculation + "seconds");
      console.log("best result");
      console.log(totalUsedStockLength / 1000 + " m");

      return answerExport;
    }
  }

  const t1 = Date.now();
  console.log("It took " + (t1 - t0) + " milliseconds.");
  console.log("best result");
  console.log(totalUsedStockLength / 1000);
  //console.log(JSON.parse(stockInformationString));
  return answerExport;
}

export function checkMaxRatioStockAndCut(stockInfoElement, cutInfoElement) {
  const maxStockSize = stockInfoElement.sizes[0];
  const mixCutSize = cutInfoElement.sizes[cutInfoElement.sizes.length - 1];
  if (maxStockSize / mixCutSize >= 1000) {
    return {
      error:
        "Ration between stock and cut sizes is too big. Reduce to less than 1000",
    };
  }
}

export function checkIfInteger() {
  return {
    error: "Inputs must be integer numbers",
  };
}

export function checkIfEnoughStockItems() {
  return {
    error: "Not enough stock items",
  };
}
