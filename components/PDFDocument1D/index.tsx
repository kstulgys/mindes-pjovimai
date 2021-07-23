export default {};

// import React from "react";
// import { useStore } from "../../store";
// import {
//   Page,
//   Text as TextPDF,
//   View,
//   Document,
//   StyleSheet,
//   Font,
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   body: {
//     paddingTop: 35,
//     paddingBottom: 65,
//     paddingHorizontal: 35,
//     display: "flex",
//     flexDirection: "column",
//     width: "100%",
//     fontSize: "2rem",
//   },
//   title: {
//     fontSize: 24,
//     textAlign: "center",
//     fontFamily: "Oswald",
//   },
//   author: {
//     fontSize: 12,
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   subtitle: {
//     fontSize: 18,
//     margin: 12,
//     fontFamily: "Oswald",
//   },
//   text: {
//     margin: 12,
//     fontSize: 14,
//     textAlign: "justify",
//     fontFamily: "Montserrat",
//   },
//   image: {
//     marginVertical: 15,
//     marginHorizontal: 100,
//   },
//   header: {
//     fontSize: 12,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "grey",
//   },
//   pageNumber: {
//     position: "absolute",
//     fontSize: 12,
//     bottom: 30,
//     left: 0,
//     right: 0,
//     textAlign: "center",
//     color: "grey",
//   },
// });

// // Font.register({
// //   family: 'Montserrat',
// //   src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2',
// // })

// export function PDFDocument1D() {
//   const result = useStore((store) => store.result);
//   const projectName = useStore((store) => store.projectName);

//   if (!result?.length) {
//     return (
//       <Document>
//         <Page size="A4" style={styles.body}>
//           {/* <TableHead /> */}
//         </Page>
//       </Document>
//     );
//   }

//   const totalWaste = result.reduce((acc, [key, { quantity, capacity }]) => {
//     return (acc += Math.round(quantity * capacity));
//   }, 0);

//   const totalStockLength = result.reduce(
//     (acc, [key, { stockLength, quantity }]) => {
//       return (acc += Math.round(stockLength * quantity));
//     },
//     0
//   );
//   const date = new Date().toLocaleDateString();

//   return (
//     <Document>
//       <Page size="A4" style={styles.body}>
//         <View style={{ flexDirection: "row" }}>
//           <TextPDF style={{ fontSize: 12, lineHeight: 1.6 }}>
//             {projectName}
//           </TextPDF>
//           <TextPDF
//             style={{ fontSize: 12, lineHeight: 1.6, marginLeft: "auto" }}
//           >
//             {date}
//           </TextPDF>
//         </View>
//         <TableHead />
//         {result.map(([key, value], index) => {
//           return <TableRow key={key} {...value} index={index} />;
//         })}
//         <TextPDF style={{ fontSize: 12, lineHeight: 1.6, marginTop: 10 }}>
//           Total stock length: {totalStockLength} mm
//         </TextPDF>
//         <TextPDF style={{ fontSize: 12, lineHeight: 1.6 }}>
//           Total waste: {totalWaste} mm
//         </TextPDF>
//         <TextPDF
//           style={styles.pageNumber}
//           render={({ pageNumber, totalPages }) =>
//             `${pageNumber} / ${totalPages}`
//           }
//           fixed
//         />
//       </Page>
//     </Document>
//   );
// }

// function TableHead() {
//   return (
//     <View
//       style={{
//         display: "flex",
//         flexDirection: "row",
//         width: "100%",
//         justifyContent: "space-around",
//         borderStyle: "solid",
//         fontSize: 12,
//         border: "1px solid",
//         borderWidth: 1,
//         borderColor: "black",
//         paddingHorizontal: 5,
//         paddingVertical: 5,
//       }}
//     >
//       <TextPDF style={{ width: "10%" }}>Quantity</TextPDF>
//       <TextPDF style={{ width: "20%" }}>Stock length</TextPDF>
//       <TextPDF style={{ width: "60%" }}>Cut list</TextPDF>
//       <TextPDF style={{ width: "10%" }}>Waste</TextPDF>
//     </View>
//   );
// }

// function TableRow({ quantity, stockLength, items, capacity, stockName }) {
//   return (
//     <View
//       style={{
//         display: "flex",
//         flexDirection: "row",
//         width: "100%",
//         justifyContent: "space-around",
//         borderStyle: "solid",
//         fontSize: 12,
//         border: "1px solid",
//         borderWidth: 1,
//         borderColor: "black",
//         borderTopWidth: 0,
//         paddingHorizontal: 5,
//         paddingVertical: 5,
//       }}
//     >
//       <TextPDF style={{ width: "10%" }}>{quantity}</TextPDF>
//       <TextPDF style={{ width: "20%" }}>
//         {formatStockValue({ stockLength, stockName })}
//       </TextPDF>
//       <View style={{ flexDirection: "row", flexWrap: "wrap", width: "60%" }}>
//         {items.map(({ cutLength, quantity, name, angle1, angle2 }, index) => {
//           return (
//             <TextPDF key={index}>
//               {formatCutValue({ cutLength, quantity, name, angle1, angle2 })}
//             </TextPDF>
//           );
//         })}
//       </View>
//       <TextPDF style={{ width: "10%" }}>{capacity}</TextPDF>
//     </View>
//   );
// }

// function formatStockValue({ stockLength, stockName }) {
//   if (stockLength && stockName) {
//     return ` ${stockLength} [${stockName}]`;
//   }
//   return ` ${stockLength} `;
// }

// function formatCutValue({ cutLength, quantity, name, angle1, angle2 }) {
//   if (name && cutLength && (angle1 || angle2)) {
//     return ` ${angle1 || 0}°([${name}] ${cutLength})${angle2 || 0}°`;
//   }
//   if (cutLength && (angle1 || angle2)) {
//     return ` ${angle1 || 0}°(${cutLength})${angle2 || 0}°`;
//   }
//   if (name && cutLength) {
//     return ` ([${name}] ${cutLength}) `;
//   }
//   return ` ${cutLength} `;
// }
