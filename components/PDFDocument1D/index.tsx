//export default {};

import { styles } from './PDF_Styles'; // Styles of PDF
import React from 'react';
import { useStore } from '../../store';
import { Page, Text as TextPDF, View, Document, Font } from '@react-pdf/renderer';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { arrayMove } from '@dnd-kit/sortable';
//import { error } from "console";

Font.register({
  family: 'Montserrat',
  src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2',
});

export default function PDFDocument1D({ something, defaultData }) {
  //   const result = useStore((store) => store.result);
  const projectName = useStore((store) => store.projectName);


  if (!something || something.length === 0 || something.error) {
    return (
      <PDFViewer key={1} style={{ width: '100%', height: '100%', maxHeight: '2000px' }}>
        <Document>
          <Page size="A4" style={{ marginLeft: '2cm', marginTop: '0.5cm', marginBottom: '1cm', width: '3cm' }}>
            <TextPDF style={{ fontSize: 10, color: 'gray', lineHeight: 1.6, marginLeft: '30%', marginBottom: '10px' }}>
              Made by www.yompti.com
            </TextPDF>
            <DefaultPageView defaultData={defaultData} />
            <TableHead />
            <View
              style={{
                width: '85%',
                flexDirection: 'row',
                //margin: 12,
                fontSize: 24,
                textAlign: 'justify',
                // fontFamily: "Montserrat",
              }}
              fixed
            >
              <TextPDF>{something.error}</TextPDF>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  }
  // console.log(something);
  // console.log('1');
  const totalStockLength = something.reduce((a, b) => a + b.stockLength * b.quantity, 0);
  const totalWaste = something.reduce((a, b) => a + checkIfPositive(b.waste) * b.quantity, 0);
  const percentageWaste = roundToTwo((totalWaste / totalStockLength) * 100);
  function roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
  //   const totalStockLength = result.reduce(
  //     (acc, [key, { stockLength, stockQuantity }]) => {
  //       return (acc += Math.round(stockLength * stockQuantity));
  //     },
  //     0
  //   );
  //const date = new Date().toLocaleDateString();

  return (
    <PDFViewer key={1} style={{ width: '100%', height: '100%', maxHeight: '2000px' }}>
      <Document>
        <Page size="A4" style={{ marginLeft: '2cm', marginTop: '0.5cm', marginBottom: '10cm', marginRight: '6cm' }}>
          <TextPDF
            style={{ fontSize: 10, color: 'gray', lineHeight: 1.6, marginLeft: '30%', marginBottom: '10px' }}
            fixed
          >
            Made by www.yompti.com
          </TextPDF>
          <DefaultPageView defaultData={defaultData} />
          <TableHead />
          {something.map((value, index) => {
            return <TableRow key={index} {...value} index={index} defaultData={defaultData} />;
          })}
          <TextPDF style={{ fontSize: 12, lineHeight: 1.6, marginTop: 10 }}>
            Total stock length: {totalStockLength} mm
          </TextPDF>
          <TextPDF style={{ fontSize: 12, lineHeight: 1.6 }}>Total waste: {totalWaste} mm</TextPDF>
          <TextPDF style={{ fontSize: 12, lineHeight: 1.6 }}>Percentage of waste: {percentageWaste} %</TextPDF>
          {/* <Box style={{top:"0cm"}}> */}
          <TextPDF
            style={{ fontSize: 12, lineHeight: 1.6, marginLeft: '40%', marginBottom: '1cm', marginTop: '3mm' }}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
          {/* </Box> */}
        </Page>
      </Document>
    </PDFViewer>
  );
}

function checkIfPositive(number) {
  if (number < 0) return 0;
  return number;
}

function DefaultPageView({ defaultData }) {
  return (
    <View
      style={{
        width: '85%',
        flexDirection: 'row',
        //margin: 12,
        fontSize: 24,
        textAlign: 'justify',
        // fontFamily: "Montserrat",
      }}
      fixed
    >
      <TextPDF style={{ fontSize: 12, lineHeight: 1 }}>{defaultData.projectName}</TextPDF>
      <TextPDF style={{ fontSize: 12, lineHeight: 1.6, marginLeft: '30%' }}>
        Blade size: {defaultData.bladeSize}
      </TextPDF>
      <TextPDF style={{ fontSize: 12, lineHeight: 1.6, marginLeft: 'auto' }}>{todayDateEurope()}</TextPDF>
    </View>
  );
}
function TableHead() {
  return (
    <View
      style={{
        width: '85%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderStyle: 'solid',
        fontSize: 12,
        border: '1px solid',
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 5,
        paddingVertical: 5,
      }}
      fixed
    >
      <TextPDF style={{ width: '15%' }}>Quantity</TextPDF>
      <TextPDF style={{ width: '20%' }}>Stock length</TextPDF>
      <TextPDF style={{ width: '60%' }}>Cut list</TextPDF>
      <TextPDF style={{ width: '10%' }}>Waste</TextPDF>
    </View>
  );
}

function TableRow({ quantity, stockLength, items, waste, stockName, defaultData }) {
  return (
    <View
      style={{
        width: '85%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderStyle: 'solid',
        fontSize: 11,
        border: '1px solid',
        borderWidth: 1,
        borderColor: 'black',
        borderTopWidth: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
      }}
    >
      <TextPDF style={{ width: '15%' }}>{quantity}</TextPDF>
      <TextPDF style={{ width: '20%' }}>{formatStockValue({ stockLength, stockName })}</TextPDF>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '60%' }}>
        {items.map(({ cutQuantity, cutLength, cutName, angle1, angle2 }, index) => {
          return (
            <TextPDF key={index}>
              {formatCutValue({
                cutLength,
                cutQuantity,
                cutName,
                angle1,
                angle2,
                defaultData,
              })}
            </TextPDF>
          );
        })}
      </View>
      <TextPDF style={{ width: '10%' }}>{checkIfPositive(waste)}</TextPDF>
    </View>
  );
}

