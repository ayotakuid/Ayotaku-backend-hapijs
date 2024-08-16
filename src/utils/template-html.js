const templateHtmlAfterLogin = (data, isLogin) => {
  const redirectUrl = `http://localhost:5173/?token=${data}&isLogin=${isLogin}`;
  const htmlContent = `
      <!DOCTYPE html>
        <html>
        <head>
          <title>Redirect and Close</title>
          <script type="text/javascript">
            // Buka tab baru dengan URL tertentu
            
            // Tunggu beberapa detik untuk memastikan tab baru terbuka
            setTimeout(() => {
              
              // Tutup tab saat ini setelah membuka tab baru
              const newTab = window.open('${redirectUrl}', '_blank');
              window.close();

            }, 500); // Sesuaikan dengan waktu yang diinginkan
          </script>
        </head>
        <body>
        loading redirect...
        </body>
      </html>
      `;

  return htmlContent;
};

const templateHtmlAccountNotActive = (data) => {
  const redirect = `http://localhost:5173/register?account=${data}`;
  const htmlContent = `
    <!DOCTYPE html>
        <html>
        <head>
          <title>Silahkan cek Email anda!</title>
          <script type="text/javascript">
            // Buka tab baru dengan URL tertentu
            
            // Tunggu beberapa detik untuk memastikan tab baru terbuka
            setTimeout(() => {
              
              // Tutup tab saat ini setelah membuka tab baru
              const newTab = window.open('${redirect}', '_blank');
              window.close();

            }, 2000); // Sesuaikan dengan waktu yang diinginkan
          </script>
        </head>
        <body>
          <p>loading redirect...</p>
        </body>
      </html>
  `;

  return htmlContent;
};

module.exports = {
  templateHtmlAfterLogin,
  templateHtmlAccountNotActive,
};
