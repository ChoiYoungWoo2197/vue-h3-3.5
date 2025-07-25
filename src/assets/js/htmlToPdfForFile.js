import $ from 'jquery';
import 'regenerator-runtime/runtime'
import html2pdf from 'html2pdf.js'; //html2pdf 라이브러리 import


async function htmlToPdf(location, fileName) {
  let data;

  await html2pdf()
  .set({
    margin: 0,
    // filename에서 IE11은 .pdf를 자동으로 넣어주지 않아 .pdf를 파일 명에 넣어줘야 한다.
    filename: navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1 ? `${fileName}.pdf` : fileName,
    pagebreak: { mode: 'avoid-all' },
    image: { type: 'jpeg', quality: 0.98},
    html2canvas: {
      scrollY: 0,
      scale: 2,
      letterRendering: true,
      allowTaint : false,
      useCORS: true
    },
    jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a2'},
  })
  .from(location)
  .outputPdf('arraybuffer')
  .then(function(pdf) {
    data = pdf;
   // PDF를 FormData로 변환
  //  data = new FormData();
  //  data.append('file', new Blob([pdf], { type: 'application/pdf' }), 'generated_pdf.pdf');
   $('.modal').modal('hide')
  })
  .catch(error => {
    console.error('PDF 생성 실패:', error);
  });

  return data;
}


export {
  htmlToPdf
 };