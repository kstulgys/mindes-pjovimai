// import React from 'react'
// import { Auth } from 'aws-amplify'


// function useProtectedClient(){
//     const [user, setUser] = React.useState(null)
//     const router = useRouter()

//     React.useEffect(() => {
//       Auth.currentAuthenticatedUser()
//         .then(user => setUser(user))
//         .catch(() => router.push('/auth'))
//     }, [])

//   return user
// }

// function withAuth(WrappedComponent) {
//   const user = useProtectedClient()

//   if (!user){
//     return 
//   }
//   // return class extends React.Component {
//   //   componentDidUpdate(prevProps) {
//   //     console.log('Current props: ', this.props);
//   //     console.log('Previous props: ', prevProps);
//   //   }
//   //   render() {
//   //     // Wraps the input component in a container, without mutating it. Good!
//   //     return <WrappedComponent {...this.props} />;
//   //   }
//   // }
// }

const algorithms = [
  { method: "next_fit", name: "Next Fit" },
  { method: "first_fit", name: "First Fit" },
  { method: "best_fit", name: "Best Fit" },
  { method: "worst_fit", name: "Worst Fit" },
  { method: "best_fit_decreasing", name: "Best Fit Decreasing" },
  { method: "worst_fit_decreasing", name: "Worst Fit Decreasing" },
];

const units = ["mm", "cm", "m", "in", "ft"];
// stockLength, items, bins
// binSize,
// const cutSize = 10

// var items = [];
// for (var i = 0;i<parts.length;i++) {
//   if (parts[i].size !== undefined) {
//     for (var j = 0;j < parts[i].quantity; j++) {
//       items.push(parts[i].size+cutSize);
//     }
//   }
// }

// bins = new Array(items.length);
export function next_fit(binSize, items, bins) {
  var bin = 0;
  var capacity = binSize;
  for (var item = 0; item < items.length; item++) {
    if (items[item] > capacity) {
      bin++;
      capacity = binSize;
    }
    capacity -= items[item];
    bins[item] = bin;
  }
  return bin + 1;
}

export function first_fit(binsize, items, bins) {
  var bins_used = 1;
  var binarray = new Array(items.length);
  if (binarray === undefined) {
    return 0;
  }
  binarray[0] = binsize;
  for (var item = 0; item < items.length; item++) {
    var added = 0;
    for (var bin = 0; bin < bins_used && !added; bin++) {
      if (binarray[bin] >= items[item]) {
        /* Add to this bin */
        binarray[bin] -= items[item];
        bins[item] = bin;
        added = 1;
      }
    }
    if (!added) {
      /* Create a new bin and add to it */
      binarray[bins_used] = binsize - items[item];
      bins[item] = bins_used;
      bins_used++;
    }
  }
  return bins_used;
}

function superlative_fit(binsize, items, bins, fit) {
  var bins_used = 1;
  var binarray = new Array(items.length);
  if (binarray === undefined) {
    return 0;
  }
  binarray[0] = binsize;
  for (var item = 0; item < items.length; item++) {
    var candidate = -1; /* Candidate bin */
    var capacity = 0; /* Capacity of the candidate bin */
    for (var bin = 0; bin < bins_used; bin++) {
      /* Does this bin have enough capacity? */
      if (binarray[bin] >= items[item]) {
        /* Is it the best/worst fit seen so far? */
        if (
          candidate == -1 ||
          (fit == "BEST" && binarray[bin] < capacity) ||
          (fit == "WORST" && binarray[bin] > capacity)
        ) {
          candidate = bin;
          capacity = binarray[bin];
        }
      }
    }
    if (candidate != -1) {
      /* Add to candidate bin */
      binarray[candidate] -= items[item];
      bins[item] = candidate;
    } else {
      /* Create a new bin and add to it */
      binarray[bins_used] = binsize - items[item];
      bins[item] = bins_used;
      bins_used++;
    }
  }
  return bins_used;
}

export function best_fit(binsize, items, bins) {
  return superlative_fit(binsize, items, bins, "BEST");
}

export function worst_fit(binsize, items, bins) {
  return superlative_fit(binsize, items, bins, "WORST");
}

function first_fit_decreasing(binsize, items, bins) {
  items.sort(function (a, b) {
    return b - a;
  });
  return first_fit(binsize, items, bins);
}

export function best_fit_decreasing(binsize, items, bins) {
  items.sort(function (a, b) {
    return b - a;
  });
  return best_fit(binsize, items, bins);
}

export function worst_fit_decreasing(binsize, items, bins) {
  items.sort(function (a, b) {
    return b - a;
  });
  return worst_fit(binsize, items, bins);
}
