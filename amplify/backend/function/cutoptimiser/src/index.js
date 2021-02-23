function bestFit(binSize, sizes, bladeSize) {
  let bins = {};

  sizes.forEach((size, index) => {
    const foundBin =
      Object.entries(bins)
        .filter(([key, value], index) => value.capacity >= size)
        .sort(([key1, value1], [key2, value2]) => value1.capacity - value2.capacity)[0] || null;

    if (foundBin) {
      const [key, value] = foundBin;
      bins[key].capacity = +(value.capacity - size).toFixed(2);
      bins[key].items.push(size);
      if (bins[key].capacity >= bladeSize) {
        bins[key].capacity = +(bins[key].capacity - bladeSize).toFixed(2);
        bins[key].items.push(bladeSize);
      }
    } else {
      const nextIdx = Object.values(bins).length;
      bins[nextIdx] = {
        capacity: +(binSize - size).toFixed(2),
        items: [size],
      };
      if (bins[nextIdx].capacity >= bladeSize) {
        bins[nextIdx].capacity = +(bins[nextIdx].capacity - bladeSize).toFixed(2);
        bins[nextIdx].items.push(bladeSize);
      }
    }
  });

  const wasteTotal = Object.values(bins).reduce((acc, { capacity }) => (acc += capacity), 0);
  bins.wasteTotal = wasteTotal;
  return bins;
}

function* permute(permutation) {
  var length = permutation.length;
  var c = Array(length).fill(0);
  var i = 1;
  var k;
  var p;

  yield permutation.slice();
  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      yield permutation.slice();
    } else {
      c[i] = 0;
      ++i;
    }
  }
}

exports.handler = async (event) => {
  const { sortedSizes } = JSON.parse(event.body);

  let bestResult = { wasteTotal: Infinity };

  for (let permutation of permute(sortedSizes)) {
    console.log({ permutation });
    const bins = bestFit(6500, permutation, 10);
    if (bins.wasteTotal < bestResult.wasteTotal) {
      bestResult = bins;
    }
  }

  const response = {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(bestResult),
  };
  return response;
};
