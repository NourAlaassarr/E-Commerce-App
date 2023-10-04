const baseUrl = `http://localhost:3000`
const clientIo = io(baseUrl)

// clientIo.emit('requestAlldata')
// let allData = []
// clientIo.on('returnData', (data) => {
//   allData = data.products
//   displayData(allData)
// })

displayData()

//================= product data ==================
$('.createProduct').click(async () => {
  const data = {
    title: $('.title').val(),
    desc: $('.desc').val(),
    stock: $('.stock').val(),
    price: $('.price').val(),
    appliedDiscount: $('.appliedDiscount').val(),
    categoryId: $('.categoryId').val(),
    subCategoryId: $('.subCategoryId').val(),
    brandId: $('.brandId').val(),
  }
  // console.log({ data })
  // clientIo.emit('sendData', data)

  await axios({
    method: 'POST',
    url: `${baseUrl}/product`,
    data,
  })
})

clientIo.on('addedDone', (data) => {
  displayData()
})

async function displayData() {
  // ================================= get all data by axios ==========================
  await axios({
    method: 'GET',
    url: `${baseUrl}/product`,
  }).then((res) => {
    console.log(res)
    let cartona = ``
    for (const product of res.data.data) {
      cartona += `
      <div class="col-md-4 my-2">
        <div class="p-2 border border-success text-center" >
        <h3>${product.title}</h3>
        <p>${product.desc}</p>
        <h3>${product.price}</h3>
        </div>
      </div>`
    }
    document.getElementById('rowData').innerHTML = cartona
  })
}

// break 8:35
