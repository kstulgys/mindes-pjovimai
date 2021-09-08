//export default {};

import { styles } from "./PDF_Styles"; // Styles of PDF
import React from "react";
import { useStore } from "../../store";
import {
  Box,
  Page,
  Text as TextPDF,
  View,
  Document,
  Font,
} from "@react-pdf/renderer";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { arrayMove } from "@dnd-kit/sortable";
//import { error } from "console";

Font.register({
  family: "Montserrat",
  src: "https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2",
});


export default function PDFDocument1D({ something, otherData }) {
  //   const result = useStore((store) => store.result);
  const projectName = useStore((store) => store.projectName);

  if (!something || something.length===0 || something.error) {
  return (
    <PDFViewer key={1} style={{ width: "100%", height: "100%"}}>
    <Document>
      <Page size="A4" >
        <TableHead />
        <TextPDF>
{/* //{something.error} */}
        </TextPDF>
      </Page>
    </Document>
    </PDFViewer>
  );
 }
  console.log(something);
  console.log('1');
 const totalStockLength = something.reduce((a, b) => a + b.stockLength*b.quantity, 0)
  const totalWaste =something.reduce((a, b) => a + checkIfPositive(b.waste)*b.quantity, 0)
  const percentageWaste = roundToTwo (totalWaste/totalStockLength*100);
   
    function roundToTwo(num) {    
      return Math.round( ( num + Number.EPSILON ) * 100 ) / 100;
    }
  //   const totalStockLength = result.reduce(
  //     (acc, [key, { stockLength, stockQuantity }]) => {
  //       return (acc += Math.round(stockLength * stockQuantity));
  //     },
  //     0
  //   );
  //const date = new Date().toLocaleDateString();


  return (
    <PDFViewer key={1} style={{ width: "100%", height: "100%"}}>
      <Document>
        <Page size="A4" style={{marginLeft:"2cm", marginTop:"1cm", marginBottom:"1cm"}} >
          <View
            style={{
              width:"85%",
              flexDirection: "row",
              // margin: 12,
              fontSize: 24,
              textAlign: "justify",
           //   fontFamily: "Montserrat",
            }}
          >
            <TextPDF style={{ fontSize: 12, lineHeight: 1.6 }}>
              {otherData}
            </TextPDF>
            <TextPDF
              style={{ fontSize: 12, lineHeight: 1.6, marginLeft: "auto" }}
            >
              {todayDateEurope()}
            </TextPDF>
          </View>
          <TableHead />
         
          {something.map((value, index) => {
            return <TableRow key={index} {...value} index={index} />;
          })}
          <TextPDF style={{ fontSize: 12, lineHeight: 1.6, marginTop: 10 }}>
            Total stock length: {totalStockLength} mm
          </TextPDF>
          <TextPDF style={{ fontSize: 12, lineHeight: 1.6 }}>
            Total waste: {totalWaste} mm
          </TextPDF>
          <TextPDF style={{ fontSize: 12, lineHeight: 1.6 }}>
            Percentage of waste: {percentageWaste} %
          </TextPDF>
          {/* <Box style={{top:"0cm"}}> */}
          <TextPDF
            style={{ fontSize: 12, lineHeight: 1.6, textAlign: "center",top:"0cm" }}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
          {/* </Box> */}
        </Page>
      </Document>
    </PDFViewer>
  );
}

function checkIfPositive(number){
  if (number<0) return 0;
  return number;
   }
function TableHead() {
  return (
    <View
      style={{
        width:"85%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        borderStyle: "solid",
        fontSize: 12,
        border: "1px solid",
        borderWidth: 1,
        borderColor: "black",
        paddingHorizontal: 5,
        paddingVertical: 5,
      }}
    >
      <TextPDF style={{ width: "15%" }}>Quantity</TextPDF>
      <TextPDF style={{ width: "20%" }}>Stock length</TextPDF>
      <TextPDF style={{ width: "60%" }}>Cut list</TextPDF>
      <TextPDF style={{ width: "10%" }}>Waste</TextPDF>
    </View>
  );
}

function TableRow({ quantity, stockLength, items, waste, stockName }) {
  return (
    <View
      style={{
        width:"85%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        borderStyle: "solid",
        fontSize: 12,
        border: "1px solid",
        borderWidth: 1,
        borderColor: "black",
        borderTopWidth: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
      }}
    >
      <TextPDF style={{ width: "15%" }}>{quantity}</TextPDF>
      <TextPDF style={{ width: "20%" }}>
        {formatStockValue({ stockLength, stockName })}
      </TextPDF>
      <View style={{ flexDirection: "row", flexWrap: "wrap", width: "60%" }}>
        {items.map(
          ({ cutQuantity, cutLength, cutName, angle1, angle2 }, index) => {
           
            return (
              <TextPDF key={index}>
                {formatCutValue({
                  cutLength,
                  cutQuantity,
                  cutName,
                  angle1,
                  angle2,
                })}
              </TextPDF>
            );
          }
        )}
      </View>
      <TextPDF style={{ width: "10%" }}>{checkIfPositive(waste)}</TextPDF>
    </View>
  );
}

function formatStockValue({ stockLength, stockName }) {
  if (stockLength && stockName) {
    return ` ${stockLength} [${stockName}]`;
  }
  return ` ${stockLength} `;
}

function formatCutValue({ cutQuantity, cutLength, cutName, angle1, angle2 }) {
  if (cutName && cutLength && (angle1 || angle2)) {
    return ` ${angle1 || 0}°([${cutName}] ${cutLength})${angle2 || 0}° x ${cutQuantity}`;
  }
  if (cutLength && (angle1 || angle2)) {
    return ` ${angle1 || 0}°(${cutLength})${angle2 || 0}° x ${cutQuantity}`;
  }
  if (cutName && cutLength) {
    return ` ([${cutName}] ${cutLength}) x ${cutQuantity}`;
  }
  return ` ${cutLength} x ${cutQuantity}`;
}


function todayDateEurope(){
  var d = new Date(); 
  var mm = d.getMonth() + 1;
  var dd = d.getDate();
  var yy = d.getFullYear();
  if(mm<10 && dd<10 ) return yy + '-0' + mm + '-0' + dd;
  if(mm<10) return yy + '-0' + mm + '-' + dd;
  if(dd<10) return yy + '-' + mm + '-0' + dd;
  return yy + '-' + mm + '-' + dd; //(LT :))
}