function formatStockValue({ stockLength, stockName }) {
  if (stockLength && stockName) {
    return ` ${stockLength} [${stockName}]`;
  }
  return ` ${stockLength} `;
}

function formatCutValue({ cutQuantity, cutLength, cutName, angle1, angle2, defaultData }) {
  if (!defaultData.groupIndentical) {
    let name = '';
    for (let index = 0; index < cutQuantity; index++) {
      if (defaultData.showNames && defaultData.showAngles && cutName && cutLength && (angle1 || angle2)) {
        name += `|${angle1 || 0}°([${cutName}] ${cutLength})${angle2 || 0}°| `;
        continue;
      }
      if (defaultData.showAngles && cutLength && (angle1 || angle2)) {
        name += `|${angle1 || 0}°(${cutLength})${angle2 || 0}°| `;
        continue;
      }
      if (defaultData.showNames && cutName && cutLength) {
        name += `|([${cutName}] ${cutLength})| `;
        continue;
      }
      name += `|${cutLength}| `;
      continue;
    }
    return name;
  }
  if (defaultData.showNames && defaultData.showAngles && cutName && cutLength && (angle1 || angle2)) {
    return `|${angle1 || 0}°([${cutName}] ${cutLength})${angle2 || 0}° x ${cutQuantity}| `;
  }
  if (defaultData.showAngles && cutLength && (angle1 || angle2)) {
    return `|${angle1 || 0}°(${cutLength})${angle2 || 0}° x ${cutQuantity}| `;
  }
  if (defaultData.showNames && cutName && cutLength) {
    return `|([${cutName}] ${cutLength}) x ${cutQuantity}| `;
  }
  return `|${cutLength} x ${cutQuantity}| `;
}

function todayDateEurope() {
  const d = new Date();
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const yy = d.getFullYear();
  if (mm < 10 && dd < 10) return yy + '-0' + mm + '-0' + dd;
  if (mm < 10) return yy + '-0' + mm + '-' + dd;
  if (dd < 10) return yy + '-' + mm + '-0' + dd;
  return yy + '-' + mm + '-' + dd; //(LT :))
}
