import React from 'react'
import { useStore } from '../../store'
import { Page, Text as TextPDF, View, Document, StyleSheet, Font } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    fontSize: '2rem',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald',
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Oswald',
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Montserrat',
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
})

// Font.register({
//   family: 'Montserrat',
//   src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2',
// })

export function PDFDocument1D() {
  const result1D = useStore((store) => store.result1D)

  if (!result1D?.length) {
    return (
      <Document>
        <Page size="A4" style={styles.body}>
          <TableHead />
        </Page>
      </Document>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <TableHead />
        {result1D.map(([key, value], index) => {
          return <TableRow key={key} {...value} index={index} />
        })}
        <TextPDF
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

function TableHead() {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        borderStyle: 'solid',
        fontSize: 12,
        border: '1px solid',
        borderWidth: 1,
        borderColor: 'black',
        paddingHorizontal: 5,
        paddingVertical: 5,
      }}
    >
      <TextPDF style={{ width: '15%' }}>Quantity</TextPDF>
      <TextPDF style={{ width: '15%' }}>Stock length</TextPDF>
      <TextPDF style={{ width: '55%' }}>Cut list</TextPDF>
      <TextPDF style={{ width: '15%' }}>Waste (mm)</TextPDF>
    </View>
  )
}

function TableRow({ count, stockLength, items, capacity }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        borderStyle: 'solid',
        fontSize: 12,
        border: '1px solid',
        borderWidth: 1,
        borderColor: 'black',
        borderTopWidth: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
      }}
    >
      <TextPDF style={{ width: '15%' }}>{count}</TextPDF>
      <TextPDF style={{ width: '15%' }}>{stockLength}</TextPDF>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '55%' }}>
        {items.map(({ size, name }, index) => {
          const innerText = name ? ` ([${name}] ${size}) ` : ` ${size} `
          return <TextPDF key={index}>{innerText}</TextPDF>
        })}
      </View>
      <TextPDF style={{ width: '15%' }}>{capacity}</TextPDF>
    </View>
  )
}
