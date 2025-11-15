import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts"; 
import { GoDownload } from "react-icons/go";


const LinkStatsPDF = ({ linkData }) => {
  const generatePDF = () => {

    const createTableData = (stats) => {
      const rows = [
        [{ text: "Location", bold: true }, { text: "Clicks", bold: true }]
      ];
      
      Object.entries(stats).forEach(([country, countryData]) => {
        rows.push([
          { text: country, bold: true },
          { text: `Total: ${countryData.count}` }
        ]);
        Object.entries(countryData.cities).forEach(([city, count]) => {
          rows.push([
            { text: `      ${city}`, italics: true }, 
            count
          ]);
        });
      });
      return rows;
    };
     
    const docDefinition = {
      content: [
        { text: "Link Analytics Report", style: "header" },
     
        { text: `Short URL: ${linkData.shortUrl}`, margin: [0, 5, 0, 0] },
        { text: `Destination URL: ${linkData.destinationUrl}`, margin: [0, 0, 0, 0] },
        { text: `Total Clicks: ${linkData.clicks}`, margin: [0, 0, 0, 15] },

        { text: "Browser Stats", style: "subheader" },
        {
          style: "table",
          table: {
            widths: ["*", "auto"],
            body: [
              [{ text: "Browser", bold: true }, { text: "Clicks", bold: true }],
              ...Object.entries(linkData.browserStats).map(([b, c]) => [b, c.toString()])
            ]
          },
          margin: [0, 5, 0, 15]
        },

        { text: "Device Stats", style: "subheader" },
        {
          style: "table",
          table: {
            widths: ["*", "auto"],
            body: [
              [{ text: "Device", bold: true }, { text: "Clicks", bold: true }],
              ...Object.entries(linkData.deviceStats).map(([d, c]) => [d, c.toString()])
            ]
          },
          margin: [0, 5, 0, 15]
        },
        
        { text: "OS Stats", style: "subheader" },
        {
          style: "table",
          table: {
            widths: ["*", "auto"],
            body: [
              [{ text: "OS", bold: true }, { text: "Clicks", bold: true }],
              ...Object.entries(linkData.osStats).map(([o, c]) => [o, c.toString()])
            ]
          },
          margin: [0, 5, 0, 15]
        },

        { text: "Country / City Stats", style: "subheader" },
        {
          style: "table",
          table: {
            headerRows: 1,
            widths: ["*", "auto"],
            body: createTableData(linkData.stats)
          },
          layout: 'lightHorizontalLines'
        }
      ],
      
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 0]
        },
        table: {}
      },
      
      defaultStyle: {
        fontSize: 10,
      }
    };

  
    pdfMake.createPdf(docDefinition).download("link_analytics_report.pdf");
  };

  return <button className="btn bg-blue-500 text-white" onClick={generatePDF}><GoDownload />Download PDF</button>;
};

export default LinkStatsPDF;