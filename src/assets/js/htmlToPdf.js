import $ from 'jquery';
import html2pdf from 'html2pdf.js'; // html2pdf 라이브러리 import

const htmlToPdf = (location, fileName) => {
  html2pdf()
    .set({
      margin: 0,
      filename:
        navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1
          ? `${fileName}.pdf`
          : fileName,
      pagebreak: { mode: 'avoid-all' },
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scrollY: 0,
        scale: 3,
        letterRendering: true,
        allowTaint: false,
        useCORS: true,
      },
      jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a2' },
    })
    .from(location)
    .toPdf()
    .get('pdf')
    .then(function (pdf) {
      const containerTotalPdf = document.querySelector('.container-total-pdf');
      if (containerTotalPdf) {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          if (i === 1) continue;
          pdf.setPage(i);
          pdf.setFontSize(16);
          pdf.setTextColor(80);
          pdf.text(
            '' + (i - 1),
            pdf.internal.pageSize.getWidth() * 0.94,
            pdf.internal.pageSize.getHeight() * 0.935
          );
        }
      }

      $('.modal').modal('hide');
    })
    .save();
};

export default {
  install(app, options = {}) {
    app.config.globalProperties.$htmlToPdf = htmlToPdf;
  }
};
