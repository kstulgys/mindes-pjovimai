import React from "react";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";

export function formatStockItems(items) {
  return items.reduce((acc, [stockLength, quantity, name, isEnabled]) => {
    if (!isEnabled) return acc;
    return [
      ...acc,
      {
        stockLength: +stockLength,
        quantity: +quantity ? +quantity : Infinity,
        name,
        isEnabled,
      },
    ];
  }, []);
}

export function formatCutItems(items) {
  return items.reduce(
    (acc, [cutLength, quantity, name, angle1, angle2, isEnabled]) => {
      if (!isEnabled) return acc;
      const cutList = Array(+quantity)
        .fill(null)
        .map((_) => ({
          cutLength: +cutLength,
          name,
          angle1,
          angle2,
        }));
      return [...acc, ...cutList];
    },
    []
  );
}

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

// export function getSortedSizes(sizes) {
//   const sortedSizes = sizes.reduce(
//     (acc, [length, qty, name, angle1, angle2]) => {
//       const formatted = Array(+qty)
//         .fill(null)
//         .map((_) => ({ size: +length, name, angle1, angle2 }));
//       return [...acc, ...formatted];
//     },
//     []
//   );
//   sortedSizes.sort((a, b) => b.size - a.size);
//   return sortedSizes;
// }

export const getResult = ({ stockItems, cutItems, bladeSize }) => {
  const result: any = bestFitDecreasing({
    stockItems,
    cutItems,
    bladeSize,
  });
  return getFormatedResult(result, bladeSize);
};

function bestFitDecreasing({ stockItems, cutItems, bladeSize }) {
  const allStockSizes = stockItems.map((item) => ({ ...item }));
  const allCutSizes = cutItems.map((item) => ({ ...item }));

  allCutSizes.sort((a, b) => b.cutLength - a.cutLength);

  allStockSizes.sort((a, b) => {
    if (a.stockLength > b.stockLength) return 1;
    if (a.stockLength < b.stockLength) return -1;
    if (a.quantity > b.quantity) return 1;
    if (a.quantity < b.quantity) return -1;
  });

  const data = [];
  const usedIndexes = [];

  allStockSizes.forEach(
    ({ stockLength, quantity: stockQuantity, name: stockName }, _) => {
      let stockQuantityAvailable = stockQuantity;

      allCutSizes.forEach(({ cutLength, ...rest }, index) => {
        const isIndexUsed = usedIndexes.some((idx) => idx === index);
        if (isIndexUsed) return;

        const entityFound = data
          .filter(
            (obj) =>
              obj.stockLength === stockLength && obj.capacity >= cutLength
          )
          .sort((a, b) => a.capacity - b.capacity)[0];

        if (entityFound) {
          entityFound.capacity = Math.round(entityFound.capacity - cutLength);
          entityFound.items.push({ cutLength, ...rest });

          if (entityFound.capacity >= bladeSize) {
            entityFound.capacity = Math.round(entityFound.capacity - bladeSize);
            // entityFound.items.push({ cutLength: bladeSize });
          }
          const lengthIndex = data.findIndex(
            (item) => item.id === entityFound.id
          );
          data[lengthIndex] = { ...entityFound };
          usedIndexes.push(index);
        } else {
          const isPossibleToAddStockItem = stockLength >= cutLength;

          if (isPossibleToAddStockItem && !!stockQuantityAvailable) {
            const item: any = {};
            item.stockLength = stockLength;
            item.stockName = stockName;
            item.capacity = Math.round(stockLength - cutLength);
            item.items = [{ cutLength, ...rest }];
            item.id = uuid();

            if (item.capacity >= bladeSize) {
              item.capacity = Math.round(item.capacity - bladeSize);
              // item.items.push({ cutLength: bladeSize });
            }
            data.push(item);
            stockQuantityAvailable--;
            usedIndexes.push(index);
          }
        }
      });
    }
  );

  return data;
}

// function bestFitDecreasing({ stockItems, cutItems, bladeSize }) {
//   return bfd({ stockItems, cutItems, bladeSize  });
// }

// function findNextBestStockItem(allStockSizes, size) {
//   let index;

//   const currentStockSize = allStockSizes.find((stock, idx) => {
//     const res = stock.size >= size && stock.isEnabled && stock.count > 0;
//     if (res) index = idx;
//     return res;
//   });

//   // Sort stock items by count (lower - higher)
//   // allStockSizes.sort((a, b) => a.count - b.count)

//   if (currentStockSize) {
//     allStockSizes[index].count--;
//     return { currentStockSize: allStockSizes[index] };
//   }

//   return null;
// }

// function addSizeItem(result, stockItem, size) {
//   const [key, value] = stockItem;
//   result[key].capacity = +(value.capacity - size).toFixed(2);
//   result[key].items.push(size);
//   return result;
// }

// function addBladeSize(result, stockItem, bladeSize) {
//   const [key, value] = stockItem;
//   if (result[key].capacity >= bladeSize) {
//     result[key].capacity = +(result[key].capacity - bladeSize).toFixed(2);
//     result[key].items.push(bladeSize);
//   }
//   return result;
// }

// function findStockWithLowestCapacity(result: any, size: any) {
//   const stockItem = Object.entries(result)
//     .filter(([key, value]: any, index) => value.capacity >= size)
//     .sort(
//       ([key1, value1]: any, [key2, value2]: any) =>
//         value1.capacity - value2.capacity
//     )[0];
//   return stockItem;
// }

function getFormatedResult(stockCutResult, bladeSize) {
  const formattedResult = {};

  stockCutResult.forEach((entity: any) => {
    const key = `${JSON.stringify(entity.items)} - ${entity.stockLength}`;

    if (formattedResult[key]) {
      formattedResult[key].quantity++;
    } else {
      formattedResult[key] = {
        ...entity,
        quantity: 1,
      };
    }
  });

  return Object.entries(formattedResult).sort(
    ([key1, value1]: any, [key2, value2]: any) => {
      if (value2.stockLength > value1.stockLength) return 1;
      if (value2.stockLength < value1.stockLength) return -1;

      if (value2.quantity > value1.quantity) return 1;
      if (value2.quantity < value1.quantity) return -1;
    }
  );
}

export function checkDouplicateName(sizes) {
  let name = null;
  sizes.some(([len1, qty1, name1], idx1) =>
    sizes.some(([len2, qty2, name2], idx2) => {
      if (idx1 === idx2) return false;
      if (name1 === name2) {
        name = name1;
        return true;
      }
      return false;
    })
  );

  return name;
}
