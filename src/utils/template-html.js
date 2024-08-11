const templateHtmlAfterLogin = (data) => {
  const redirectUrl = `http://127.0.0.1:5500/index.html?token=${data}`;
  const htmlContent = `
      <!DOCTYPE html>
        <html>
        <head>
          <title>Redirect and Close</title>
          <script type="text/javascript">
            // Buka tab baru dengan URL tertentu
            const newTab = window.open('${redirectUrl}', '_blank');

            // Tunggu beberapa detik untuk memastikan tab baru terbuka
            setTimeout(() => {
              
              // Tutup tab saat ini setelah membuka tab baru
              window.close();

              // Jika tab tidak menutup otomatis, beri instruksi kepada pengguna
              setTimeout(() => {
                document.getElementById('fallback').style.display = 'block';
              }, 1000);

            }, 3000); // Sesuaikan dengan waktu yang diinginkan
          </script>
        </head>
        <body>
          <p>Menutup tab...</p>
          <div id="fallback" style="display:none;">
            <p>Jika tab tidak tertutup, <a href="javascript:window.close();">klik di sini</a>.</p>
          </div>
        </body>
      </html>
      `;

  return htmlContent;
};

const templateHtmlAccountNotActive = (data) => {
  const htmlContent = `
    <!DOCTYPE html>
        <html>
        <head>
          <title>Silahkan cek Email anda!</title>
        </head>
        <body>
          <p>${data}</p>
        </body>
      </html>
  `;

  return htmlContent;
};

module.exports = {
  templateHtmlAfterLogin,
  templateHtmlAccountNotActive,
};
